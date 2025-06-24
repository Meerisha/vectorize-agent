'use client';

import { useChat } from '@ai-sdk/react';

export default function AgentPage() {
  const { messages, input, setInput, append, isLoading } = useChat({
    api: '/api/agent',
    maxSteps: 5, // Allow for multiple tool calls in sequence
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🤖 AI Agent with RAG & Web Search
          </h1>
          <p className="text-gray-600 mt-1">
            Ask questions and I'll search both my knowledge base and the web to help you
          </p>
        </div>

        {/* Messages */}
        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">💭</div>
              <p>Start a conversation! I can help you with:</p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• Searching my knowledge base for specific information</li>
                <li>• Finding current news and web information</li>
                <li>• Combining both sources for comprehensive answers</li>
              </ul>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Show tool invocations if any */}
                {message.toolInvocations && message.toolInvocations.length > 0 && (
                  <div className="mt-2 text-xs opacity-75">
                    {message.toolInvocations.map((tool, toolIndex) => (
                      <div key={toolIndex} className="mt-1">
                        🔧 Using: {tool.toolName === 'vectorize_retrieval' ? '📚 Knowledge Base' : '🌐 Web Search'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex space-x-2">
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={async event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  if (input.trim()) {
                    append({ content: input, role: 'user' });
                    setInput('');
                  }
                }
              }}
              placeholder="Ask me anything... I'll search my knowledge base and the web!"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={() => {
                if (input.trim()) {
                  append({ content: input, role: 'user' });
                  setInput('');
                }
              }}
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Send
            </button>
          </div>
          
          {/* Example queries */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Try:</span>
            {[
              "How to call the API?",
              "What's the latest AI news?",
              "Explain machine learning concepts",
              "Current tech trends 2024"
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  append({ content: example, role: 'user' });
                }}
                disabled={isLoading}
                className="text-xs bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-2 py-1 rounded transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
