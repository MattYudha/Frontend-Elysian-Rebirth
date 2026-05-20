'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, Settings2, Loader2, Trash2 } from 'lucide-react';
import { useDataTypes, useCreateDataType, useDeleteDataType } from '@/queries/data_type.queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TypesPage() {
    const { data: dataTypes = [], isLoading } = useDataTypes();
    const createMutation = useCreateDataType();
    const deleteMutation = useDeleteDataType();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        createMutation.mutate({
            name,
            description
        }, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setName("");
                setDescription("");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this custom data type?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                Loading data types...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Data Types</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Customize the taxonomy of data that your workspace and AI agents recognize.
                    </p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white gap-2 hidden sm:flex">
                            <Plus className="h-4 w-4" />
                            New Type
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleCreate}>
                            <DialogHeader>
                                <DialogTitle>Create Custom Data Type</DialogTitle>
                                <DialogDescription>
                                    Add a new classification category for your workspace budget items.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Travel Expense"
                                        className="col-span-3 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief purpose description"
                                        className="col-span-3 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {createMutation.isPending ? "Creating..." : "Save Type"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] overflow-hidden">
                <div className="grid grid-cols-12 px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span className="col-span-1"></span>
                    <span className="col-span-5">Type</span>
                    <span className="col-span-4 hidden sm:block">Classification</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {dataTypes.map((type) => (
                        <div key={type.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                            <div className="col-span-1 flex items-center">
                                <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity" />
                            </div>
                            <div className="col-span-9 sm:col-span-5 flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-slate-900 dark:text-white">{type.name}</span>
                                    {type.is_system && (
                                        <span className="px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                                            System
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-500">{type.description}</span>
                            </div>
                            <div className="col-span-4 hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Settings2 className="h-4 w-4" />
                                {type.fields_count} fields
                            </div>
                            <div className="col-span-2 flex items-center justify-end">
                                {!type.is_system && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={deleteMutation.isPending}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        onClick={() => handleDelete(type.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full sm:hidden border-dashed bg-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 gap-2">
                        <Plus className="h-4 w-4" />
                        New Type
                    </Button>
                </DialogTrigger>
            </Dialog>
        </div>
    );
}
