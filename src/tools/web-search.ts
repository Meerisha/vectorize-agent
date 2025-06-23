import axios from 'axios';
import * as cheerio from 'cheerio';
import { Tool, ToolResult } from '../types';

export interface WebSearchParams {
  query: string;
  max_results?: number;
}

export class WebSearchTool implements Tool {
  name = 'web_search';
  description = 'Search the internet for current information and news';
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

  async execute(params: WebSearchParams): Promise<ToolResult> {
    try {
      const { query, max_results = 5 } = params;

      if (!query || query.trim() === '') {
        return {
          success: false,
          error: 'Query parameter is required and cannot be empty'
        };
      }

      console.log(`🌐 Searching web for: "${query}"`);

      // Using DuckDuckGo Instant Answer API (free, no API key required)
      const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await axios.get(searchUrl, {
        timeout: 8000,
        headers: {
          'User-Agent': 'TypeScript-Agent/1.0'
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
        for (const topic of data.RelatedTopics.slice(0, max_results - results.length)) {
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

      // Add definition if available
      if (data.Definition && data.DefinitionURL) {
        results.push({
          title: `Definition: ${query}`,
          content: data.Definition,
          url: data.DefinitionURL,
          source: data.DefinitionSource || 'Dictionary',
          type: 'definition'
        });
      }

      // If we don't have enough results, try to get more from search results
      if (results.length < max_results && data.Results && Array.isArray(data.Results)) {
        for (const result of data.Results.slice(0, max_results - results.length)) {
          results.push({
            title: result.Text.split(' - ')[0] || 'Search Result',
            content: result.Text,
            url: result.FirstURL,
            source: 'DuckDuckGo',
            type: 'search_result'
          });
        }
      }

      console.log(`🔍 Found ${results.length} web search results`);

      return {
        success: true,
        data: {
          query,
          results: results.slice(0, max_results),
          count: results.length,
          source: 'DuckDuckGo API'
        }
      };

    } catch (error: any) {
      console.error('❌ Web search error:', error.message);
      
      if (error.response) {
        return {
          success: false,
          error: `Search API Error: ${error.response.status} - ${error.message}`
        };
      }
      
      return {
        success: false,
        error: `Network Error: ${error.message}`
      };
    }
  }
} 