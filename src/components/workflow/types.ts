import { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';

// --- Domain Types ---
export type PortType = 'text' | 'json' | 'image' | 'embedding' | 'trigger' | 'document' | 'any';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export type WorkflowStatus = 'draft' | 'published' | 'archived';

// --- Connector Logic ---
// Defines what input properties a specific node type expects
export interface NodePortDefinition {
    id: string; // e.g., 'prompt', 'input_text'
    label: string;
    type: PortType;
}

export interface NodeTypeDefinition {
    type: string;
    label: string;
    description?: string;
    inputs: NodePortDefinition[];
    outputs: NodePortDefinition[];
}

// --- Data Structures ---
export interface WorkflowNodeData {
    label: string;
    [key: string]: unknown;
}

// Agent Node data
export interface AgentNodeData extends WorkflowNodeData {
    role?: 'analyst' | 'writer' | 'researcher' | 'support';
    objective?: string;
    tools?: string[]; // e.g. ['web_search', 'calculator', 'code_executor']
}

// Data Ingestion Node data
export interface DataIngestionNodeData extends WorkflowNodeData {
    ingestionType?: 'rag' | 'sql' | 'web_scraper';
    sourceName?: string;
    sourceUrl?: string;
    status?: 'ready' | 'indexing' | 'error';
}

export interface WorkflowMeta {
    workflowId: string;
    name: string;
    version: string;
    status: WorkflowStatus;
    lastRunAt?: string;
    description?: string;
}

export interface ExecutionState {
    runId: string | null;
    status: 'idle' | 'running' | 'completed' | 'failed';
    activeNodeId: string | null;
    // Per-node execution details
    // Per-node execution details
    nodeStatus: Record<string, NodeStatus>;
    errors: Record<string, string>; // nodeId -> error message
    results: Record<string, unknown>;   // nodeId -> output data
    logs: Array<{
        timestamp?: string;
        level: string;
        message: string;
    }>;
}

export interface UIState {
    selectedNodeId: string | null;
    zoomLevel: number; // For future usage or to sync with ReactFlow viewport
}

// --- Store Interface ---
export interface WorkflowState {
    // Layer 0: Metadata
    meta: WorkflowMeta;

    // Layer 1: The Graph (Business Logic)
    // We use the flatten structure for React Flow, but concept-wise it's the 'Graph Layer'
    nodes: Node<WorkflowNodeData>[];
    edges: Edge[];

    // Layer 2: UI State (Ephemeral)
    ui: UIState;

    // Layer 3: Execution State (Runtime)
    execution: ExecutionState;

    // --- Actions ---
    // Graph Actions
    setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
    setEdges: (edges: Edge[]) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    addNode: (node: Node<WorkflowNodeData>) => void;

    // UI Actions
    setSelectedNode: (id: string | null) => void;

    // Logic Actions
    isValidConnection: (connection: Connection | Edge) => boolean;
    updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;

    // Execution Actions
    startExecution: () => void;
    stopExecution: () => void;
    setNodeStatus: (nodeId: string, status: NodeStatus) => void;

    // Async Execution
    executeWorkflow: () => Promise<void>;
    pollExecution: () => Promise<void>;

    // Persistence Actions
    publishVersion: () => void;

    // Computed Properties
    selectedNode: Node<WorkflowNodeData> | null;
}
