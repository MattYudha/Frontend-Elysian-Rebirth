'use client';

import React, { useState } from 'react';
import { useQueryState } from 'nuqs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2 } from 'lucide-react';
import { useAgent, useCreateSkill, useDeleteSkill, useUpdateAgent } from '@/queries/agent.queries';
import { Input } from '@/components/ui/input';

export function AgentConfigSlideOver() {
    const [agentId, setAgentId] = useQueryState('agent');
    const { data: agent, isLoading } = useAgent(agentId || '');

    const updateMutation = useUpdateAgent();
    const createSkillMutation = useCreateSkill();
    const deleteSkillMutation = useDeleteSkill();

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
        <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <SheetContent
                side="right"
                className="w-full sm:w-[450px] md:w-[600px] p-0 flex flex-col bg-slate-50 dark:bg-[#060D18] sm:max-w-none border-l border-slate-200/60 dark:border-slate-800/60"
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-[#0B1120]">
                    <SheetHeader className="text-left space-y-0">
                        <SheetTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                            Agent Configuration
                        </SheetTitle>
                        <SheetDescription className="text-xs">
                            ID: {agentId}
                        </SheetDescription>
                    </SheetHeader>
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
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={updateMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Save Changes
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
