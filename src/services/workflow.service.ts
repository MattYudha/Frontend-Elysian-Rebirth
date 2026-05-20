/**
 * src/services/workflow.service.ts
 * 
 * Pure HTTP Service Layer
 * Responsibilities:
 * - Direct API calls (REST)
 * - Type definitions for API responses
 * - Error throwing (no swallowing)
 * - No React hooks or state
 */

import { http } from '@/lib/http';

export interface Workflow {
    id: string;
    name: string;
    status: 'active' | 'draft' | 'archived' | 'processing' | 'completed' | 'queued' | 'failed';
    lastRun?: string;
    createdAt: string;
    progress?: number;
    eta?: string;
    lastUpdated?: string;
    nodes?: unknown[];
    edges?: unknown[];
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
    const res = await http.get<{ status: string; data: Workflow[] }>('/api/v1/workflows');
    return res.data || [];
}

/**
 * Fetch a single workflow by ID (with nodes & edges)
 * Endpoint: GET /api/v1/workflows/:id
 */
export async function fetchWorkflowById(id: string): Promise<Workflow> {
    const res = await http.get<{ status: string; data: Workflow }>(`/api/v1/workflows/${id}`);
    return res.data;
}

/**
 * Create a new workflow
 * Endpoint: POST /api/v1/workflows
 */
export async function createWorkflow(data: Partial<Workflow>): Promise<Workflow> {
    const res = await http.post<{ status: string; data: Workflow }>('/api/v1/workflows', data);
    return res.data;
}

/**
 * Save (update) a workflow graph
 * Endpoint: PUT /api/v1/workflows/:id/graph
 */
export async function saveWorkflow(data: {
    id: string;
    nodes: unknown[];
    edges: unknown[];
    expectedVersion?: string;
}): Promise<Workflow> {
    const res = await http.put<{ status: string; data: Workflow }>(`/api/v1/workflows/${data.id}/graph`, {
        nodes: data.nodes,
        edges: data.edges,
    });
    return res.data;
}

/**
 * Delete a workflow
 * Endpoint: DELETE /api/v1/workflows/:id
 */
export async function deleteWorkflow(id: string): Promise<void> {
    await http.delete(`/api/v1/workflows/${id}`);
}

/**
 * Trigger workflow execution
 * Endpoint: POST /api/v1/workflows/:id/execute
 */
export async function executeWorkflow(id: string): Promise<{ executionId: string }> {
    const res = await http.post<{ status: string; execution_id: string }>(`/api/v1/workflows/${id}/execute`);
    return { executionId: res.execution_id };
}

/**
 * Get execution details
 * Endpoint: GET /api/v1/executions/:id
 */
export async function getExecution(id: string): Promise<Execution> {
    const res = await http.get<{ status: string; data: Execution }>(`/api/v1/executions/${id}`);
    return res.data;
}
