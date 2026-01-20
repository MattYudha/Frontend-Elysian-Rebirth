import { Node, Edge, Viewport } from 'reactflow';

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
    [key: string]: any;
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
    nodeStatus: Record<string, NodeStatus>;
    errors: Record<string, string>; // nodeId -> error message
    results: Record<string, any>;   // nodeId -> output data
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
    onNodesChange: (changes: any) => void; // Using any to avoid circular deps with reacttype
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: any) => void;
    addNode: (node: Node<WorkflowNodeData>) => void;

    // UI Actions
    setSelectedNode: (id: string | null) => void;

    // Logic Actions
    isValidConnection: (connection: any) => boolean;
    updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;

    // Execution Actions
    startExecution: () => void;
    stopExecution: () => void;
    setNodeStatus: (nodeId: string, status: NodeStatus) => void;

    // Persistence Actions
    publishVersion: () => void;
}
