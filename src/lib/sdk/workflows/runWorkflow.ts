
/**
 * Workflow execution options
 */
export interface RunWorkflowOptions {
    workflowId: string;
    inputs: Record<string, unknown>;
    onNodeStart?: (nodeId: string) => void;
    onNodeComplete?: (nodeId: string, output: unknown) => void;
    onNodeError?: (nodeId: string, error: Error) => void;
    onComplete?: (outputs: Record<string, unknown>) => void;
    onError?: (error: Error) => void;
}

/**
 * Workflow execution result
 */
export interface WorkflowResult {
    workflowId: string;
    status: 'success' | 'failed' | 'partial';
    outputs: Record<string, unknown>;
    executionTime: number;
    nodesExecuted: string[];
    errors?: Array<{ nodeId: string; error: string }>;
}

/**
 * Run a workflow with the given configuration (mock implementation)
 * 
 * @param options - Workflow execution options
 * @returns Workflow execution result
 */
export async function runWorkflow(options: RunWorkflowOptions): Promise<WorkflowResult> {
    const { workflowId, onNodeStart, onNodeComplete, onComplete, onError } = options;

    const startTime = Date.now();
    const nodesExecuted: string[] = [];

    try {
        // Mock workflow execution with simulated nodes
        const mockNodes = ['input_1', 'knowledge_1', 'llm_1', 'export_1'];

        for (const nodeId of mockNodes) {
            onNodeStart?.(nodeId);

            // Simulate node processing
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockOutput = { [nodeId]: `Output from ${nodeId}` };
            nodesExecuted.push(nodeId);
            onNodeComplete?.(nodeId, mockOutput);
        }

        const result: WorkflowResult = {
            workflowId,
            status: 'success',
            outputs: { final: 'Workflow completed successfully' },
            executionTime: Date.now() - startTime,
            nodesExecuted,
        };

        onComplete?.(result.outputs);
        return result;
    } catch (error) {
        onError?.(error as Error);
        return {
            workflowId,
            status: 'failed',
            outputs: {},
            executionTime: Date.now() - startTime,
            nodesExecuted,
            errors: [{ nodeId: 'unknown', error: (error as Error).message }],
        };
    }
}
