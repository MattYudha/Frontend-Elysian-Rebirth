import { http } from '@/lib/http';

export interface Skill {
    id: string;
    agent_id: string;
    name: string;
    configuration_json: Record<string, any> | string;
}

export interface Agent {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    model_used: string;
    status: 'active' | 'inactive';
    skills?: Skill[];
}

export async function fetchAgents(): Promise<Agent[]> {
    const res = await http.get<{ status: string; data: Agent[] }>('/api/v1/agents');
    return res.data || [];
}

export async function fetchAgentById(id: string): Promise<Agent> {
    const res = await http.get<{ status: string; data: Agent }>(`/api/v1/agents/${id}`);
    return res.data;
}

export async function createAgent(data: Partial<Agent>): Promise<Agent> {
    const res = await http.post<{ status: string; data: Agent }>('/api/v1/agents', data);
    return res.data;
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
    const res = await http.put<{ status: string; data: Agent }>(`/api/v1/agents/${id}`, data);
    return res.data;
}

export async function deleteAgent(id: string): Promise<void> {
    await http.delete(`/api/v1/agents/${id}`);
}

export async function createSkill(agentId: string, skill: Partial<Skill>): Promise<Skill> {
    const res = await http.post<{ status: string; data: Skill }>(`/api/v1/agents/${agentId}/skills`, skill);
    return res.data;
}

export async function deleteSkill(agentId: string, skillId: string): Promise<void> {
    await http.delete(`/api/v1/agents/${agentId}/skills/${skillId}`);
}
