import { create } from 'zustand';

export type AgentPayloadType = 'diff' | 'json' | 'markdown';
export type ActionType = 'DATA_MUTATION' | 'SECURITY' | 'BILLING' | 'OPS_ALERT' | 'REPORT' | 'IDENTITY';
export type ActionSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ActionStatus = 'pending' | 'approving' | 'rejecting' | 'approved' | 'rejected' | 'executing' | 'executed' | 'failed' | 'expired';

export interface PolicyCheck {
    id: string;
    label: string;
    status: 'pass' | 'fail' | 'warn';
    details?: string;
}

export interface TimelineEvent {
    at: string;
    actor: string;
    type: string;
    note: string;
}

export interface BlastRadius {
    scope: 'staging' | 'prod' | 'workspace' | 'tenant';
    rowsAffected?: number;
    resources?: string[];
}

export interface TargetSystem {
    system: 'db' | 'api' | 'billing' | 'identity';
    identifier?: string;
}

export interface AgentActionRequest {
    id: string;
    title: string;
    type: ActionType;
    severity: ActionSeverity;
    sourceAgent: string;
    tenant: string;

    // Payload & Viewing
    payloadType: AgentPayloadType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
    summary: string; // 1-2 bullet human readable digest
    explanation?: string; // Optional longer narrative

    // Risk & Verification
    blastRadius: BlastRadius;
    target: TargetSystem;
    policyChecks: PolicyCheck[];
    riskScore: number; // 0-100 computed value

    // Lifecycle
    createdAt: string; // ISO
    slaDueAt: string; // ISO
    expiresAt: string; // ISO
    timelineEvents: TimelineEvent[];

    isRead: boolean;
    status: ActionStatus;
}

interface NotificationState {
    actions: AgentActionRequest[];
    addAction: (action: Omit<AgentActionRequest, 'id' | 'createdAt' | 'isRead' | 'status' | 'riskScore'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    unreadCount: () => number;

    // Action Center Ops
    approveAction: (id: string, justification?: string) => void;
    rejectAction: (id: string, justification?: string) => void;
    undoAction: (id: string) => void;
    refreshSLAStatuses: () => void; // Called periodically to lock expired tasks
}

/**
 * Adapter Layer: Centralized Risk Computation
 * Computes a deterministic risk score (0-100) based on severity, blast radius, and policy failures.
 */
function computeRisk(severity: ActionSeverity, type: ActionType, blastRadius: BlastRadius, policies: PolicyCheck[]): number {
    let score = 0;

    // Base risk from severity
    if (severity === 'critical') score += 50;
    if (severity === 'high') score += 30;
    if (severity === 'medium') score += 15;
    if (severity === 'low') score += 5;

    // Base risk from type
    if (type === 'BILLING' || type === 'IDENTITY') score += 20;
    if (type === 'DATA_MUTATION' && blastRadius.scope === 'prod') score += 30;

    // Base risk from blast radius
    if (blastRadius.scope === 'prod') score += 15;
    if (blastRadius.rowsAffected && blastRadius.rowsAffected > 1000) score += 15;

    // Penalty for policy fails/warns
    const fails = policies.filter(p => p.status === 'fail').length;
    const warns = policies.filter(p => p.status === 'warn').length;

    score += (fails * 20);
    score += (warns * 5);

    return Math.min(score, 100);
}

// Generate future dates safely without hydrating mismatches
const now = new Date('2026-02-25T11:00:00.000Z').getTime();

// SSR safe mock data using hardcoded ISO strings
const INITIAL_ACTIONS: AgentActionRequest[] = [
    {
        id: 'msg-audit-001',
        title: 'Delete Anomalous Rows',
        type: 'DATA_MUTATION',
        severity: 'high',
        sourceAgent: 'Data Analyst Bot',
        tenant: 'Fintech Mobile App',

        payloadType: 'diff',
        payload: {
            name: "anomalous_data_cleanup",
            before: "Total rows: 15420\nAnomalies detected: 500\nStatus: Pending",
            after: "Total rows: 14920\nAnomalies detected: 0\nStatus: Cleaned"
        },
        summary: 'Agent requests permission to delete 500 rows tagged as anomalous in staging.\nReversibility: Full snapshot available.',
        explanation: 'During routine scan of `transactions_staging`, 500 records matched the anomaly matrix (Pattern C-14). Discarding them ensures data integrity for models.',

        blastRadius: { scope: 'staging', rowsAffected: 500, resources: ['db-fintech-staging-01'] },
        target: { system: 'db', identifier: 'transactions_staging' },
        policyChecks: [
            { id: 'p1', label: 'Allowed Environment (Staging)', status: 'pass' },
            { id: 'p2', label: 'Max rows delete <= 1000', status: 'pass' },
            { id: 'p3', label: 'Request includes query preview', status: 'pass' },
        ],
        riskScore: computeRisk('high', 'DATA_MUTATION', { scope: 'staging', rowsAffected: 500 }, [
            { id: 'p1', label: 'Allowed Environment (Staging)', status: 'pass' },
        ]),

        createdAt: new Date(now - 1000 * 60 * 30).toISOString(), // 30 mins ago
        slaDueAt: new Date(now + 1000 * 60 * 60 * 2).toISOString(), // in 2 hrs
        expiresAt: new Date(now + 1000 * 60 * 60 * 24).toISOString(), // in 24 hrs
        timelineEvents: [
            { at: new Date(now - 1000 * 60 * 30).toISOString(), actor: 'Data Analyst Bot', type: 'CREATED', note: 'Created payload diff for human review' }
        ],

        isRead: false,
        status: 'pending',
    },
    {
        id: 'msg-audit-002',
        title: 'API Rate Limit Warning',
        type: 'OPS_ALERT',
        severity: 'critical',
        sourceAgent: 'Support Bot',
        tenant: 'Ecommerce Admin',

        payloadType: 'json',
        payload: { latency: '1200ms', threshold: '500ms', spikes: 42, suggestedAction: 'Scale up regional edge workers' },
        summary: 'API Latency critically elevated. Suggesting automatic scale-up of edge workers.\nReversibility: Scaling down requires manual intervention.',

        blastRadius: { scope: 'prod', resources: ['edge-us-east', 'edge-eu-central'] },
        target: { system: 'api', identifier: 'gateway-tier-1' },
        policyChecks: [
            { id: 'p4', label: 'Production Requires 2nd Approval', status: 'fail', details: 'Only 1 admin currently online' },
            { id: 'p5', label: 'Within Billing Limits', status: 'warn', details: 'Scaling exceeds daily budget by 15%' },
        ],
        riskScore: computeRisk('critical', 'OPS_ALERT', { scope: 'prod' }, [
            { id: 'p4', label: 'Fail Policy', status: 'fail' }, { id: 'p5', label: 'Warn Policy', status: 'warn' }
        ]),

        createdAt: new Date(now - 1000 * 60 * 5).toISOString(),
        slaDueAt: new Date(now + 1000 * 60 * 15).toISOString(),
        expiresAt: new Date(now + 1000 * 60 * 60).toISOString(),
        timelineEvents: [
            { at: new Date(now - 1000 * 60 * 5).toISOString(), actor: 'Infrastructure Monitor', type: 'CREATED', note: 'Detected latency spike' }
        ],

        isRead: false,
        status: 'pending',
    }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
    actions: INITIAL_ACTIONS,

    addAction: (data) => set((state) => {
        const riskScore = computeRisk(data.severity, data.type, data.blastRadius, data.policyChecks);

        return {
            actions: [
                {
                    id: `msg-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    isRead: false,
                    status: 'pending',
                    riskScore,
                    ...data
                },
                ...state.actions
            ]
        };
    }),

    markAsRead: (id) => set((state) => ({
        actions: state.actions.map((a) =>
            a.id === id ? { ...a, isRead: true } : a
        )
    })),

    markAllAsRead: () => set((state) => ({
        actions: state.actions.map((a) => ({ ...a, isRead: true }))
    })),

    unreadCount: () => get().actions.filter((a) => !a.isRead && ['pending', 'approving', 'rejecting', 'failed'].includes(a.status)).length,

    approveAction: (id, justification) => {
        set((state) => ({
            actions: state.actions.map((a) => {
                if (a.id === id) {
                    const newEvents = [...a.timelineEvents];
                    if (justification) {
                        newEvents.push({
                            at: new Date().toISOString(),
                            actor: 'Security Compliance Office',
                            type: 'OVERRIDE',
                            note: `SecOps human override authorized. Reason: ${justification}`
                        });
                    }
                    return { ...a, status: 'approving', timelineEvents: newEvents };
                }
                return a;
            })
        }));

        // Store-managed timer for "Undo" window
        setTimeout(() => {
            const currentAction = get().actions.find(a => a.id === id);
            // Only resolve if it hasn't been undone
            if (currentAction && currentAction.status === 'approving') {
                set((state) => ({
                    actions: state.actions.map(a => {
                        if (a.id === id) {
                            return {
                                ...a,
                                status: 'approved',
                                timelineEvents: [
                                    ...a.timelineEvents,
                                    { at: new Date().toISOString(), actor: 'Orchestrator', type: 'APPROVED', note: 'Action approved and queued for worker execution' }
                                ]
                            };
                        }
                        return a;
                    })
                }));
            }
        }, 3000);
    },

    rejectAction: (id, justification) => {
        set((state) => ({
            actions: state.actions.map((a) => {
                if (a.id === id) {
                    const newEvents = [...a.timelineEvents];
                    if (justification) {
                        newEvents.push({
                            at: new Date().toISOString(),
                            actor: 'Security Compliance Office',
                            type: 'REJECTION_NOTE',
                            note: `Reason: ${justification}`
                        });
                    }
                    return { ...a, status: 'rejecting', timelineEvents: newEvents };
                }
                return a;
            })
        }));

        setTimeout(() => {
            const currentAction = get().actions.find(a => a.id === id);
            if (currentAction && currentAction.status === 'rejecting') {
                set((state) => ({
                    actions: state.actions.map(a => {
                        if (a.id === id) {
                            return {
                                ...a,
                                status: 'rejected',
                                timelineEvents: [
                                    ...a.timelineEvents,
                                    { at: new Date().toISOString(), actor: 'Orchestrator', type: 'REJECTED', note: 'Action rejected by human operator' }
                                ]
                            };
                        }
                        return a;
                    })
                }));
            }
        }, 3000);
    },

    undoAction: (id) => {
        set((state) => ({
            actions: state.actions.map((a) =>
                a.id === id ? { ...a, status: 'pending' } : a
            )
        }));
    },

    refreshSLAStatuses: () => {
        const _now = new Date().getTime();
        set((state) => ({
            actions: state.actions.map(a => {
                if (a.status === 'pending' || a.status === 'approving' || a.status === 'rejecting') {
                    if (_now >= new Date(a.expiresAt).getTime()) {
                        return { ...a, status: 'expired' };
                    }
                }
                return a;
            })
        }));
    }
}));
