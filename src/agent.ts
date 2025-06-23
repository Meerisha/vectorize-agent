import OpenAI from 'openai';
import { Tool, ToolResult, AgentConfig } from './types';
import { VectorizeRetrievalTool } from './tools/vectorize-retrieval';
import { WebSearchTool } from './tools/web-search';

export class Agent {
  private openai: OpenAI;
  private tools: Map<string, Tool>;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });

    // Initialize tools
    this.tools = new Map();
    
    // Add RAG retrieval tool
    const ragTool = new VectorizeRetrievalTool(
      config.vectorizeApiKey,
      config.vectorizeOrgId,
      config.vectorizePipelineId
    );
    this.tools.set(ragTool.name, ragTool);

    // Add web search tool
    const webSearchTool = new WebSearchTool();
    this.tools.set(webSearchTool.name, webSearchTool);
  }

  private getToolDefinitions() {
    return Array.from(this.tools.values()).map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    }));
  }

  async chat(message: string): Promise<string> {
    try {
      console.log(`💬 User: ${message}`);

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: `You are a helpful AI assistant with access to two powerful tools:
          
1. vectorize_retrieval: Search and retrieve relevant documents from a knowledge base using semantic search
2. web_search: Search the internet for current information and news

Use these tools when appropriate to provide accurate, up-to-date, and comprehensive answers. Always explain your reasoning and cite your sources when using information from these tools.

When using the vectorize_retrieval tool, focus on finding relevant documents from the knowledge base.
When using the web_search tool, look for current information that might not be in the knowledge base.

Be conversational, helpful, and thorough in your responses.`
        },
        {
          role: 'user',
          content: message
        }
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        tools: this.getToolDefinitions(),
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 2000
      });

      const assistantMessage = response.choices[0].message;

      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        // Handle tool calls
        const toolResults: string[] = [];
        
        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);
          
          console.log(`🔧 Using tool: ${toolName}`);
          console.log(`📋 Args: ${JSON.stringify(toolArgs, null, 2)}`);
          
          const tool = this.tools.get(toolName);
          if (tool) {
            const result = await tool.execute(toolArgs);
            if (result.success) {
              toolResults.push(`Tool ${toolName} results: ${JSON.stringify(result.data, null, 2)}`);
            } else {
              toolResults.push(`Tool ${toolName} error: ${result.error}`);
            }
          } else {
            toolResults.push(`Unknown tool: ${toolName}`);
          }
        }

        // Generate final response with tool results
        const finalMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          ...messages,
          {
            role: 'assistant',
            content: assistantMessage.content,
            tool_calls: assistantMessage.tool_calls
          },
          ...assistantMessage.tool_calls.map((toolCall, index) => ({
            role: 'tool' as const,
            content: toolResults[index],
            tool_call_id: toolCall.id
          }))
        ];

        const finalResponse = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: finalMessages,
          temperature: 0.7,
          max_tokens: 2000
        });

        const finalAnswer = finalResponse.choices[0].message.content || 'I apologize, but I couldn\'t generate a response.';
        console.log(`🤖 Assistant: ${finalAnswer}`);
        return finalAnswer;
      } else {
        // Direct response without tools
        const directAnswer = assistantMessage.content || 'I apologize, but I couldn\'t generate a response.';
        console.log(`🤖 Assistant: ${directAnswer}`);
        return directAnswer;
      }

    } catch (error: any) {
      console.error('❌ Agent error:', error.message);
      return `I encountered an error: ${error.message}. Please try again.`;
    }
  }

  async searchKnowledgeBase(query: string, topK: number = 5): Promise<any> {
    const ragTool = this.tools.get('vectorize_retrieval');
    if (ragTool) {
      return await ragTool.execute({ query, top_k: topK });
    }
    throw new Error('RAG tool not available');
  }

  async searchWeb(query: string, maxResults: number = 5): Promise<any> {
    const webTool = this.tools.get('web_search');
    if (webTool) {
      return await webTool.execute({ query, max_results: maxResults });
    }
    throw new Error('Web search tool not available');
  }

  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }
} 