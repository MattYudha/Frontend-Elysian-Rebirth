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
import { executeWorkflow, getExecution } from '@/services/workflow.service';
import { toast } from 'sonner';
import { createEncryptedIdbStorage } from '@/lib/storage-engine';

const STORAGE_SECRET = process.env.NEXT_PUBLIC_STORAGE_KEY ?? 'DEV_ONLY_STATIC_KEY';


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
    logs: [],
};

const initialUI: UIState = {
    selectedNodeId: null,
    zoomLevel: 1,
};

const initialNodes: Node<WorkflowNodeData>[] = [
    {
        id: 'start-1',
        type: 'start',
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

            // OCC and Auto-save flags
            isDirty: false,
            serverVersion: '',

            // --- Actions ---

            setNodes: (nodes) => set({ nodes, isDirty: true }),
            setEdges: (edges) => set({ edges, isDirty: true }),

            onNodesChange: (changes: NodeChange[]) => {
                const hasStructuralChange = changes.some(
                    (c) => c.type === 'position' || c.type === 'remove' || c.type === 'add'
                );
                set({
                    nodes: applyNodeChanges(changes, get().nodes),
                    meta: hasStructuralChange ? { ...get().meta, status: 'draft' } : get().meta,
                    isDirty: get().isDirty || hasStructuralChange
                });
            },

            onEdgesChange: (changes: EdgeChange[]) => {
                const hasStructuralChange = changes.some(
                    (c) => c.type === 'remove' || c.type === 'add' || c.type === 'reset'
                );
                set({
                    edges: applyEdgeChanges(changes, get().edges),
                    meta: hasStructuralChange ? { ...get().meta, status: 'draft' } : get().meta,
                    isDirty: get().isDirty || hasStructuralChange
                });
            },

            onConnect: (connection: Connection) => {
                set({
                    edges: addEdge(connection, get().edges),
                    meta: { ...get().meta, status: 'draft' },
                    isDirty: true
                });
            },

            addNode: (node: Node<WorkflowNodeData>) => {
                set({
                    nodes: [...get().nodes, node],
                    meta: { ...get().meta, status: 'draft' },
                    isDirty: true
                });
            },

            // UI Actions
            setSelectedNode: (id: string | null) => {
                set((state) => ({
                    ui: { ...state.ui, selectedNodeId: id },
                }));
            },

            // Logic & Validation
            isValidConnection: (connection: Edge | Connection) => {
                const { edges } = get();
                // Rule 1: No self-connections
                if (connection.source === connection.target) return false;

                // Rule 2: No duplicate edges
                const isDuplicate = edges.some(
                    (e) =>
                        e.source === connection.source &&
                        e.target === connection.target &&
                        e.sourceHandle === connection.sourceHandle &&
                        e.targetHandle === connection.targetHandle
                );
                if (isDuplicate) return false;

                // Rule 3: DAG Cycle Detection (BFS)
                // If we can walk from connection.target back to connection.source
                // via existing edges, adding this edge would create a cycle → reject it.
                const adjacency: Record<string, string[]> = {};
                edges.forEach((e) => {
                    if (!adjacency[e.source]) adjacency[e.source] = [];
                    adjacency[e.source].push(e.target);
                });

                const queue = [connection.target!];
                const visited = new Set<string>();
                while (queue.length > 0) {
                    const current = queue.shift()!;
                    if (current === connection.source) {
                        toast.warning('Koneksi memutar (loop) tidak diizinkan.');
                        return false;
                    }
                    if (!visited.has(current)) {
                        visited.add(current);
                        (adjacency[current] || []).forEach((n) => queue.push(n));
                    }
                }

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
                    meta: { ...get().meta, status: 'draft' },
                    isDirty: true
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
                        logs: [],
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

            executeWorkflow: async () => {
                const { nodes, edges, startExecution, setNodeStatus } = get();
                startExecution();

                // --- Build topological order (BFS/Kahn's algorithm) ---
                const inDegree: Record<string, number> = {};
                const adjacency: Record<string, string[]> = {};
                nodes.forEach((n) => { inDegree[n.id] = 0; adjacency[n.id] = []; });
                edges.forEach((e) => {
                    if (adjacency[e.source] && inDegree[e.target] !== undefined) {
                        adjacency[e.source].push(e.target);
                        inDegree[e.target] = (inDegree[e.target] || 0) + 1;
                    }
                });
                const queue = nodes.filter((n) => inDegree[n.id] === 0).map((n) => n.id);
                const order: string[] = [];
                while (queue.length > 0) {
                    const nodeId = queue.shift()!;
                    order.push(nodeId);
                    (adjacency[nodeId] || []).forEach((neighbor) => {
                        inDegree[neighbor]--;
                        if (inDegree[neighbor] === 0) queue.push(neighbor);
                    });
                }

                let delay = 0;
                
                // Add initial trigger log
                setTimeout(() => {
                    const timestamp = new Date().toISOString();
                    set((state) => ({
                        execution: {
                            ...state.execution,
                            logs: [
                                ...state.execution.logs,
                                { level: 'INFO', message: 'Workflow engine initialized. Parsing DAG structure...', timestamp }
                            ]
                        }
                    }));
                }, 100);
                delay += 400;

                order.forEach((nodeId) => {
                    const node = nodes.find((n) => n.id === nodeId);
                    if (!node) return;
                    
                    const nodeType = node.type || '';
                    const nodeLabel = node.data?.label || 'Unknown Component';

                    // 1. Mark Running
                    setTimeout(() => {
                        setNodeStatus(nodeId, 'running');
                        const timestamp = new Date().toISOString();
                        
                        const logMessage = `Entering node [${nodeLabel}] (${nodeType})`;
                        set((state) => ({
                            execution: {
                                ...state.execution,
                                logs: [
                                    ...state.execution.logs,
                                    { level: 'INFO', message: logMessage, timestamp }
                                ]
                            }
                        }));
                    }, delay);

                    delay += 300;

                    // 2. Specific node execution log
                    setTimeout(() => {
                        const timestamp = new Date().toISOString();
                        let logsToAdd: { level: string; message: string }[] = [];

                        if (nodeType === 'start' || nodeType === 'startTrigger') {
                            logsToAdd = [
                                { level: 'INFO', message: 'Start Trigger activated. Capturing initial execution context.' },
                                { level: 'INFO', message: 'Payload context: {"user_id": "68b02f86", "user_role": "admin", "tenant": "Workspace A", "channel": "testing_portal"}' }
                            ];
                        } else if (nodeType === 'web_scraper' || nodeType === 'data_ingestion' || nodeType === 'rag_knowledge' || nodeType === 'knowledge_source' || nodeType === 'rag_retriever') {
                            logsToAdd = [
                                { level: 'INFO', message: `Querying internal knowledge database for resource matching: "${nodeLabel}"` },
                                { level: 'INFO', message: 'Successfully fetched reference content (size: 4.8 KB, format: markdown)' }
                            ];
                        } else if (nodeType === 'sql_connector' || nodeType === 'sqlConnector') {
                            logsToAdd = [
                                { level: 'INFO', message: 'Establishing connection to DB pool (Postgres localhost:5432)...' },
                                { level: 'INFO', message: 'Query executed: SELECT email, full_name, role FROM users LIMIT 5' },
                                { level: 'INFO', message: 'Retrieved 5 records from database cluster.' }
                            ];
                        } else if (nodeType === 'fds_fraud' || nodeType === 'fraudVerify' || nodeType === 'guardrail') {
                            logsToAdd = [
                                { level: 'INFO', message: 'Triggering FDS (Fraud Detection System) compliance scan.' },
                                { level: 'WARN', message: 'Scan Warning: Transaction rate anomaly detected on user_id "68b02f86"' },
                                { level: 'INFO', message: 'FDS status: PASSED WITH WARNINGS (Risk level: 0.35)' }
                            ];
                        } else if (nodeType === 'agent' || nodeType === 'llm' || nodeType === 'reasoning' || nodeType === 'llm_agent') {
                            logsToAdd = [
                                { level: 'INFO', message: 'Prompting Reasoning model with context data...' },
                                { level: 'INFO', message: 'Model response parsed successfully. Tokens spent: 1,940 prompt / 420 completion.' }
                            ];
                        } else {
                            logsToAdd = [
                                { level: 'INFO', message: `Executing task processor inside component [${nodeLabel}]` }
                            ];
                        }

                        set((state) => ({
                            execution: {
                                ...state.execution,
                                logs: [
                                    ...state.execution.logs,
                                    ...logsToAdd.map(l => ({ ...l, timestamp }))
                                ]
                            }
                        }));
                    }, delay);

                    delay += 600;

                    // 3. Mark Success
                    setTimeout(() => {
                        setNodeStatus(nodeId, 'success');
                        const timestamp = new Date().toISOString();
                        set((state) => ({
                            execution: {
                                ...state.execution,
                                logs: [
                                    ...state.execution.logs,
                                    { level: 'INFO', message: `Node [${nodeLabel}] completed execution. Passing output context downstream.`, timestamp }
                                ]
                            }
                        }));
                    }, delay);

                    delay += 200;
                });

                // Mark completion and set mock output payload
                setTimeout(() => {
                    const timestamp = new Date().toISOString();
                    
                    // Generate cool structured JSON based on nodes used
                    const results = {
                        status: "success",
                        timestamp: new Date().toISOString(),
                        workflow_details: {
                            id: get().meta.workflowId,
                            name: get().meta.name,
                            version: get().meta.version
                        },
                        execution_summary: {
                            total_nodes_processed: order.length,
                            total_duration_ms: delay,
                            execution_mode: "simulation"
                        },
                        outputs: {
                            triggered_by: "Super Matt",
                            input_payload: {
                                test_scenario: "manual_verification",
                                locale: "id"
                            },
                            extracted_features: {
                                anomalies_detected: true,
                                risk_score: 0.35,
                                action_required: "monitor"
                            },
                            agent_decision: {
                                status: "approved",
                                reasoning: "Transaksi berada dalam batas toleransi wajar meskipun terdapat peningkatan frekuensi jangka pendek.",
                                agent_id: "agent-reasoning-pro-v1"
                            }
                        }
                    };

                    set((state) => ({
                        execution: {
                            ...state.execution,
                            status: 'completed',
                            results,
                            logs: [
                                ...state.execution.logs,
                                { level: 'INFO', message: 'DAG execution finished. Cleaning memory resources.', timestamp },
                                { level: 'INFO', message: 'All outputs stored in context payload.', timestamp }
                            ]
                        }
                    }));

                    toast.success('Workflow Execution Complete', {
                        description: `${order.length} nodes executed successfully.`
                    });
                }, delay + 200);
            },

            pollExecution: async () => {
                const { execution } = get();
                if (!execution.runId || execution.status === 'completed' || execution.status === 'failed') return;

                try {
                    try {
                        // Call API: GET /execution/:id
                        const details = await getExecution(execution.runId);

                        const nodeStatus: Record<string, NodeStatus> = { ...execution.nodeStatus };
                        const logs = details.logs || [];

                        // Parse Logs to update Node Status
                        logs.forEach(log => {
                            // Logic: If we see a log for a node, it means it started/finished.
                            // Ideally backend sends explicit node status updates, but parsing logs works for MVP.
                            if (log.nodeId && log.level !== 'ERROR') {
                                nodeStatus[log.nodeId] = 'success';
                            }
                            if (log.nodeId && log.level === 'ERROR') {
                                nodeStatus[log.nodeId] = 'error';
                            }
                        });

                        // Update Status
                        const mappedStatus = details.status.toLowerCase() as ExecutionState['status'];

                        set((state) => ({
                            execution: {
                                ...state.execution,
                                status: mappedStatus,
                                nodeStatus: nodeStatus,
                                // Store results if completed
                                results: details.results || {}
                            }
                        }));

                        // Continue Polling if not finished
                        if (details.status === 'PENDING' || details.status === 'RUNNING') {
                            setTimeout(() => get().pollExecution(), 1500); // 1.5s interval
                        } else {
                            // Finished
                            if (details.status === 'COMPLETED') {
                                toast.success("Execution Completed");
                            } else if (details.status === 'FAILED') {
                                toast.error("Execution Failed");
                            }
                        }
                    } catch (error) {
                        console.error("Polling error", error);
                        // Don't stop polling immediately on one error, maybe network blip
                        // But if 404, maybe stop. For now, simple retry logic is implicitly handled by user re-click or ignoring.
                    }
                } catch (error) {
                    console.error("Polling error", error);
                }
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

            setDirty: (dirty) => set({ isDirty: dirty }),

            setFromServer: (nodes, edges, version) => {
                set({
                    nodes,
                    edges,
                    isDirty: false,
                    serverVersion: version,
                    meta: {
                        ...get().meta,
                        version: version || '1.0.0',
                        status: get().meta.status === 'published' ? 'published' : 'draft',
                    }
                });
            },

            resetWorkflow: () => {
                set({
                    nodes: initialNodes,
                    edges: [],
                    isDirty: false,
                    serverVersion: '',
                    meta: initialMeta,
                    execution: initialExecution,
                    ui: initialUI
                });
            },

            setWorkflowId: (id) => {
                if (id) {
                    set({
                        meta: {
                            ...get().meta,
                            workflowId: id
                        }
                    });
                }
            },

            // Computed Getters (Mocking them as properties for now, ideally strictly typed getters)
            get selectedNode() {
                const state = get();
                return state.nodes.find((n) => n.id === state.ui.selectedNodeId) || null;
            },
        }),
        {
            name: 'elysian-workflow-storage',
            storage: createEncryptedIdbStorage<WorkflowState>({
                key: 'elysian-workflow',
                secret: STORAGE_SECRET,
            }),
            partialize: (state) => ({
                nodes: state.nodes,
                edges: state.edges,
                meta: state.meta,
                serverVersion: state.serverVersion,
            }) as unknown as WorkflowState,
        }
    )
);
