import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Node, Edge } from 'reactflow';
import type { PipelineItem } from '@/types/x';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  isDirty: boolean;
  // Pipeline State (Optimistic UI Demo)
  pipelines: PipelineItem[];

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (node: Node | null) => void;
  saveWorkflow: () => Promise<void>;
  loadWorkflow: (id: string) => Promise<void>;
  clearWorkflow: () => void;

  // Pipeline Actions
  setPipelines: (pipelines: PipelineItem[]) => void;
  deletePipelineOptimistic: (id: string) => PipelineItem[];
  restorePipelines: (pipelines: PipelineItem[]) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNode: null,
      isDirty: false,
      pipelines: [
        {
          id: 'pipe_001',
          name: 'Customer Support RAG Indexing',
          status: 'processing',
          progress: 67,
          eta: '2 min remaining',
          lastUpdated: new Date(Date.now() - 30000),
        },
        {
          id: 'pipe_002',
          name: 'Product Documentation Update',
          status: 'queued',
          lastUpdated: new Date(Date.now() - 120000),
        },
        {
          id: 'pipe_003',
          name: 'Weekly Knowledge Refresh',
          status: 'completed',
          progress: 100,
          lastUpdated: new Date(Date.now() - 300000),
        },
      ],

      setNodes: (nodes) => set({ nodes, isDirty: true }),

      setEdges: (edges) => set({ edges, isDirty: true }),

      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
          isDirty: true,
        })),

      updateNode: (id, data) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...data } } : n
          ),
          isDirty: true,
        })),

      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
          edges: state.edges.filter((e) => e.source !== id && e.target !== id),
          isDirty: true,
        })),

      setSelectedNode: (node) => set({ selectedNode: node }),

      saveWorkflow: async () => {
        const { nodes, edges } = get();
        // TODO: Call backend API
        console.log('Saving workflow:', { nodes, edges });
        set({ isDirty: false });
      },

      loadWorkflow: async (id) => {
        // TODO: Call backend API
        console.log('Loading workflow:', id);
      },

      clearWorkflow: () =>
        set({
          nodes: [],
          edges: [],
          selectedNode: null,
          isDirty: false,
        }),

      // Pipeline Actions Implementation
      setPipelines: (pipelines) => set({ pipelines }),

      deletePipelineOptimistic: (id) => {
        const currentPipelines = get().pipelines;
        set((state) => ({
          pipelines: state.pipelines.filter((p) => p.id !== id)
        }));
        return currentPipelines; // Return snapshot for rollback
      },

      restorePipelines: (pipelines) => set({ pipelines }),
    }),
    {
      name: 'workflow-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);
