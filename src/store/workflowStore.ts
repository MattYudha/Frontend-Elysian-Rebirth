/**
 * workflowStore.ts — Client-only canvas state for Workflow Builder
 *
 * Server state (pipelines list, workflow details) is managed by React Query:
 *   - useWorkflows() → fetches pipeline list
 *   - useWorkflowLoader(id) → fetches detail, always seeds canvas with latest server state
 *   - useSaveWorkflow() → persists with OCC conflict detection
 *
 * This store manages:
 *   - Canvas UI state (nodes, edges, selection)
 *   - isDirty — UX indicator only ("unsaved changes" dot), never blocks data flow
 *   - serverVersion — hash/ETag of last-known server state for OCC
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Node, Edge } from 'reactflow';
import { createEncryptedIdbStorage } from '@/lib/storage-engine';

interface WorkflowState {
  workflowId: string | null;
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  isDirty: boolean;
  serverVersion: string;

  setWorkflowId: (id: string | null) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (node: Node | null) => void;
  setDirty: (dirty: boolean) => void;

  /**
   * setFromServer — Always accept server data and record version.
   * Called by useWorkflowLoader when server data arrives.
   * isDirty is NOT a gate — server data always flows through.
   */
  setFromServer: (nodes: Node[], edges: Edge[], version: string) => void;

  clearWorkflow: () => void;

  /**
   * resetWorkflow — Called on WorkflowBuilder unmount.
   * Clears all canvas state + workflowId to prevent state
   * contamination when navigating between different pipelines.
   */
  resetWorkflow: () => void;
}

const STORAGE_SECRET = process.env.NEXT_PUBLIC_STORAGE_KEY ?? 'DEV_ONLY_STATIC_KEY';

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      workflowId: null,
      nodes: [],
      edges: [],
      selectedNode: null,
      isDirty: false,
      serverVersion: '',

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

      setWorkflowId: (id) => set({ workflowId: id }),

      setSelectedNode: (node) => set({ selectedNode: node }),

      setDirty: (dirty) => set({ isDirty: dirty }),

      setFromServer: (nodes, edges, version) =>
        set({
          nodes,
          edges,
          isDirty: false,
          serverVersion: version,
        }),

      clearWorkflow: () =>
        set({
          nodes: [],
          edges: [],
          selectedNode: null,
          isDirty: false,
          serverVersion: '',
        }),

      resetWorkflow: () =>
        set({
          workflowId: null,
          nodes: [],
          edges: [],
          selectedNode: null,
          isDirty: false,
          serverVersion: '',
        }),
    }),
    {
      name: 'workflow-storage',
      version: 3,
      storage: createEncryptedIdbStorage<WorkflowState>({
        key: 'elysian-workflow',
        secret: STORAGE_SECRET,
      }),
      partialize: (state) => ({
        workflowId: state.workflowId,
        nodes: state.nodes,
        edges: state.edges,
        serverVersion: state.serverVersion,
      }) as unknown as WorkflowState,
      migrate: (persistedState, version) => {
        if (version < 3) {
          const s = persistedState as Partial<WorkflowState>;
          return {
            nodes: s.nodes || [],
            edges: s.edges || [],
            selectedNode: null,
            isDirty: false,
            serverVersion: '',
          } as WorkflowState;
        }
        return persistedState as WorkflowState;
      },
    }
  )
);
