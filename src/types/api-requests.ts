// API Request Types

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ChatMessageRequest {
    message: string;
    conversationId?: string;
    context?: Record<string, unknown>;
}

export interface RagQueryRequest {
    query: string;
    topK?: number;
    filters?: Record<string, unknown>;
}

export interface DocumentSaveRequest {
    id: string;
    content: string;
    version?: number;
}

export interface WorkflowExecuteRequest {
    workflowId: string;
    inputs: Record<string, unknown>;
}
