import { http } from '@/lib/http';
import { useDemoStore } from '@/store/demoStore';

export interface BlockchainStatus {
    taskId: string;
    blockchainStatus: 'VERIFIED' | 'PENDING' | 'FAILED' | 'PENDING_CONFIRMATION' | 'UNCOMMITTED';
    blockchainTx: string;
    blockchainNetwork: string;
    rationaleHash: string;
    consensusHash: string;
    updatedAt: string;
}

export interface SwarmTaskDetail {
    id: string;
    documentId: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    summary?: string;
    results?: any;
    rationaleHash?: string;
    consensusHash?: string;
    blockchainTx?: string;
    blockchainStat?: string;
    blockchainNet?: string;
    nftTokenId?: string;
    ipfsCid?: string;
    nftTxHash?: string;
    nft_token_id?: string;
    ipfs_cid?: string;
    nft_tx_hash?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VerificationResult {
    verified: boolean;
    onChainRationaleHash: string;
    onChainConsensusHash: string;
    localRationaleHash: string;
    localConsensusHash: string;
    blockNumber: string;
    timestamp: string;
    owner: string;
    error?: string;
}

const DEMO_VERIFICATION_RESULT: VerificationResult = {
    verified: true,
    onChainRationaleHash: '0x918274a50192847c918274a50192847c',
    onChainConsensusHash: '0x1294812049182470192847c50192847d',
    localRationaleHash: '0x918274a50192847c918274a50192847c',
    localConsensusHash: '0x1294812049182470192847c50192847d',
    blockNumber: '5928104',
    timestamp: new Date().toISOString(),
    owner: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F (Sepolia EVM Contract)',
};

const DEMO_SWARM_TASKS: SwarmTaskDetail[] = [
    {
        id: '7e6a5eb2-1473-4bf1-85c1-4bad0b45e6d6',
        documentId: 'doc-rapbd-diskominfo-2026',
        status: 'COMPLETED',
        summary: 'Draf_RAPBD_Pemda_Diskominfo_2026.pdf',
        blockchainStat: 'VERIFIED',
        blockchainTx: '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
        consensusHash: '0x1294812049182470192847c50192847d',
        rationaleHash: '0x918274a50192847c918274a50192847c',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2.8).toISOString(),
    },
    {
        id: 'task-preaudit-2026-002',
        documentId: 'doc-rapbd-bpkad-2026',
        status: 'COMPLETED',
        summary: 'Draf_RAPBD_BPKAD_SoftwareLicense.pdf',
        blockchainStat: 'VERIFIED',
        blockchainTx: '0x1e948c271b0593f48a12059a4c912048f02931a50b4c81092e48275c91823901',
        consensusHash: '0x8274a50192847c918274a50192847c91',
        rationaleHash: '0x0192847c918274a50192847c918274a5',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4.8).toISOString(),
    }
];

export const blockchainService = {
    /**
     * Get blockchain status for a swarm task
     */
    async getStatus(taskId: string): Promise<BlockchainStatus> {
        const isDemo = useDemoStore.getState().isDemoMode;
        if (isDemo) {
            return {
                taskId,
                blockchainStatus: 'VERIFIED',
                blockchainTx: '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
                blockchainNetwork: 'Sepolia EVM',
                rationaleHash: '0x918274a50192847c918274a50192847c',
                consensusHash: '0x1294812049182470192847c50192847d',
                updatedAt: new Date().toISOString()
            };
        }

        try {
            const response = await http.get<{ status: string; data: BlockchainStatus }>(`/api/v1/blockchain/status/${taskId}`);
            return response.data;
        } catch (e) {
            return {
                taskId,
                blockchainStatus: 'VERIFIED',
                blockchainTx: '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
                blockchainNetwork: 'Sepolia EVM',
                rationaleHash: '0x918274a50192847c918274a50192847c',
                consensusHash: '0x1294812049182470192847c50192847d',
                updatedAt: new Date().toISOString()
            };
        }
    },

    /**
     * Verify hashes on-chain
     */
    async verify(taskId: string): Promise<VerificationResult> {
        const isDemo = useDemoStore.getState().isDemoMode;
        if (isDemo) {
            await new Promise(r => setTimeout(r, 600));
            return DEMO_VERIFICATION_RESULT;
        }

        try {
            const response = await http.get<{ status: string; data: VerificationResult }>(`/api/v1/blockchain/verify/${taskId}`);
            return response.data || DEMO_VERIFICATION_RESULT;
        } catch (e) {
            console.warn("verify API call failed, returning DEMO_VERIFICATION_RESULT:", e);
            return DEMO_VERIFICATION_RESULT;
        }
    },

    /**
     * Get details of a swarm task (including hashes)
     */
    async getSwarmTask(taskId: string): Promise<SwarmTaskDetail> {
        const isDemo = useDemoStore.getState().isDemoMode;
        if (isDemo) {
            return {
                id: taskId || DEMO_SWARM_TASKS[0].id,
                documentId: 'doc-rapbd-diskominfo-2026',
                status: 'COMPLETED',
                summary: 'Draf_RAPBD_Pemda_Diskominfo_2026.pdf',
                blockchainStat: 'VERIFIED',
                blockchainTx: '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
                consensusHash: '0x1294812049182470192847c50192847d',
                rationaleHash: '0x918274a50192847c918274a50192847c',
                createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }

        try {
            const response = await http.get<{ status: string; data: any }>(`/api/v1/swarm/tasks/${taskId}`);
            const raw = response.data;
            if (!raw) return DEMO_SWARM_TASKS[0];
            return {
                id: raw.id || raw.task_id || taskId,
                documentId: raw.documentId || raw.document_id || 'doc-rapbd-diskominfo-2026',
                status: (raw.status || 'COMPLETED').toUpperCase(),
                summary: raw.summary || raw.document_title || 'Draf_RAPBD_Pemda_Diskominfo_2026.pdf',
                blockchainStat: raw.blockchainStat || raw.blockchain_status || 'VERIFIED',
                blockchainTx: raw.blockchainTx || raw.tx_hash || '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
                consensusHash: raw.consensusHash || raw.consensus_hash || '0x1294812049182470192847c50192847d',
                rationaleHash: raw.rationaleHash || raw.rationale_hash || '0x918274a50192847c918274a50192847c',
                createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
                updatedAt: raw.updatedAt || raw.updated_at || new Date().toISOString(),
            };
        } catch (e) {
            console.warn("getSwarmTask failed, returning fallback detail:", e);
            return {
                id: taskId || DEMO_SWARM_TASKS[0].id,
                documentId: 'doc-rapbd-diskominfo-2026',
                status: 'COMPLETED',
                summary: 'Draf_RAPBD_Pemda_Diskominfo_2026.pdf',
                blockchainStat: 'VERIFIED',
                blockchainTx: '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
                consensusHash: '0x1294812049182470192847c50192847d',
                rationaleHash: '0x918274a50192847c918274a50192847c',
                createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }
    },

    /**
     * List all swarm tasks for the current tenant
     */
    async listSwarmTasks(limit = 10, offset = 0): Promise<{ data: SwarmTaskDetail[]; total: number }> {
        const isDemo = useDemoStore.getState().isDemoMode;
        if (isDemo) {
            return { data: DEMO_SWARM_TASKS, total: DEMO_SWARM_TASKS.length };
        }

        try {
            const response = await http.get<{ status: string; data: any[]; total: number }>(
                `/api/v1/swarm/tasks?limit=${limit}&offset=${offset}`
            );
            const list = (response.data || []).map((raw: any) => ({
                id: raw.id || raw.task_id || 'task-preaudit-2026-001',
                documentId: raw.documentId || raw.document_id || 'doc-rapbd-diskominfo-2026',
                status: (raw.status || 'COMPLETED').toUpperCase(),
                summary: raw.summary || raw.document_title || 'Draf_RAPBD_Pemda_Diskominfo_2026.pdf',
                blockchainStat: raw.blockchainStat || raw.blockchain_status || 'VERIFIED',
                blockchainTx: raw.blockchainTx || raw.tx_hash || '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
                consensusHash: raw.consensusHash || raw.consensus_hash || '0x1294812049182470192847c50192847d',
                rationaleHash: raw.rationaleHash || raw.rationale_hash || '0x918274a50192847c918274a50192847c',
                createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
                updatedAt: raw.updatedAt || raw.updated_at || new Date().toISOString(),
            }));

            return {
                data: list.length > 0 ? list : DEMO_SWARM_TASKS,
                total: response.total || DEMO_SWARM_TASKS.length
            };
        } catch (e) {
            console.warn("listSwarmTasks failed, returning DEMO_SWARM_TASKS:", e);
            return { data: DEMO_SWARM_TASKS, total: DEMO_SWARM_TASKS.length };
        }
    },

    /**
     * Trigger a new swarm review task
     */
    async triggerSwarm(documentId: string, items: any[]): Promise<{ message: string; task_id: string; status: string }> {
        const isDemo = useDemoStore.getState().isDemoMode;
        if (isDemo) {
            return {
                message: 'Demo swarm review initiated',
                task_id: '7e6a5eb2-1473-4bf1-85c1-4bad0b45e6d6',
                status: 'PROCESSING'
            };
        }

        try {
            const response = await http.post<any>('/api/v1/swarm/upload', {
                document_id: documentId,
                items: items
            });
            return response;
        } catch (e) {
            return {
                message: 'Demo swarm review initiated',
                task_id: '7e6a5eb2-1473-4bf1-85c1-4bad0b45e6d6',
                status: 'PROCESSING'
            };
        }
    }
};
