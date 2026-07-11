'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTenantDialogProps {
    onAdd: (name: string) => void;
}

export function CreateTenantDialog({ onAdd }: CreateTenantDialogProps) {
    const [open, setOpen] = useState(false);
    const [tenantName, setTenantName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Reset state when strictly closing
            setTimeout(() => setTenantName(''), 200);
        }
    };

    const handleCreate = async () => {
        if (!tenantName.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));

        // Call parent handler to update state
        onAdd(tenantName.trim());

        toast.success(`Tenant "${tenantName}" created successfully!`);

        setIsSubmitting(false);
        handleOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800">
                    <Plus className="h-3 w-3 text-slate-400" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl border-slate-200/60 dark:border-blue-900/30">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <DialogTitle className="text-center text-xl font-semibold">Add New Tenant</DialogTitle>
                    <DialogDescription className="text-center">
                        Create a new tenant workspace to organize pipelines and teams.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="tenantName" className="text-slate-700 dark:text-slate-300">
                            Tenant Name
                        </Label>
                        <Input
                            id="tenantName"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            placeholder="e.g. Fintech Mobile App"
                            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-blue-500"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && tenantName.trim()) {
                                    e.preventDefault();
                                    handleCreate();
                                }
                            }}
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-between w-full flex-row gap-2 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleCreate}
                        disabled={!tenantName.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Tenant"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
