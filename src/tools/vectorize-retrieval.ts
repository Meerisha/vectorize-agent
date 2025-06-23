import axios from 'axios';
import { Tool, ToolResult, VectorizeRetrievalRequest, VectorizeResponse } from '../types';

export class VectorizeRetrievalTool implements Tool {
  name = 'vectorize_retrieval';
  description = 'Retrieve relevant documents from the RAG knowledge base using semantic search';
  parameters = {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query to find relevant documents'
      },
      top_k: {
        type: 'number',
        description: 'Number of top results to return (default: 5)',
        default: 5
      }
    },
    required: ['query']
  };

  private apiKey: string;
  private orgId: string;
  private pipelineId: string;
  private baseUrl: string;

  constructor(apiKey: string, orgId: string, pipelineId: string) {
    this.apiKey = apiKey;
    this.orgId = orgId;
    this.pipelineId = pipelineId;
    this.baseUrl = `https://api.vectorize.io/v1/org/${orgId}/pipelines/${pipelineId}/retrieval`;
  }

  async execute(params: VectorizeRetrievalRequest): Promise<ToolResult> {
    try {
      const { query, top_k = 5 } = params;

      if (!query || query.trim() === '') {
        return {
          success: false,
          error: 'Query parameter is required and cannot be empty'
        };
      }

      console.log(`🔍 Searching for: "${query}"`);

      const response = await axios.post(
        this.baseUrl,
        {
          question: query.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      const documents = response.data.documents || response.data.results || [];
      
      console.log(`📚 Found ${documents.length} relevant documents`);

      return {
        success: true,
        data: {
          query,
          documents: documents.map((doc: any, index: number) => ({
            id: doc.id || `doc_${index}`,
            content: doc.content || doc.text || doc.document,
            metadata: doc.metadata || {},
            score: doc.score || doc.similarity || 0
          })),
          count: documents.length
        }
      };

    } catch (error: any) {
      console.error('❌ Vectorize retrieval error:', error.message);
      
      if (error.response) {
        return {
          success: false,
          error: `API Error: ${error.response.status} - ${error.response.data?.message || error.message}`
        };
      }
      
      return {
        success: false,
        error: `Network Error: ${error.message}`
      };
    }
  }
} 