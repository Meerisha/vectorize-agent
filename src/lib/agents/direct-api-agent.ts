import axios from 'axios';
import { VectorizeDocument, RetrieveDocumentsRequest, RetrieveDocumentsResponse } from '../types';

export class VectorizeDirectAgent {
  private accessToken: string;
  private basePath: string;
  private orgId: string;
  private pipelineId: string;

  constructor(
    accessToken: string,
    orgId: string,
    pipelineId: string,
    basePath: string = "https://api.vectorize.io/v1"
  ) {
    this.accessToken = accessToken;
    this.basePath = basePath;
    this.orgId = orgId;
    this.pipelineId = pipelineId;
  }

  async retrieveDocuments(request: RetrieveDocumentsRequest): Promise<VectorizeDocument[]> {
    try {
      console.log(`🔍 Searching for: "${request.question}"`);
      
      const url = `${this.basePath}/org/${this.orgId}/pipelines/${this.pipelineId}/retrieval`;
      
      console.log(`📡 Making request to: ${url}`);
      
      const response = await axios.post<RetrieveDocumentsResponse>(
        url,
        {
          question: request.question,
          numResults: request.numResults || 5,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );

      const documents = response.data.documents || [];
      console.log(`📚 Found ${documents.length} documents`);
      
      return documents;

    } catch (error: any) {
      console.error('❌ Vectorize retrieval error:', error?.response?.status);
      console.error('Error message:', error.message);
      
      if (error?.response?.data) {
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      throw error;
    }
  }

  getConfiguration(): { orgId: string, pipelineId: string, basePath: string } {
    return {
      orgId: this.orgId,
      pipelineId: this.pipelineId,
      basePath: this.basePath
    };
  }
} 