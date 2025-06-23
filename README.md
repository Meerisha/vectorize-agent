# TypeScript Agent with RAG and Web Search

A TypeScript-based AI agent with two powerful tools:
1. **RAG Document Retrieval** - Search and retrieve relevant documents from Vectorize
2. **Web Search** - Search the internet for current information

## Features

- 🤖 **OpenAI GPT-4 Integration** - Intelligent conversation and tool selection
- 📚 **RAG Document Retrieval** - Semantic search using Vectorize API
- 🌐 **Web Search** - Real-time web search using DuckDuckGo API
- 🔧 **Automatic Tool Selection** - LLM decides when to use each tool
- 💬 **Interactive CLI** - Chat interface for testing
- 🎯 **Direct Tool Access** - Programmatic access to individual tools

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# Vectorize API Configuration (required)
VECTORIZE_API_KEY=your_vectorize_api_key_here
VECTORIZE_ORG_ID=87ca0e06-b815-4e5d-9e1a-730d1e25fddf
VECTORIZE_PIPELINE_ID=aip30bf3-8601-4c1c-bc92-9d5436d70326
```

### 3. Build the Project

```bash
npm run build
```

## Usage

### Run Examples

```bash
npm run dev
```

### Interactive Mode

```bash
npm run dev -- --interactive
```

### Production Mode

```bash
npm start
```

## API Reference

### Agent Class

```typescript
import { Agent } from './src/agent';

const agent = new Agent({
  openaiApiKey: 'your-key',
  vectorizeApiKey: 'your-key',
  vectorizeOrgId: '87ca0e06-b815-4e5d-9e1a-730d1e25fddf',
  vectorizePipelineId: 'aip30bf3-8601-4c1c-bc92-9d5436d70326'
});
```

#### Methods

- `chat(message: string)` - Conversational interface with automatic tool selection
- `searchKnowledgeBase(query: string, topK?: number)` - Direct RAG search
- `searchWeb(query: string, maxResults?: number)` - Direct web search
- `getAvailableTools()` - List available tools

### Tool 1: RAG Document Retrieval

Searches your Vectorize knowledge base for relevant documents.

**Parameters:**
- `query` (string, required) - Search query
- `top_k` (number, optional) - Number of results (default: 5)

**Example:**
```typescript
const result = await agent.searchKnowledgeBase('machine learning algorithms', 3);
```

### Tool 2: Web Search

Searches the internet for current information using DuckDuckGo.

**Parameters:**
- `query` (string, required) - Search query
- `max_results` (number, optional) - Maximum results (default: 5)

**Example:**
```typescript
const result = await agent.searchWeb('latest AI news 2024', 5);
```

## Example Conversations

### Automatic Tool Selection

```typescript
// The agent will automatically decide which tools to use
const response = await agent.chat(
  "What is quantum computing and what are the latest developments?"
);
// May use RAG for foundational knowledge + web search for latest news
```

### Knowledge Base Focus

```typescript
const response = await agent.chat(
  "Tell me about machine learning from our documentation"
);
// Will primarily use RAG retrieval
```

### Current Events Focus

```typescript
const response = await agent.chat(
  "What's happening in AI today?"
);
// Will use web search for current information
```

## Architecture

```
src/
├── agent.ts              # Main agent orchestrator
├── types.ts              # TypeScript interfaces
├── tools/
│   ├── vectorize-retrieval.ts  # RAG tool implementation
│   └── web-search.ts           # Web search tool implementation
└── index.ts              # Entry point and examples
```

## Configuration

### Vectorize Integration

Your Vectorize configuration:
- **Organization ID**: `87ca0e06-b815-4e5d-9e1a-730d1e25fddf`
- **Pipeline ID**: `aip30bf3-8601-4c1c-bc92-9d5436d70326`
- **API Endpoint**: `https://api.vectorize.io/v1/org/{orgId}/pipelines/{pipelineId}/retrieval`

### OpenAI Models

Currently configured to use:
- `gpt-4-turbo-preview` for conversational responses
- Function calling for tool selection and execution

## Error Handling

- Network timeouts and API errors are handled gracefully
- Fallback responses when tools fail
- Detailed error logging for debugging

## Development

### Scripts

- `npm run build` - Compile TypeScript
- `npm run dev` - Run with ts-node
- `npm run watch` - Watch mode compilation
- `npm start` - Run compiled JavaScript

### Adding New Tools

1. Create a new tool class implementing the `Tool` interface
2. Add it to the agent's tool registry in `agent.ts`
3. Update the system prompt to describe the new tool

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all API keys are properly set in `.env`
2. **Network Timeouts**: Check internet connection and API endpoints
3. **TypeScript Errors**: Run `npm run build` to check for compilation issues

### Debug Mode

Set `NODE_ENV=development` for detailed logging:

```bash
NODE_ENV=development npm run dev
```

## License

MIT License - Feel free to modify and distribute as needed. 