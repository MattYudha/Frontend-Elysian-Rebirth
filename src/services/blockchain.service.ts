import { http } from '@/lib/http';

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

export const blockchainService = {
    /**
     * Get blockchain status for a swarm task
     */
    async getStatus(taskId: string): Promise<BlockchainStatus> {
        const response = await http.get<{ status: string; data: BlockchainStatus }>(`/api/v1/blockchain/status/${taskId}`);
        return response.data;
    },

    /**
     * Verify hashes on-chain
     */
    async verify(taskId: string): Promise<VerificationResult> {
        const response = await http.get<{ status: string; data: VerificationResult }>(`/api/v1/blockchain/verify/${taskId}`);
        return response.data;
    },

    /**
     * Get details of a swarm task (including hashes)
     */
    async getSwarmTask(taskId: string): Promise<SwarmTaskDetail> {
        const response = await http.get<{ status: string; data: SwarmTaskDetail }>(`/api/v1/swarm/tasks/${taskId}`);
        return response.data;
    }
};
