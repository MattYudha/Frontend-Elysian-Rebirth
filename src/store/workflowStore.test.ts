import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWorkflowStore } from './workflowStore';
import { act } from '@testing-library/react';

// Mock storage engine to avoid async persistence issues in unit tests
vi.mock('@/lib/storage-engine', () => ({
    createEncryptedIdbStorage: () => ({
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
    }),
}));

describe('workflowStore', () => {
    const store = useWorkflowStore;

    beforeEach(() => {
        act(() => {
            store.setState({
                nodes: [],
                edges: [],
                pipelines: [],
                isDirty: false,
            });
        });
    });

    it('addNode should add a node and mark as dirty', () => {
        const newNode = { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } };

        act(() => {
            store.getState().addNode(newNode);
        });

        const state = store.getState();
        expect(state.nodes).toHaveLength(1);
        expect(state.nodes[0]).toEqual(newNode);
        expect(state.isDirty).toBe(true);
    });

    it('deleteNode should remove node and connected edges', () => {
        const node1 = { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } };
        const node2 = { id: '2', position: { x: 100, y: 0 }, data: { label: 'Node 2' } };
        const edge = { id: 'e1-2', source: '1', target: '2' };

        act(() => {
            store.setState({ nodes: [node1, node2], edges: [edge] });
        });

        act(() => {
            store.getState().deleteNode('1');
        });

        const state = store.getState();
        expect(state.nodes).toHaveLength(1);
        expect(state.nodes[0].id).toBe('2');
        expect(state.edges).toHaveLength(0); // Edge connected to '1' should be gone
    });

    it('deletePipelineOptimistic should remove pipeline and return snapshot', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p1 = { id: '1', name: 'P1', status: 'queued', createdAt: '' } as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p2 = { id: '2', name: 'P2', status: 'processing', createdAt: '' } as any;

        act(() => {
            store.setState({ pipelines: [p1, p2] });
        });

        let snapshot;
        act(() => {
            snapshot = store.getState().deletePipelineOptimistic('1');
        });

        const state = store.getState();
        expect(state.pipelines).toHaveLength(1);
        expect(state.pipelines[0].id).toBe('2');
        expect(snapshot).toHaveLength(2); // Should return original state
    });
});
