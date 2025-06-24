# TypeScript Files Organization

## Problem
The `src/` directory had many scattered TypeScript files created during development:
- Multiple agent implementations (agent.ts, vectorize-agent.ts, vectorize-direct.ts, etc.)
- Test files mixed with core functionality
- No clear structure for different approaches

## New Organization

### Core Library Structure
```
src/
  lib/
    types.ts                     # All type definitions
    agents/
      index.ts                   # Main exports
      complex-agent.ts           # Full agent with OpenAI function calling
      simple-rag-agent.ts        # Simple RAG-only agent
      direct-api-agent.ts        # Direct HTTP API calls
    tools/
      vectorize-retrieval.ts     # RAG search tool
      web-search.ts              # Web search tool
  
  examples/
    basic-usage.ts               # Complete agent example
    rag-only.ts                  # RAG-only example
```

### Next.js App (Active Implementation)
```
app/
  api/agent/route.ts             # Working API endpoint
  agent/page.tsx                 # Working frontend
```

## Files to Remove (Old/Duplicate)

### Test/Development Files
- `src/index.ts` - Old example runner
- `src/simple-test.ts` - Test file
- `src/vectorize-test.ts` - Test file
- `src/agent.ts` - Moved to lib/agents/complex-agent.ts
- `src/vectorize-agent.ts` - Moved to lib/agents/simple-rag-agent.ts
- `src/vectorize-direct.ts` - Moved to lib/agents/direct-api-agent.ts
- `src/vectorize-client-agent.ts` - Duplicate implementation
- `src/types.ts` - Moved to lib/types.ts
- `src/tools/` (old directory) - Moved to lib/tools/

### React/Next.js Development Files (Keep but not needed for core)
- `src/agent/page.tsx` - Duplicate of app/agent/page.tsx
- `src/api/agent/route.ts` - Duplicate of app/api/agent/route.ts

## Benefits of New Structure

1. **Clear separation**: Library code vs examples vs Next.js app
2. **Easy imports**: `import { Agent } from '../lib/agents'`
3. **Multiple approaches**: Different agent implementations available
4. **Clean examples**: Separate directory for usage examples
5. **Maintainable**: One place for each type of functionality

## Usage

### Use Complex Agent (with tools)
```typescript
import { Agent, AgentConfig } from './lib/agents';
```

### Use Simple RAG Agent
```typescript
import { VectorizeAgent } from './lib/agents';
```

### Use Direct API
```typescript
import { VectorizeDirectAgent } from './lib/agents';
``` 