import { http, HttpResponse } from 'msw';

export const handlers = [
    // Dashboard Stats Mock
    http.get('*/api/dashboard/stats', () => {
        return HttpResponse.json({
            status: 'success',
            data: {
                docs: 1284,
                apiCalls: 48200,
                errorRate: 0.08,
                successRate: 99.92,
                growth: 24,
            }
        });
    }),

    // Active Pipelines Mock
    http.get('*/api/dashboard/pipelines', () => {
        return HttpResponse.json({
            status: 'success',
            data: [
                { id: '1', name: 'Invoice Processing', status: 'active', lastRun: '2 mins ago', accuracy: '99.8%' },
                { id: '2', name: 'Contract Summary', status: 'active', lastRun: '15 mins ago', accuracy: '98.5%' },
                { id: '3', name: 'Customer Support Bot', status: 'paused', lastRun: '1 hour ago', accuracy: '94.2%' },
            ]
        });
    }),

    // User Profile Mock
    http.get('*/api/user/profile', () => {
        return HttpResponse.json({
            status: 'success',
            data: {
                id: 'user_123',
                name: 'Matt Yudha',
                role: 'CEO & Founder',
                avatar: null,
            }
        });
    }),

    // Workflow Endpoints
    http.get('*/api/v1/workflows', () => {
        return HttpResponse.json({
            status: 'success',
            data: [
                {
                    id: 'pipe_001',
                    name: 'Customer Support RAG Indexing',
                    status: 'processing',
                    progress: 67,
                    eta: '2 min remaining',
                    lastUpdated: new Date(Date.now() - 30000).toISOString(),
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 'pipe_002',
                    name: 'Product Documentation Update',
                    status: 'queued',
                    lastUpdated: new Date(Date.now() - 120000).toISOString(),
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 'pipe_003',
                    name: 'Weekly Knowledge Refresh',
                    status: 'completed',
                    progress: 100,
                    lastUpdated: new Date(Date.now() - 300000).toISOString(),
                    createdAt: new Date().toISOString(),
                },
            ]
        });
    }),

    http.post('*/api/v1/workflows', async ({ request }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await request.json() as any;
        return HttpResponse.json({
            status: 'success',
            data: {
                id: `wf-${Math.random().toString(36).substr(2, 9)}`,
                name: data.name || 'Untitled Workflow',
                status: 'draft',
                createdAt: new Date().toISOString(),
                ...data,
            }
        }, { status: 201 });
    }),

    http.delete('*/api/v1/workflows/:id', () => {
        return new HttpResponse(null, { status: 204 });
    }),

    // Chart Data Mock
    http.get('*/api/dashboard/chart', () => {
        return HttpResponse.json({
            status: 'success',
            data: [
                { day: "Mon", tokens: 1200, cost: 4.2 },
                { day: "Tue", tokens: 3500, cost: 12.5 },
                { day: "Wed", tokens: 2100, cost: 7.8 },
                { day: "Thu", tokens: 4800, cost: 15.2 },
                { day: "Fri", tokens: 3800, cost: 11.4 },
                { day: "Sat", tokens: 1500, cost: 5.1 },
                { day: "Sun", tokens: 900, cost: 3.2 },
            ]
        });
    }),
];
