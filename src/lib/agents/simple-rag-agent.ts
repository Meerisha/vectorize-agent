import OpenAI from 'openai';

export class VectorizeAgent {
  private ragClient: OpenAI;
  private openaiClient?: OpenAI;

  constructor(
    vectorizeApiKey: string,
    orgId: string,
    pipelineId: string,
    openaiApiKey?: string
  ) {
    // RAG-enabled client using Vectorize's OpenAI-compatible API
    this.ragClient = new OpenAI({
      apiKey: vectorizeApiKey,
      baseURL: `https://api.vectorize.io/v1/org/${orgId}/pipelines/${pipelineId}`
    });

    // Optional: Regular OpenAI client for non-RAG queries
    if (openaiApiKey) {
      this.openaiClient = new OpenAI({
        apiKey: openaiApiKey
      });
    }
  }

  async chatWithRAG(message: string, model: string = 'gpt-4o'): Promise<string> {
    try {
      console.log(`💬 User: ${message}`);
      console.log(`🔍 Using RAG-enabled model: ${model}`);

      const response = await this.ragClient.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const answer = response.choices[0].message.content || 'No response generated.';
      console.log(`🤖 Assistant (with RAG): ${answer}`);
      return answer;

    } catch (error: any) {
      console.error('❌ RAG Chat error:', error.message);
      return `I encountered an error: ${error.message}. Please try again.`;
    }
  }

  async chatWithoutRAG(message: string, model: string = 'gpt-4'): Promise<string> {
    if (!this.openaiClient) {
      return 'OpenAI client not configured. Please provide an OpenAI API key.';
    }

    try {
      console.log(`💬 User: ${message}`);
      console.log(`🧠 Using standard OpenAI model: ${model}`);

      const response = await this.openaiClient.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const answer = response.choices[0].message.content || 'No response generated.';
      console.log(`🤖 Assistant (without RAG): ${answer}`);
      return answer;

    } catch (error: any) {
      console.error('❌ Standard Chat error:', error.message);
      return `I encountered an error: ${error.message}. Please try again.`;
    }
  }

  async compareResponses(message: string): Promise<{ragResponse: string, standardResponse: string}> {
    console.log('🔄 Comparing RAG vs Standard responses...\n');
    
    const [ragResponse, standardResponse] = await Promise.all([
      this.chatWithRAG(message),
      this.chatWithoutRAG(message)
    ]);

    return { ragResponse, standardResponse };
  }
} 