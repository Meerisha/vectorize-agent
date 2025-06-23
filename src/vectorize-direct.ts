import axios from 'axios';

export interface VectorizeDocument {
  id?: string;
  content?: string;
  metadata?: Record<string, any>;
  score?: number;
}

export interface RetrieveDocumentsRequest {
  question: string;
  numResults?: number;
}

export interface RetrieveDocumentsResponse {
  documents: VectorizeDocument[];
}

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

// Main function that matches your JavaScript example
async function main() {
  try {
    const token = process.env.VECTORIZE_API_KEY || process.env.OPENAI_API_KEY;
    const orgId = "87ca0e06-b815-4e5d-9e1a-730d1e25fddf";
    const pipelineId = "aip30bf3-8601-4c1c-bc92-9d5436d70326";

    if (!token) {
      console.error('❌ Please set VECTORIZE_API_KEY or OPENAI_API_KEY environment variable');
      process.exit(1);
    }

    console.log('🤖 Initializing Vectorize Direct Agent...');
    console.log(`📋 Organization: ${orgId}`);
    console.log(`🔧 Pipeline: ${pipelineId}`);
    console.log('');

    const agent = new VectorizeDirectAgent(token, orgId, pipelineId);

    console.log('✅ Agent initialized successfully!');
    console.log('🔍 Testing document retrieval...\n');

    // Test the same query as in your JavaScript example
    const documents = await agent.retrieveDocuments({
      question: "How to call the API?",
      numResults: 5
    });
    
    console.log('📄 Retrieved Documents:');
    console.log('======================');
    
    if (documents && documents.length > 0) {
      documents.forEach((doc, index) => {
        console.log(`\n📄 Document ${index + 1}:`);
        console.log(`ID: ${doc.id || 'N/A'}`);
        console.log(`Score: ${doc.score || 'N/A'}`);
        console.log(`Content: ${doc.content?.substring(0, 200)}${doc.content && doc.content.length > 200 ? '...' : ''}`);
        if (doc.metadata && Object.keys(doc.metadata).length > 0) {
          console.log(`Metadata: ${JSON.stringify(doc.metadata, null, 2)}`);
        }
      });
    } else {
      console.log('No documents found.');
    }

    console.log('\n🎯 Test completed successfully!');

  } catch (error: any) {
    console.error('❌ Error during main execution:');
    console.error('Status:', error?.response?.status);
    console.error('Message:', error.message);
    
    if (error?.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Export for use in other files
export { main };

// Run main if this file is executed directly
if (require.main === module) {
  main();
} 