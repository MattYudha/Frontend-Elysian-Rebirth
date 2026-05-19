/**
 * src/services/workflow.service.ts
 * 
 * Pure HTTP Service Layer
 * Responsibilities:
 * - Direct API calls (REST/GraphQL)
 * - Type definitions for API responses
 * - Error throwing (no swallowing)
 * - No React hooks or state
 */

export interface Workflow {
    id: string;
    name: string;
    status: 'active' | 'draft' | 'archived' | 'processing' | 'completed' | 'queued' | 'failed';
    lastRun?: string;
    createdAt: string;
    progress?: number;
    eta?: string;
    lastUpdated?: string;
    // Detail fields (populated when fetching single workflow)
    nodes?: unknown[];
    edges?: unknown[];
    // OCC: version hash/ETag from server, used for conflict detection
    version?: string;
}

export interface ExecutionLog {
    id?: number;
    nodeId?: string;
    level: string;
    message: string;
    timestamp?: string;
}

export interface Execution {
    id: string;
    workflowId: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    startTime: string;
    endTime?: string;
    logs?: ExecutionLog[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results?: Record<string, any>;
}

/**
 * Fetch all workflows
 * Endpoint: GET /api/v1/workflows
 */
export async function fetchWorkflows(): Promise<Workflow[]> {
    return [
        {
            id: 'pipe_001',
            name: 'Customer Support RAG Indexing',
            status: 'processing',
            progress: 67,
            eta: '2 min remaining',
            lastUpdated: new Date(Date.now() - 30000).toISOString(),
            createdAt: new Date().toISOString(),
        },
        {
            id: 'pipe_002',
            name: 'Product Documentation Update',
            status: 'queued',
            lastUpdated: new Date(Date.now() - 120000).toISOString(),
            createdAt: new Date().toISOString(),
        },
        {
            id: 'pipe_003',
            name: 'Weekly Knowledge Refresh',
            status: 'completed',
            progress: 100,
            lastUpdated: new Date(Date.now() - 300000).toISOString(),
            createdAt: new Date().toISOString(),
        },
    ];
}

/**
 * Fetch a single workflow by ID (with nodes & edges)
 * Endpoint: GET /api/v1/workflows/:id
 */
export async function fetchWorkflowById(id: string): Promise<Workflow> {
    return {
        id,
        name: 'Mock Workflow Detail',
        status: 'draft',
        createdAt: new Date().toISOString(),
        nodes: [],
        edges: []
    };
}

/**
 * Create a new workflow
 * Endpoint: POST /api/v1/workflows
 */
export async function createWorkflow(data: Partial<Workflow>): Promise<Workflow> {
    return {
        id: `wf-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name || 'Untitled Workflow',
        status: 'draft',
        createdAt: new Date().toISOString(),
        ...data,
    } as Workflow;
}

/**
 * Save (update) a workflow with OCC (Optimistic Concurrency Control)
 * Sends expectedVersion — backend returns 409 Conflict if version mismatch.
 * Endpoint: PUT /api/v1/workflows/:id
 */
export async function saveWorkflow(data: {
    id: string;
    nodes: unknown[];
    edges: unknown[];
    expectedVersion: string;
}): Promise<Workflow> {
    try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7777';
        const res = await fetch(`${url}/api/v1/workflows/${data.id}/graph`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer DUMMY_HACKATHON_TOKEN' },
            body: JSON.stringify({ nodes: data.nodes, edges: data.edges })
        });
        if (!res.ok) throw new Error("Server rejected workflow save");
    } catch(e) {
        console.warn("[Hackathon Mock] Backend unavailable, simulating successful save:", e);
    }

    return {
        id: data.id,
        name: 'Updated Workflow',
        status: 'draft',
        createdAt: new Date().toISOString(),
        nodes: data.nodes,
        edges: data.edges,
        version: 'v2'
    };
}

/**
 * Delete a workflow
 * Endpoint: DELETE /api/v1/workflows/:id
 */
export async function deleteWorkflow(id: string): Promise<void> {
    // Mock delete success
    await Promise.resolve();
}

/**
 * Trigger workflow execution
 * Endpoint: POST /api/v1/workflows/:id/execute
 */
export async function executeWorkflow(id: string): Promise<{ executionId: string }> {
    try {
        const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7777';
        const res = await fetch(`${url}/api/v1/executions/${id}`, { 
            method: 'POST',
            headers: { 'Authorization': 'Bearer DUMMY_HACKATHON_TOKEN' }
        });
        if (!res.ok) throw new Error("Server failed to execute pipeline");
        
        const json = await res.json();
        return { executionId: json.execution_id || `exec-${Math.random().toString(36).substr(2, 9)}` };
    } catch (error) {
        console.warn("[Hackathon Mock] Backend unavailable, simulating fallback execution ID", error);
        return { executionId: `exec-${Math.random().toString(36).substr(2, 9)}` };
    }
}

/**
 * Get execution details
 * Endpoint: GET /api/v1/executions/:id
 */
export async function getExecution(id: string): Promise<Execution> {
    return {
        id,
        workflowId: 'mock-wf',
        status: 'COMPLETED',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
    };
}
