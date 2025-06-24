import * as dotenv from 'dotenv';
import { Agent, AgentConfig } from '../lib/agents';

// Load environment variables
dotenv.config();

async function main() {
  // Configuration
  const config: AgentConfig = {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    vectorizeApiKey: process.env.VECTORIZE_API_KEY || process.env.TOKEN || '',
    vectorizeOrgId: process.env.VECTORIZE_ORG_ID || '87ca0e06-b815-4e5d-9e1a-730d1e25fddf',
    vectorizePipelineId: process.env.VECTORIZE_PIPELINE_ID || 'aip30bf3-8601-4c1c-bc92-9d5436d70326'
  };

  // Validate configuration
  if (!config.openaiApiKey) {
    console.error('❌ Please set OPENAI_API_KEY environment variable');
    process.exit(1);
  }

  if (!config.vectorizeApiKey) {
    console.error('❌ Please set VECTORIZE_API_KEY or TOKEN environment variable');
    process.exit(1);
  }

  // Initialize the agent
  console.log('🤖 Initializing Agent...');
  const agent = new Agent(config);

  console.log('✅ Agent initialized successfully!');
  console.log(`🛠️  Available tools: ${agent.getAvailableTools().join(', ')}`);
  console.log('');

  try {
    // Example: Ask a question that should use both tools
    const response = await agent.chat('What is machine learning and what are the latest developments in this field?');
    console.log('Agent Response:', response);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example
main().catch(console.error); 