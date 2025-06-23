import { VectorizeAgent } from './vectorize-agent';

async function main() {
  // Get configuration from environment variables
  const vectorizeApiKey = process.env.OPENAI_API_KEY || process.env.VECTORIZE_API_KEY;
  const orgId = process.env.VECTORIZE_ORG_ID || '87ca0e06-b815-4e5d-9e1a-730d1e25fddf';
  const pipelineId = process.env.VECTORIZE_PIPELINE_ID || 'aip30bf3-8601-4c1c-bc92-9d5436d70326';

  if (!vectorizeApiKey) {
    console.error('❌ Please set OPENAI_API_KEY or VECTORIZE_API_KEY environment variable');
    process.exit(1);
  }

  console.log('🤖 Initializing Vectorize Agent...');
  const agent = new VectorizeAgent(vectorizeApiKey, orgId, pipelineId);

  console.log('✅ Agent initialized successfully!');
  console.log('🔍 Testing RAG-enabled chat...\n');

  try {
    // Test the same query as in your Python example
    const response = await agent.chatWithRAG('How to call the API?');
    console.log('\n📝 Response received successfully!');
    
    // Test with a more complex query
    console.log('\n🧪 Testing with a more complex query...');
    const response2 = await agent.chatWithRAG('What are the best practices for API development?');
    
  } catch (error: any) {
    console.error('❌ Error during testing:', error.message);
  }
}

// Interactive mode
async function interactiveMode() {
  const vectorizeApiKey = process.env.OPENAI_API_KEY || process.env.VECTORIZE_API_KEY;
  const orgId = process.env.VECTORIZE_ORG_ID || '87ca0e06-b815-4e5d-9e1a-730d1e25fddf';
  const pipelineId = process.env.VECTORIZE_PIPELINE_ID || 'aip30bf3-8601-4c1c-bc92-9d5436d70326';

  if (!vectorizeApiKey) {
    console.error('❌ Please set OPENAI_API_KEY or VECTORIZE_API_KEY environment variable');
    process.exit(1);
  }

  const agent = new VectorizeAgent(vectorizeApiKey, orgId, pipelineId);
  console.log('🤖 RAG-enabled Agent Ready! Type your questions (or "quit" to exit)');
  console.log('=====================================');

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question('You: ', async (input: string) => {
      if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        await agent.chatWithRAG(input);
        console.log('');
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
  main();
} 