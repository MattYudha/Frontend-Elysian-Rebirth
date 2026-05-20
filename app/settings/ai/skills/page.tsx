'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Plus, Trash2, Loader2, Bot, Puzzle, BarChart3 } from 'lucide-react';
import { useAgents, useCreateSkill, useDeleteSkill } from '@/queries/agent.queries';
import { toast } from 'sonner';

export default function SkillsPage() {
    const { data: agents = [], isLoading } = useAgents();
    const createSkillMutation = useCreateSkill();
    const deleteSkillMutation = useDeleteSkill();

    const [newSkillName, setNewSkillName] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState('');

    // Flatten all skills across agents
    const allSkills = agents.flatMap(agent =>
        (agent.skills || []).map((skill: any) => ({
            ...skill,
            agentName: agent.name,
            agentId: agent.id,
        }))
    );

    const handleCreateSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSkillName.trim()) {
            toast.error('Please enter a skill name.');
            return;
        }
        if (!selectedAgentId) {
            toast.error('Please select an agent to attach this skill to.');
            return;
        }
        createSkillMutation.mutate({
            agentId: selectedAgentId,
            skill: {
                name: newSkillName,
                configuration_json: '{}'
            }
        }, {
            onSuccess: () => {
                setNewSkillName('');
                toast.success('Skill created and attached to agent.');
            }
        });
    };

    const handleDeleteSkill = (agentId: string, skillId: string) => {
        if (confirm('Remove this skill?')) {
            deleteSkillMutation.mutate({ agentId, skillId });
        }
    };

    // Dynamic insights
    const totalSkills = allSkills.length;
    const totalAgents = agents.length;
    const avgSkillsPerAgent = totalAgents > 0 ? (totalSkills / totalAgents).toFixed(1) : '0';

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                Loading skills...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI Skills</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Skills are reusable capabilities attached to AI agents. Manage skills across your workspace.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Usage Insights */}
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 py-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Puzzle className="h-3.5 w-3.5" /> Total Skills
                    </div>
                    <div className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">{totalSkills}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 py-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Bot className="h-3.5 w-3.5" /> Active Agents
                    </div>
                    <div className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">{totalAgents}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-4 py-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <BarChart3 className="h-3.5 w-3.5" /> Avg per Agent
                    </div>
                    <div className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">{avgSkillsPerAgent}</div>
                </div>
            </div>

            {/* Installed Skills */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Installed skills</h4>

                {allSkills.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 p-8 text-center space-y-3">
                        <Sparkles className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
                        <p className="text-sm text-slate-500">No skills attached to any agent yet.</p>
                        <p className="text-xs text-slate-400">Create a skill below and attach it to an agent.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {allSkills.map((skill: any) => (
                            <div key={skill.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-4 sm:p-5 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{skill.name}</p>
                                        <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                            <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-1">
                                                <Bot className="h-3 w-3" /> {skill.agentName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteSkill(skill.agentId, skill.id)}
                                    disabled={deleteSkillMutation.isPending}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 self-end sm:self-auto"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create New Skill */}
            <div className="space-y-4 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Create new skill</h4>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-5">
                    {agents.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-slate-500">Create an AI agent first before adding skills.</p>
                            <Button variant="outline" className="mt-3 gap-2" onClick={() => window.location.href = '/settings/ai/agents'}>
                                <Bot className="h-4 w-4" /> Go to Agents
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleCreateSkill} className="flex flex-col sm:flex-row gap-3">
                            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                                <SelectTrigger className="w-full sm:w-[200px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                    <SelectValue placeholder="Select agent" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agents.map((agent: any) => (
                                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Skill name (e.g. Google Calendar Sync)"
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                                className="flex-1 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                            />
                            <Button
                                type="submit"
                                disabled={createSkillMutation.isPending || !newSkillName.trim() || !selectedAgentId}
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white gap-2 w-full sm:w-auto"
                            >
                                <Plus className="h-4 w-4" />
                                {createSkillMutation.isPending ? 'Adding...' : 'Add Skill'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
