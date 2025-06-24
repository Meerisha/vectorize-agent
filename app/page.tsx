import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🤖 AI Agent Platform
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Powered by Vectorize RAG and Web Search
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/agent"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
          >
            Launch AI Agent 🚀
          </Link>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>Features:</p>
            <ul className="mt-2 space-y-1">
              <li>📚 RAG Document Retrieval from Vectorize</li>
              <li>🌐 Real-time Web Search</li>
              <li>🔧 Multi-step Tool Calling</li>
              <li>💬 Interactive Chat Interface</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 