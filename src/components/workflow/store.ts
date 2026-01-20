import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import { WorkflowState, WorkflowMeta, ExecutionState, UIState, WorkflowNodeData, NodeStatus } from './types';

// Initial State
const initialMeta: WorkflowMeta = {
    workflowId: 'wf_' + Date.now(),
    name: 'Untitled Workflow',
    version: '1.0.0',
    status: 'draft',
};

const initialExecution: ExecutionState = {
    runId: null,
    status: 'idle',
    activeNodeId: null,
    nodeStatus: {},
    errors: {},
    results: {},
};

const initialUI: UIState = {
    selectedNodeId: null,
    zoomLevel: 1,
};

const initialNodes: Node<WorkflowNodeData>[] = [
    {
        id: 'start-1',
        type: 'input',
        data: { label: 'Start Trigger' },
        position: { x: 250, y: 50 },
    },
];

export const useWorkflowStore = create<WorkflowState>()(
    persist(
        (set, get) => ({
            // Layer 0: Meta
            meta: initialMeta,

            // Layer 1: Graph
            nodes: initialNodes,
            edges: [],

            // Layer 2: UI
            ui: initialUI,

            // Layer 3: Execution
            execution: initialExecution,

            // --- Actions ---

            setNodes: (nodes) => set({ nodes }),
            setEdges: (edges) => set({ edges }),

            onNodesChange: (changes: NodeChange[]) => {
                // When nodes change (dragged, selected), we update state.
                set({
                    nodes: applyNodeChanges(changes, get().nodes),
                    meta: { ...get().meta, status: 'draft' } // Mark as draft on change
                });
            },

            onEdgesChange: (changes: EdgeChange[]) => {
                set({
                    edges: applyEdgeChanges(changes, get().edges),
                    meta: { ...get().meta, status: 'draft' }
                });
            },

            onConnect: (connection: Connection) => {
                set({
                    edges: addEdge(connection, get().edges),
                    meta: { ...get().meta, status: 'draft' }
                });
            },

            addNode: (node: Node<WorkflowNodeData>) => {
                set({
                    nodes: [...get().nodes, node],
                    meta: { ...get().meta, status: 'draft' }
                });
            },

            // UI Actions
            setSelectedNode: (id: string | null) => {
                set((state) => ({
                    ui: { ...state.ui, selectedNodeId: id },
                }));
            },

            // Logic & Validation
            isValidConnection: (connection: Connection) => {
                const { edges } = get();
                // 1. Connectivity Rules
                if (connection.source === connection.target) return false;

                // No duplicate edges
                const isDuplicate = edges.some(
                    (e) =>
                        e.source === connection.source &&
                        e.target === connection.target &&
                        e.sourceHandle === connection.sourceHandle &&
                        e.targetHandle === connection.targetHandle
                );
                if (isDuplicate) return false;

                return true;
            },

            updateNodeData: (nodeId, data) => {
                set({
                    nodes: get().nodes.map((node) => {
                        if (node.id === nodeId) {
                            return { ...node, data: { ...node.data, ...data } };
                        }
                        return node;
                    }),
                    meta: { ...get().meta, status: 'draft' }
                });
            },

            // Execution Actions
            startExecution: () => {
                set((state) => ({
                    execution: {
                        ...state.execution,
                        status: 'running',
                        runId: `run_${Date.now()}`,
                        errors: {},
                        results: {},
                        nodeStatus: {},
                    },
                }));
            },

            stopExecution: () => {
                set((state) => ({
                    execution: {
                        ...state.execution,
                        status: 'idle',
                        activeNodeId: null,
                    },
                }));
            },

            setNodeStatus: (nodeId: string, status: NodeStatus) => {
                set((state) => ({
                    execution: {
                        ...state.execution,
                        nodeStatus: {
                            ...state.execution.nodeStatus,
                            [nodeId]: status,
                        },
                    },
                }));
            },

            // Persistence Actions
            publishVersion: () => {
                set((state) => {
                    const [major, minor, patch] = state.meta.version.split('.').map(Number);
                    // Simple patch increment for now
                    const newVersion = `${major}.${minor}.${patch + 1}`;
                    return {
                        meta: {
                            ...state.meta,
                            version: newVersion,
                            status: 'published',
                        },
                        // Reset execution state on publish
                        execution: { ...initialExecution },
                    };
                });
            },
        }),
        {
            name: 'elysian-workflow-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            partialize: (state) => ({
                nodes: state.nodes,
                edges: state.edges,
                meta: state.meta
            }), // Only persist Graph and Meta, ignore UI and Execution
        }
    )
);
