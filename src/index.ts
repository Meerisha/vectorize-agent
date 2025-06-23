import * as dotenv from 'dotenv';
import { Agent } from './agent';
import { AgentConfig } from './types';

// Load environment variables
dotenv.config();

async function main() {
  // Configuration - in production, these should come from environment variables
  const config: AgentConfig = {
    openaiApiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
    vectorizeApiKey: process.env.VECTORIZE_API_KEY || 'your-vectorize-api-key',
    vectorizeOrgId: process.env.VECTORIZE_ORG_ID || '87ca0e06-b815-4e5d-9e1a-730d1e25fddf',
    vectorizePipelineId: process.env.VECTORIZE_PIPELINE_ID || 'aip30bf3-8601-4c1c-bc92-9d5436d70326'
  };

  // Validate configuration
  if (config.openaiApiKey === 'your-openai-api-key') {
    console.error('❌ Please set your OPENAI_API_KEY in the .env file');
    process.exit(1);
  }

  if (config.vectorizeApiKey === 'your-vectorize-api-key') {
    console.error('❌ Please set your VECTORIZE_API_KEY in the .env file');
    process.exit(1);
  }

  // Initialize the agent
  console.log('🤖 Initializing TypeScript Agent...');
  const agent = new Agent(config);

  console.log('✅ Agent initialized successfully!');
  console.log(`🛠️  Available tools: ${agent.getAvailableTools().join(', ')}`);
  console.log('');

  // Example usage
  console.log('📝 Example Usage:');
  console.log('================');

  try {
    // Example 1: Direct tool usage - RAG search
    console.log('1️⃣ Testing RAG Document Retrieval...');
    const ragResult = await agent.searchKnowledgeBase('artificial intelligence', 3);
    console.log('RAG Search Result:', JSON.stringify(ragResult, null, 2));
    console.log('');

    // Example 2: Direct tool usage - Web search
    console.log('2️⃣ Testing Web Search...');
    const webResult = await agent.searchWeb('latest AI news 2024', 3);
    console.log('Web Search Result:', JSON.stringify(webResult, null, 2));
    console.log('');

    // Example 3: Conversational interface with automatic tool selection
    console.log('3️⃣ Testing Conversational Interface...');
    const response = await agent.chat('What is machine learning and what are the latest developments in this field?');
    console.log('Agent Response:', response);

  } catch (error: any) {
    console.error('❌ Error during example execution:', error.message);
  }
}

// Interactive CLI mode
async function interactiveMode() {
  const config: AgentConfig = {
    openaiApiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key',
    vectorizeApiKey: process.env.VECTORIZE_API_KEY || 'your-vectorize-api-key',
    vectorizeOrgId: process.env.VECTORIZE_ORG_ID || '87ca0e06-b815-4e5d-9e1a-730d1e25fddf',
    vectorizePipelineId: process.env.VECTORIZE_PIPELINE_ID || 'aip30bf3-8601-4c1c-bc92-9d5436d70326'
  };

  const agent = new Agent(config);
  console.log('🤖 Agent Ready! Type your questions (or "quit" to exit)');
  console.log('Available tools: vectorize_retrieval, web_search');
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
        const response = await agent.chat(input);
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