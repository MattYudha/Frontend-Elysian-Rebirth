'use client';

import React, { useState } from 'react';
import { useQueryState } from 'nuqs';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2, Sparkles, MessageSquare, Terminal, FileText, ArrowRight, HelpCircle } from 'lucide-react';
import { useAgent, useCreateSkill, useDeleteSkill, useUpdateAgent, useDeleteAgent } from '@/queries/agent.queries';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function AgentConfigSlideOver() {
    const [agentId, setAgentId] = useQueryState('agent');
    const { data: agent, isLoading } = useAgent(agentId || '');

    const updateMutation = useUpdateAgent();
    const createSkillMutation = useCreateSkill();
    const deleteSkillMutation = useDeleteSkill();
    const deleteMutation = useDeleteAgent();

    const [newSkillName, setNewSkillName] = useState('');

    const isOpen = !!agentId;

    const handleClose = () => {
        setAgentId(null);
    };

    const handleSave = () => {
        if (!agent) return;
        updateMutation.mutate({
            id: agent.id,
            data: {
                name: agent.name,
                description: agent.description,
                model_used: agent.model_used,
            }
        }, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSkillName.trim() || !agentId) return;
        createSkillMutation.mutate({
            agentId: agentId,
            skill: {
                name: newSkillName,
                configuration_json: "{}"
            }
        }, {
            onSuccess: () => {
                setNewSkillName('');
            }
        });
    };

    return (
        <SheetPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <SheetPrimitive.Portal>
                {/* Overlay: z-[150] so it covers SettingsModal (z-[100]) but is below the panel */}
                <SheetPrimitive.Overlay
                    className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                />
                {/* Panel: z-[200] so it sits above the overlay and SettingsModal */}
                <SheetPrimitive.Content
                    className={cn(
                        "fixed z-[200] inset-y-0 right-0 h-full w-full sm:w-[450px] md:w-[600px] sm:max-w-none",
                        "bg-slate-50 dark:bg-[#060D18] border-l border-slate-200/60 dark:border-slate-800/60",
                        "flex flex-col shadow-2xl p-0",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
                        "data-[state=open]:duration-300 data-[state=closed]:duration-300 ease-in-out"
                    )}
                >
                <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-[#0B1120]">
                    <div className="text-left space-y-0">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Agent Configuration
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            ID: {agentId}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex-grow flex items-center justify-center text-sm text-slate-500">
                        Loading agent settings...
                    </div>
                ) : !agent ? (
                    <div className="flex-grow flex items-center justify-center text-sm text-slate-500">
                        Agent not found.
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                        {/* Custom Agent Integration & Deployment Guide */}
                        <div className="relative overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-950/40 bg-gradient-to-br from-blue-50/50 to-indigo-50/20 dark:from-blue-950/20 dark:to-indigo-950/5 p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-350">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-xl pointer-events-none" />
                            
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-5 w-5 animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Agent Deployed Successfully! 🚀
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                        This custom agent is now an active cognitive node in your workspace swarm. Integrate it into your daily auditing and drafting operations:
                                    </p>
                                </div>
                            </div>

                            <hr className="border-blue-100/50 dark:border-blue-950/40" />

                            <div className="grid gap-3 text-xs">
                                <a 
                                    href="/swarm" 
                                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:border-blue-300 dark:hover:border-blue-900/50 hover:shadow-sm transition-all duration-200 group"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                                        <Terminal className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                                            Swarm Review Dashboard
                                            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                                        </p>
                                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                                            Add this agent to the cooperative audit debates. It will analyze draf laporan documents and verify items against Kop-Mart pricing and AD/ART rules.
                                        </p>
                                    </div>
                                </a>

                                <a 
                                    href="/chat" 
                                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:border-blue-300 dark:hover:border-blue-900/50 hover:shadow-sm transition-all duration-200 group"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                                            Interactive Swarm Chat
                                            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                                        </p>
                                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                                            Initiate a deep diagnostic conversation with this agent to discuss specific regulatory clauses, draft papers, or general ledger anomalies.
                                        </p>
                                    </div>
                                </a>

                                <a 
                                    href="/editor" 
                                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:border-blue-300 dark:hover:border-blue-900/50 hover:shadow-sm transition-all duration-200 group"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                                            Document Workspace Editor
                                            <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                                        </p>
                                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                                            Review drafts side-by-side inside the interactive document viewer with automated AI inline comments and annotations.
                                        </p>
                                    </div>
                                </a>
                            </div>

                            <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-950/40 rounded-xl p-3.5 flex items-start gap-2.5">
                                <HelpCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                                    <strong>💡 Pro-Tip:</strong> Equip your agent with more custom domain skills below to unlock specialized auditing rules, dynamic APIs, or data integrations.
                                </p>
                            </div>
                        </div>

                        {/* Agent info */}
                        <div className="p-4 bg-white dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Agent Details</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Name</label>
                                    <Input 
                                        defaultValue={agent.name} 
                                        onChange={(e) => {
                                            agent.name = e.target.value;
                                        }}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Description</label>
                                    <textarea 
                                        defaultValue={agent.description} 
                                        onChange={(e) => {
                                            agent.description = e.target.value;
                                        }}
                                        rows={3}
                                        className="w-full mt-1 border rounded-lg p-2 text-sm bg-transparent dark:border-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">LLM Model</label>
                                    <Input 
                                        defaultValue={agent.model_used} 
                                        onChange={(e) => {
                                            agent.model_used = e.target.value;
                                        }}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills Management */}
                        <div className="p-4 bg-white dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Skills & Capabilities</h4>
                            
                            {/* Skills list */}
                            <div className="space-y-2">
                                {agent.skills && agent.skills.length > 0 ? (
                                    agent.skills.map((skill) => (
                                        <div key={skill.id} className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span>{skill.name}</span>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => deleteSkillMutation.mutate({ agentId: agent.id, skillId: skill.id })}
                                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-slate-400 py-1">No custom skills attached. Add one below!</div>
                                )}
                            </div>

                            {/* Add Skill Form */}
                            <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t dark:border-slate-800">
                                <Input 
                                    placeholder="Enter skill name (e.g. Google Calendar Sync)"
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    className="flex-1 text-xs"
                                />
                                <Button type="submit" size="sm" className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs">
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-[#0B1120] flex justify-end gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            if (agent && confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
                                deleteMutation.mutate(agent.id, {
                                    onSuccess: () => handleClose()
                                });
                            }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30 mr-auto"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete Agent'}
                    </Button>
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={updateMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Save Changes
                    </Button>
                </div>
            </SheetPrimitive.Content>
            </SheetPrimitive.Portal>
        </SheetPrimitive.Root>
    );
}
