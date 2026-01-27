import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkflowBuilder } from './WorkflowBuilder';

// Mock child components to verify integration without rendering complexity
vi.mock('./Canvas', () => ({
    Canvas: () => <div data-testid="mock-canvas">Canvas</div>,
}));
vi.mock('./Sidebar', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Sidebar: ({ onNodeSelect }: any) => (
        <div data-testid="mock-sidebar">
            <button onClick={() => onNodeSelect('llm', 'LLM Node')}>Add LLM</button>
        </div>
    ),
}));
vi.mock('./Toolbar', () => ({
    Toolbar: () => <div data-testid="mock-toolbar">Toolbar</div>,
}));
vi.mock('./ConfigPanel', () => ({
    ConfigPanel: () => <div data-testid="mock-config-panel">ConfigPanel</div>,
}));
vi.mock('./ResultsPanel', () => ({
    ResultsPanel: () => <div data-testid="mock-results-panel">ResultsPanel</div>,
}));

// Mock ReactFlow hook
const mockProject = vi.fn((pos) => pos);
vi.mock('reactflow', async () => {
    const actual = await vi.importActual('reactflow');
    return {
        ...actual,
        useReactFlow: () => ({
            project: mockProject,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
    };
});

// Mock Local Workflow Store (src/components/workflow/store.ts)
const mockAddNode = vi.fn();
vi.mock('./store', () => ({
    useWorkflowStore: () => ({
        addNode: mockAddNode,
        selectedNode: null,
        setSelectedNode: vi.fn(),
        project: mockProject,
    }),
}));

describe('WorkflowBuilder Integration', () => {
    it('renders all main components', () => {
        render(<WorkflowBuilder />);
        expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
        expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-toolbar')).toBeInTheDocument();
    });

    it('addNode is called when sidebar item is selected', () => {
        render(<WorkflowBuilder />);
        const addButton = screen.getByText('Add LLM');
        fireEvent.click(addButton);

        expect(mockAddNode).toHaveBeenCalled();
        // Expect correct args
        const calledArg = mockAddNode.mock.calls[0][0];
        expect(calledArg.type).toBe('llm');
        expect(calledArg.data.label).toBe('LLM Node');
    });
});
