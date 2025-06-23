import { Configuration, PipelinesApi } from "@vectorize-io/vectorize-client";
import OpenAI from 'openai';

export interface VectorizeDocument {
  id?: string;
  content?: string;
  metadata?: Record<string, any>;
  score?: number;
}

export class VectorizeClientAgent {
  private vectorizeApi: PipelinesApi;
  private openaiClient?: OpenAI;
  private orgId: string;
  private pipelineId: string;

  constructor(
    vectorizeToken: string,
    orgId: string,
    pipelineId: string,
    openaiApiKey?: string
  ) {
    this.orgId = orgId;
    this.pipelineId = pipelineId;

    // Initialize Vectorize client
    const config = new Configuration({
      accessToken: vectorizeToken,
      basePath: "https://api.vectorize.io/v1",
    });
    this.vectorizeApi = new PipelinesApi(config);

    // Optional OpenAI client for additional processing
    if (openaiApiKey) {
      this.openaiClient = new OpenAI({
        apiKey: openaiApiKey
      });
    }
  }

  async retrieveDocuments(question: string, numResults: number = 5): Promise<VectorizeDocument[]> {
    try {
      console.log(`🔍 Searching for: "${question}"`);
      
      const response = await this.vectorizeApi.retrieveDocuments({
        organization: this.orgId,
        pipeline: this.pipelineId,
        retrieveDocumentsRequest: {
          question: question,
          numResults: numResults,
        }
      });

      const documents = response.documents || [];
      console.log(`📚 Found ${documents.length} documents`);
      
      return documents.map(doc => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata,
        score: doc.score
      }));

    } catch (error: any) {
      console.error('❌ Vectorize retrieval error:', error?.response?.status);
      if (error?.response?.text) {
        console.error(await error.response.text());
      }
      throw error;
    }
  }

  async chatWithRAG(question: string, model: string = 'gpt-4'): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not configured. Please provide an OpenAI API key.');
    }

    try {
      console.log(`💬 User: ${question}`);

      // Step 1: Retrieve relevant documents
      const documents = await this.retrieveDocuments(question, 3);
      
      // Step 2: Build context from retrieved documents
      const context = documents
        .map(doc => `Document: ${doc.content}`)
        .join('\n\n');

      // Step 3: Generate response using OpenAI with RAG context
      const prompt = `Based on the following context documents, please answer the user's question.

Context:
${context}

Question: ${question}

Please provide a comprehensive answer based on the context provided. If the context doesn't contain enough information, please say so.`;

      const response = await this.openaiClient.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const answer = response.choices[0].message.content || 'No response generated.';
      console.log(`🤖 Assistant: ${answer}`);
      return answer;

    } catch (error: any) {
      console.error('❌ RAG Chat error:', error.message);
      return `I encountered an error: ${error.message}. Please try again.`;
    }
  }

  async searchOnly(question: string, numResults: number = 5): Promise<VectorizeDocument[]> {
    return await this.retrieveDocuments(question, numResults);
  }

  getConfiguration(): { orgId: string, pipelineId: string } {
    return {
      orgId: this.orgId,
      pipelineId: this.pipelineId
    };
  }
} 