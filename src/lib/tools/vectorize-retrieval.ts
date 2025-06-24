import axios from 'axios';
import { Tool, ToolResult, VectorizeDocument } from '../types';

export class VectorizeRetrievalTool implements Tool {
  name = 'vectorize_retrieval';
  description = 'Search and retrieve relevant documents from a knowledge base using semantic search. Use this when you need to find specific information from stored documents.';
  
  parameters = {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query to find relevant documents'
      },
      top_k: {
        type: 'number',
        description: 'Number of top relevant documents to retrieve (default: 5)',
        default: 5
      }
    },
    required: ['query']
  };

  private accessToken: string;
  private orgId: string;
  private pipelineId: string;
  private basePath: string;

  constructor(accessToken: string, orgId: string, pipelineId: string, basePath: string = 'https://api.vectorize.io/v1') {
    this.accessToken = accessToken;
    this.orgId = orgId;
    this.pipelineId = pipelineId;
    this.basePath = basePath;
  }

  async execute(args: { query: string; top_k?: number }): Promise<ToolResult> {
    try {
      const { query, top_k = 5 } = args;
      
      console.log(`🔍 Searching knowledge base for: "${query}"`);
      
      const url = `${this.basePath}/org/${this.orgId}/pipelines/${this.pipelineId}/retrieval`;
      
      const response = await axios.post(
        url,
        {
          question: query,
          numResults: top_k,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );

      const documents: VectorizeDocument[] = response.data.documents || [];
      
      console.log(`📚 Found ${documents.length} relevant documents`);
      
      return {
        success: true,
        data: {
          query,
          num_results: documents.length,
          documents: documents.map(doc => ({
            id: doc.id,
            content: doc.content,
            score: doc.score,
            metadata: doc.metadata
          }))
        }
      };

    } catch (error: any) {
      console.error('❌ Vectorize retrieval error:', error.message);
      
      return {
        success: false,
        error: `Failed to retrieve documents: ${error.message}`
      };
    }
  }
} 