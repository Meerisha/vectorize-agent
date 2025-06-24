import * as dotenv from 'dotenv';
import { VectorizeAgent } from '../lib/agents';

// Load environment variables
dotenv.config();

async function main() {
  const vectorizeApiKey = process.env.TOKEN || process.env.VECTORIZE_API_KEY || '';
  const orgId = '87ca0e06-b815-4e5d-9e1a-730d1e25fddf';
  const pipelineId = 'aip30bf3-8601-4c1c-bc92-9d5436d70326';

  if (!vectorizeApiKey) {
    console.error('❌ Please set TOKEN or VECTORIZE_API_KEY environment variable');
    process.exit(1);
  }

  console.log('🤖 Initializing RAG-only Agent...');
  const agent = new VectorizeAgent(vectorizeApiKey, orgId, pipelineId);

  console.log('✅ Agent initialized successfully!');
  console.log('🔍 Testing RAG-enabled chat...\n');

  try {
    // Test the RAG functionality
    const response = await agent.chatWithRAG('How to call the API?');
    console.log('\n📝 Response received successfully!');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example
main().catch(console.error); 