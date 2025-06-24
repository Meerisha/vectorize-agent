# Vectorize RAG Agent

A sophisticated AI agent system built with **Vectorize** for Retrieval-Augmented Generation (RAG) and web search capabilities. This project demonstrates multiple approaches to building AI agents with document retrieval and includes both command-line tools and a modern web interface.

## 🚀 Features

- 🤖 **Multiple Agent Implementations** - Complex function-calling agent, simple RAG agent, and direct API agent
- 📚 **Vectorize RAG Integration** - Semantic document search using Vectorize's knowledge base
- 🌐 **Web Search Tool** - Real-time internet search via DuckDuckGo API
- 💻 **Modern Web Interface** - Interactive Next.js chat interface with streaming responses
- 🔧 **Multi-step Tool Calling** - Advanced tool orchestration with AI SDK
- 📦 **Clean Architecture** - Organized library structure with examples
- 🎯 **TypeScript** - Full type safety and modern development experience

## 🏗️ Architecture

```
├── app/                           # Next.js App Router
│   ├── api/agent/route.ts         # Streaming API endpoint
│   ├── agent/page.tsx             # Interactive chat interface  
│   └── globals.css                # Tailwind CSS styles
├── src/
│   ├── lib/                       # Core library
│   │   ├── agents/                # Agent implementations
│   │   │   ├── complex-agent.ts   # Full OpenAI function calling
│   │   │   ├── simple-rag-agent.ts # Direct Vectorize integration
│   │   │   └── direct-api-agent.ts # HTTP API approach
│   │   ├── tools/                 # Reusable tools
│   │   │   ├── vectorize-retrieval.ts
│   │   │   └── web-search.ts
│   │   └── types.ts               # TypeScript interfaces
│   └── examples/                  # Usage examples
│       ├── basic-usage.ts
│       └── rag-only.ts
└── organize.md                    # Architecture documentation
```

## 🔧 Vectorize Configuration

This project is configured for **Vectorize** with the following setup:

- **Organization ID**: `87ca0e06-b815-4e5d-9e1a-730d1e25fddf`
- **Pipeline ID**: `aip30bf3-8601-4c1c-bc92-9d5436d70326`
- **API Endpoint**: `https://api.vectorize.io/v1/org/{orgId}/pipelines/{pipelineId}`

### Integration Approaches

1. **OpenAI-Compatible API** - Using Vectorize's OpenAI-compatible endpoint
2. **Direct HTTP API** - Raw HTTP calls to Vectorize retrieval endpoint
3. **Tool Integration** - Vectorize as a tool in multi-agent workflows

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Required: Your Vectorize API token
TOKEN=your_vectorize_jwt_token_here
VECTORIZE_API_KEY=your_vectorize_jwt_token_here

# Required: OpenAI API key for LLM capabilities
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Vectorize configuration (defaults provided)
VECTORIZE_ORG_ID=87ca0e06-b815-4e5d-9e1a-730d1e25fddf
VECTORIZE_PIPELINE_ID=aip30bf3-8601-4c1c-bc92-9d5436d70326
```

### 3. Run the Web Interface

```bash
npm run dev
```

Visit [http://localhost:3000/agent](http://localhost:3000/agent) for the interactive chat interface.

### 4. Try Command Line Examples

```bash
# Basic agent with both RAG and web search
npx tsx src/examples/basic-usage.ts

# RAG-only example
npx tsx src/examples/rag-only.ts
```

## 💻 Web Interface

The Next.js web interface provides:

- **Real-time streaming** responses using AI SDK
- **Multi-step tool calling** with visual feedback
- **Two powerful tools**:
  - 🔍 **Vectorize RAG** - Search your knowledge base
  - 🌐 **Web Search** - Get current information
- **Modern UI** with Tailwind CSS v4
- **Example questions** to get started

### Example Queries

Try these in the web interface:

- *"How to call the API?"* - Uses RAG to search documentation
- *"What are the latest AI developments?"* - Uses web search for current info
- *"Explain machine learning and recent breakthroughs"* - Uses both tools

## 🔨 Agent Implementations

### 1. Complex Agent (Function Calling)

Full-featured agent with OpenAI function calling:

```typescript
import { Agent, AgentConfig } from './src/lib/agents';

const config: AgentConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY!,
  vectorizeApiKey: process.env.TOKEN!,
  vectorizeOrgId: '87ca0e06-b815-4e5d-9e1a-730d1e25fddf',
  vectorizePipelineId: 'aip30bf3-8601-4c1c-bc92-9d5436d70326'
};

const agent = new Agent(config);
const response = await agent.chat('What is machine learning?');
```

### 2. Simple RAG Agent

Direct Vectorize integration using OpenAI-compatible API:

```typescript
import { VectorizeAgent } from './src/lib/agents';

const agent = new VectorizeAgent(
  process.env.TOKEN!,           // Vectorize API key
  '87ca0e06-b815-4e5d-9e1a-730d1e25fddf',  // Org ID
  'aip30bf3-8601-4c1c-bc92-9d5436d70326'   // Pipeline ID
);

const response = await agent.chatWithRAG('How to call the API?');
```

### 3. Direct API Agent

Raw HTTP calls to Vectorize:

```typescript
import { VectorizeDirectAgent } from './src/lib/agents';

const agent = new VectorizeDirectAgent(
  process.env.TOKEN!,
  '87ca0e06-b815-4e5d-9e1a-730d1e25fddf',
  'aip30bf3-8601-4c1c-bc92-9d5436d70326'
);

const documents = await agent.retrieveDocuments({
  question: 'How to call the API?',
  numResults: 5
});
```

## 🧪 Key Technologies

- **[Vectorize](https://vectorize.io)** - RAG and document retrieval
- **[OpenAI](https://openai.com)** - GPT-4 language model and function calling
- **[AI SDK](https://sdk.vercel.ai)** - Streaming AI responses and tool orchestration
- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[Tailwind CSS v4](https://tailwindcss.com)** - Modern utility-first CSS
- **[TypeScript](https://typescriptlang.org)** - Type-safe development

## 🔍 How It Works

1. **User Input** - Question submitted via web interface or CLI
2. **Agent Decision** - AI determines which tools to use
3. **Tool Execution**:
   - **RAG Search** - Queries Vectorize knowledge base for relevant documents
   - **Web Search** - Searches internet for current information
4. **Response Generation** - AI synthesizes information from tools into coherent answer
5. **Streaming Output** - Response streamed to user in real-time

## 📖 API Documentation

### Vectorize RAG Tool

```typescript
// Search knowledge base
const result = await agent.searchKnowledgeBase('machine learning', 3);

// Result format
{
  success: true,
  data: {
    query: 'machine learning',
    num_results: 3,
    documents: [
      {
        id: 'doc1',
        content: 'Document content...',
        score: 0.95,
        metadata: { ... }
      }
    ]
  }
}
```

### Web Search Tool

```typescript
// Search the web
const result = await agent.searchWeb('latest AI news', 5);

// Result format
{
  success: true,
  data: {
    query: 'latest AI news',
    num_results: 5,
    results: [
      {
        title: 'Article Title',
        url: 'https://example.com',
        snippet: 'Article summary...'
      }
    ]
  }
}
```

## 🛠️ Development

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Development Server

```bash
npm run dev
```

## 🔐 Authentication

This project uses **JWT tokens** for Vectorize authentication. The token should be set as:

- `TOKEN` environment variable (primary)
- `VECTORIZE_API_KEY` environment variable (fallback)

## 🎯 Use Cases

- **Documentation Q&A** - Answer questions from your knowledge base
- **Research Assistant** - Combine stored knowledge with current web information
- **Customer Support** - RAG-powered support with real-time information
- **Content Creation** - Research and fact-checking with multiple sources
- **Knowledge Management** - Intelligent search across document collections

## 🤝 Contributing

This is a demonstration project showcasing Vectorize integration patterns. Feel free to:

- Fork and extend for your use cases
- Add new agent implementations
- Integrate additional tools
- Improve the web interface

## 📄 License

MIT License - feel free to use this code for your projects!

---

**Built with ❤️ using Vectorize for intelligent document retrieval** 