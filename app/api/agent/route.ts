import { ToolInvocation, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}

// RAG Document Retrieval Function
async function retrieveDocuments({ question, numResults = 5 }) {
  try {
    const token = process.env.VECTORIZE_API_KEY;
    const orgId = process.env.VECTORIZE_ORG_ID || '87ca0e06-b815-4e5d-9e1a-730d1e25fddf';
    const pipelineId = process.env.VECTORIZE_PIPELINE_ID || 'aip30bf3-8601-4c1c-bc92-9d5436d70326';
    
    if (!token) {
      throw new Error('Vectorize API key not configured');
    }

    const url = `https://api.vectorize.io/v1/org/${orgId}/pipelines/${pipelineId}/retrieval`;
    
    const response = await axios.post(url, {
      question: question,
      numResults: numResults,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    const documents = response.data.documents || [];
    return documents;
  } catch (error: any) {
    console.error('Vectorize retrieval error:', error.message);
    return [];
  }
}

// Web Search Function
async function searchWeb({ query, maxResults = 5 }) {
  try {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    
    const response = await axios.get(searchUrl, {
      timeout: 8000,
      headers: {
        'User-Agent': 'AI-Agent/1.0'
      }
    });

    const data = response.data;
    const results: any[] = [];

    // Add instant answer if available
    if (data.Abstract && data.Abstract.trim()) {
      results.push({
        title: data.Heading || 'Instant Answer',
        content: data.Abstract,
        url: data.AbstractURL || '',
        source: data.AbstractSource || 'DuckDuckGo',
        type: 'instant_answer'
      });
    }

    // Add related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, maxResults - results.length)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related Topic',
            content: topic.Text,
            url: topic.FirstURL,
            source: 'DuckDuckGo',
            type: 'related_topic'
          });
        }
      }
    }

    return results;
  } catch (error: any) {
    console.error('Web search error:', error.message);
    return [];
  }
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  // Configure OpenAI client to use Vectorize endpoint
  const vectorizeOpenAI = createOpenAI({
    apiKey: process.env.VECTORIZE_API_KEY || process.env.OPENAI_API_KEY || '',
    baseURL: `https://api.vectorize.io/v1/org/${process.env.VECTORIZE_ORG_ID || '87ca0e06-b815-4e5d-9e1a-730d1e25fddf'}/pipelines/${process.env.VECTORIZE_PIPELINE_ID || 'aip30bf3-8601-4c1c-bc92-9d5436d70326'}`
  });

  const result = await streamText({
    model: vectorizeOpenAI('gpt-4o'),
    system: `You are a helpful AI assistant with access to two powerful tools:

1. vectorize_retrieval: Search and retrieve relevant documents from a knowledge base using semantic search
2. web_search: Search the internet for current information and news

Use these tools strategically:
- Use vectorize_retrieval for finding information that might be in your knowledge base
- Use web_search for current events, recent information, or when knowledge base doesn't have relevant results
- You can use both tools in sequence for comprehensive answers
- Always explain your reasoning and cite your sources

Be conversational, helpful, and thorough in your responses.`,
    messages,
    maxSteps: 5,
    tools: {
      vectorize_retrieval: {
        description: 'Search and retrieve relevant documents from the knowledge base using semantic search',
        parameters: z.object({
          question: z.string().describe('The search query to find relevant documents'),
          numResults: z.number().optional().describe('Number of results to return (default: 5)').default(5),
        }),
        execute: async ({ question, numResults }: { question: string, numResults?: number }) => {
          console.log(`🔍 Searching knowledge base for: "${question}"`);
          
          const documents = await retrieveDocuments({ question, numResults });
          
          if (documents.length === 0) {
            return `No relevant documents found in the knowledge base for: "${question}"`;
          }

          const formattedDocs = documents.map((doc: any, index: number) => 
            `Document ${index + 1}: ${doc.content || 'No content available'} ${doc.metadata ? `(Metadata: ${JSON.stringify(doc.metadata)})` : ''}`
          ).join('\n\n');

          return `Found ${documents.length} relevant documents from knowledge base:\n\n${formattedDocs}`;
        },
      },
      web_search: {
        description: 'Search the internet for current information and news',
        parameters: z.object({
          query: z.string().describe('The search query to find information on the web'),
          maxResults: z.number().optional().describe('Maximum number of results to return (default: 5)').default(5),
        }),
        execute: async ({ query, maxResults }: { query: string, maxResults?: number }) => {
          console.log(`🌐 Searching web for: "${query}"`);
          
          const results = await searchWeb({ query, maxResults });
          
          if (results.length === 0) {
            return `No web search results found for: "${query}"`;
          }

          const formattedResults = results.map((result, index) => 
            `${index + 1}. ${result.title}\n   ${result.content}\n   Source: ${result.source} (${result.url})`
          ).join('\n\n');

          return `Found ${results.length} web search results:\n\n${formattedResults}`;
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
