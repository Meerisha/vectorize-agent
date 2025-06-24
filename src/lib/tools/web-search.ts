import axios from 'axios';
import { Tool, ToolResult, WebSearchResult } from '../types';

export class WebSearchTool implements Tool {
  name = 'web_search';
  description = 'Search the internet for current information and news. Use this when you need up-to-date information that might not be in the knowledge base.';
  
  parameters = {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query to find information on the web'
      },
      max_results: {
        type: 'number',
        description: 'Maximum number of search results to return (default: 5)',
        default: 5
      }
    },
    required: ['query']
  };

  async execute(args: { query: string; max_results?: number }): Promise<ToolResult> {
    try {
      const { query, max_results = 5 } = args;
      
      console.log(`🌐 Searching web for: "${query}"`);
      
      // Using DuckDuckGo Instant Answer API (free, no API key required)
      const url = 'https://api.duckduckgo.com/';
      const params = {
        q: query,
        format: 'json',
        no_html: '1',
        skip_disambig: '1'
      };

      const response = await axios.get(url, { 
        params,
        timeout: 10000,
        headers: {
          'User-Agent': 'TypeScript-Agent/1.0'
        }
      });

      const data = response.data;
      const results: WebSearchResult[] = [];

      // Process DuckDuckGo results
      if (data.Abstract && data.Abstract.length > 0) {
        results.push({
          title: data.Heading || 'DuckDuckGo Summary',
          url: data.AbstractURL || '',
          snippet: data.Abstract
        });
      }

      // Add related topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, max_results - results.length)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || 'Related Topic',
              url: topic.FirstURL,
              snippet: topic.Text
            });
          }
        }
      }

      // If no results from DuckDuckGo, create a mock result indicating web search was attempted
      if (results.length === 0) {
        results.push({
          title: `Web Search Results for: ${query}`,
          url: 'https://duckduckgo.com/?q=' + encodeURIComponent(query),
          snippet: `No direct results found for "${query}". This indicates the web search was performed but didn't return specific content. You may want to try a different search query or check the DuckDuckGo link for more comprehensive results.`
        });
      }

      console.log(`🔍 Found ${results.length} web results`);
      
      return {
        success: true,
        data: {
          query,
          num_results: results.length,
          results: results.slice(0, max_results)
        }
      };

    } catch (error: any) {
      console.error('❌ Web search error:', error.message);
      
      return {
        success: false,
        error: `Failed to search web: ${error.message}`
      };
    }
  }
} 