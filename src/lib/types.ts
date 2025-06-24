// Agent configuration interface
export interface AgentConfig {
  openaiApiKey: string;
  vectorizeApiKey: string;
  vectorizeOrgId: string;
  vectorizePipelineId: string;
}

// Tool interfaces
export interface Tool {
  name: string;
  description: string;
  parameters: any;
  execute: (args: any) => Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Vectorize specific interfaces
export interface VectorizeDocument {
  id?: string;
  content?: string;
  metadata?: Record<string, any>;
  score?: number;
}

export interface RetrieveDocumentsRequest {
  question: string;
  numResults?: number;
}

export interface RetrieveDocumentsResponse {
  documents: VectorizeDocument[];
}

// Web search interfaces
export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
} 