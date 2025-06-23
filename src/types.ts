export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface Document {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  score?: number;
}

export interface VectorizeRetrievalRequest {
  query: string;
  top_k?: number;
  include_metadata?: boolean;
}

export interface VectorizeResponse {
  documents: Document[];
  query: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<ToolResult>;
}

export interface AgentConfig {
  openaiApiKey: string;
  vectorizeApiKey: string;
  vectorizeOrgId: string;
  vectorizePipelineId: string;
} 