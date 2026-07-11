import { http, HttpResponse } from 'msw';

export const handlers = [
    // Strict Network-Level Auth Mocks (Zero Production Pollution)
    http.get('*/api/v1/auth/me', ({ cookies }) => {
        // MSW strictly checks if the network cookie is present, validating HttpOnly behavior
        const token = cookies.auth_token || cookies.session;
        if (!token) {
            return new HttpResponse(null, { status: 401 });
        }
        return HttpResponse.json({
            status: 'success',
            data: {
                user: {
                    name: 'Elysian Admin',
                    email: 'admin@elysian.com',
                    avatar: null,
                }
            }
        });
    }),

    http.post('*/api/v1/auth/login', () => {
        return HttpResponse.json({
            status: 'success',
            data: { message: 'SSO Login successful' }
        }, {
            headers: {
                // Simulating the Backend's Strict Set-Cookie execution natively
                // Note: MSW resolves this at the Service Worker level in the browser.
                'Set-Cookie': 'auth_token=mock_jwt_token_123; HttpOnly; Path=/; SameSite=Lax',
            }
        });
    }),

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

// ============================================
// Settings Mock Data (Workspace & AI)
// ============================================

let teammates = [
    { id: '1', name: 'Matt Yudha', email: 'matt@elysian.com', role: 'owner', lastActive: 'Just now' },
    { id: '2', name: 'Sarah Connor', email: 'sarah@elysian.com', role: 'admin', lastActive: '2 hours ago' },
    { id: '3', name: 'John Doe', email: 'john@elysian.com', role: 'member', lastActive: '1 day ago' },
];

let agents = [
    { id: '1', name: 'Customer Support Bot', type: 'Support', status: 'active', calls: 15420 },
    { id: '2', name: 'Sales Assistant', type: 'Sales', status: 'paused', calls: 3200 },
];

export const settingsHandlers = [
    // Workspace Teammates
    http.get('*/api/workspace/teammates', () => {
        return HttpResponse.json({ status: 'success', data: teammates });
    }),

    http.delete('*/api/workspace/teammates/:id', ({ params }) => {
        const { id } = params;
        teammates = teammates.filter(t => t.id !== id);
        return new HttpResponse(null, { status: 204 });
    }),

    // AI Agents
    http.get('*/api/ai/agents', () => {
        return HttpResponse.json({ status: 'success', data: agents });
    }),

    http.patch('*/api/ai/agents/:id/status', async ({ params, request }) => {
        const { id } = params;
        const body = await request.json() as { status: string };
        agents = agents.map(a => a.id === id ? { ...a, status: body.status } : a);
        return HttpResponse.json({ status: 'success' });
    }),

    // Workspace Billing Stub
    http.get('*/api/workspace/billing', () => {
        return HttpResponse.json({
            status: 'success',
            data: {
                plan: 'Enterprise',
                status: 'active',
                nextBillingDate: '2026-12-31T23:59:59Z',
                amount: 49900,
                currency: 'USD',
                seats: 12,
                usage: 84
            }
        });
    })
];

// Append the new handlers
handlers.push(...settingsHandlers);
