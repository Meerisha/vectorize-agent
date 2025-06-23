import { VectorizeClientAgent } from './vectorize-client-agent';

async function testVectorizeClient() {
  try {
    // Use the environment variable you set earlier
    const token = process.env.VECTORIZE_API_KEY || process.env.OPENAI_API_KEY;
    const orgId = process.env.VECTORIZE_ORG_ID || "87ca0e06-b815-4e5d-9e1a-730d1e25fddf";
    const pipelineId = process.env.VECTORIZE_PIPELINE_ID || "aip30bf3-8601-4c1c-bc92-9d5436d70326";

    if (!token) {
      console.error('❌ Please set TOKEN, VECTORIZE_API_KEY, or OPENAI_API_KEY environment variable');
      process.exit(1);
    }

    console.log('🤖 Initializing Vectorize Client Agent...');
    console.log(`📋 Organization: ${orgId}`);
    console.log(`🔧 Pipeline: ${pipelineId}`);
    console.log('');

    const agent = new VectorizeClientAgent(token, orgId, pipelineId);

    console.log('✅ Agent initialized successfully!');
    console.log('🔍 Testing document retrieval...\n');

    // Test the same query as in your JavaScript example
    const documents = await agent.retrieveDocuments("How to call the API?", 5);
    
    console.log('📄 Retrieved Documents:');
    console.log('======================');
    
    documents.forEach((doc, index) => {
      console.log(`\n📄 Document ${index + 1}:`);
      console.log(`ID: ${doc.id}`);
      console.log(`Score: ${doc.score}`);
      console.log(`Content: ${doc.content?.substring(0, 200)}${doc.content && doc.content.length > 200 ? '...' : ''}`);
      if (doc.metadata && Object.keys(doc.metadata).length > 0) {
        console.log(`Metadata: ${JSON.stringify(doc.metadata, null, 2)}`);
      }
    });

    console.log('\n🎯 Test completed successfully!');
    
    // Additional test with different query
    console.log('\n🧪 Testing with another query...');
    const docs2 = await agent.retrieveDocuments("What are the best practices?", 3);
    console.log(`📚 Found ${docs2.length} documents for second query`);

  } catch (error: any) {
    console.error('❌ Error during testing:');
    console.error('Status:', error?.response?.status);
    console.error('Message:', error.message);
    
    if (error?.response?.text) {
      try {
        const errorText = await error.response.text();
        console.error('Response:', errorText);
      } catch (e) {
        console.error('Could not read error response text');
      }
    }
  }
}

// Interactive mode for testing
async function interactiveMode() {
  const token = process.env.VECTORIZE_API_KEY || process.env.OPENAI_API_KEY;
  const orgId = process.env.VECTORIZE_ORG_ID || "87ca0e06-b815-4e5d-9e1a-730d1e25fddf";
  const pipelineId = process.env.VECTORIZE_PIPELINE_ID || "aip30bf3-8601-4c1c-bc92-9d5436d70326";

  if (!token) {
    console.error('❌ Please set TOKEN, VECTORIZE_API_KEY, or OPENAI_API_KEY environment variable');
    process.exit(1);
  }

  const agent = new VectorizeClientAgent(token, orgId, pipelineId);
  console.log('🤖 Vectorize Agent Ready! Type your questions (or "quit" to exit)');
  console.log('This will search your knowledge base and return relevant documents.');
  console.log('=====================================');

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('Question: ', async (input: string) => {
      if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        const documents = await agent.retrieveDocuments(input, 3);
        console.log(`\n📚 Found ${documents.length} relevant documents:\n`);
        
        documents.forEach((doc, index) => {
          console.log(`${index + 1}. ${doc.content?.substring(0, 150)}...`);
          console.log(`   Score: ${doc.score}\n`);
        });
        
        askQuestion();
      } catch (error: any) {
        console.error('❌ Error:', error.message);
        askQuestion();
      }
    });
  };

  askQuestion();
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--interactive') || args.includes('-i')) {
  interactiveMode();
} else {
  testVectorizeClient();
} 