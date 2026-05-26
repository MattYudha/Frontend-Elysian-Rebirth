"use client";


import { DataTable } from "@/components/ui/data-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    FileCode,
    Link as LinkIcon,
    Trash2,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { toast } from "sonner";


// --- Types ---
// Status is compatible with RagSource status string mostly
// export type DocumentStatus = "uploading" | "indexing" | "ready" | "error";
// Removing local types in favor of RagSource

import type { RagSource } from "@/lib/sdk/schemas";

export function DocumentList({
    documents = [],
    isLoading,
    onSelectDocument
}: {
    documents?: RagSource[];
    isLoading?: boolean;
    onSelectDocument?: (doc: RagSource) => void
}) {
    const data = documents; // Use props

    const handleSelect = (doc: RagSource) => {
        if (doc.status !== "ready") {
            toast.warning(`Document "${doc.name}" is still ${doc.status}. Please wait until indexing completes.`);
            return;
        }
        onSelectDocument?.(doc);
    };

    // --- Polling Simulation ---
    // Polling removed (handled by React Query)

    // TODO: Implement delete when encryption API is ready
    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        console.log("Delete not implemented", id);
    };

    // --- Columns Definition ---
    const columns: ColumnDef<RagSource>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const type = row.original.type;
                const icon = type === "pdf" ? <FileText className="text-red-500" /> :
                    type === "docx" ? <FileText className="text-blue-500" /> :
                        type === "url" ? <LinkIcon className="text-cyan-500" /> :
                            <FileCode className="text-slate-500" />;

                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">{icon}</div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{row.original.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">{type}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status as string;
                if (status === "ready") return <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</Badge>;
                if (status === "indexing" || status === "processing" || status === "pending") {
                    return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 gap-1"><Loader2 className="w-3 h-3 animate-spin" /> {status === 'indexing' ? 'Indexing' : status === 'pending' ? 'Pending Parse' : 'Processing'}</Badge>;
                }
                if (status === "pending_qa") {
                    return <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">Pending QA</Badge>;
                }
                if (status === "draft") {
                    return <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-700">Draft</Badge>;
                }
                if (status === "uploading" || status === "queued") {
                    return <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">{status === 'uploading' ? 'Uploading' : 'Queued'}</Badge>;
                }
                return <Badge variant="destructive" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30">Failed</Badge>;
            }
        },
        {
            accessorKey: "size",
            header: "Tokens",
            cell: ({ row }) => {
                const val = row.getValue("size") as number;
                return <span className="font-mono text-xs">{(val / 1024).toFixed(1)} KB</span>;
            }
        },
        {
            accessorKey: "uploadedAt",
            header: "Last Updated",
            cell: ({ row }) => {
                const date = new Date(row.getValue("uploadedAt"));
                return <span className="text-slate-500 dark:text-slate-400 text-xs">{date.toLocaleDateString()}</span>;
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                     <div className="flex justify-end">
                         <Button
                             variant="ghost"
                             size="icon"
                             className="text-slate-400 hover:text-red-500"
                             onClick={(e: React.MouseEvent) => handleDelete(row.original.id, e)}
                         >
                             <Trash2 className="w-4 h-4" />
                         </Button>
                     </div>
                );
            }
        }
    ];

    // --- Helper for Icons & Status (Reuse Logic) ---
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="text-red-500" />;
            case 'docx': return <FileText className="text-blue-500" />;
            case 'url': return <LinkIcon className="text-cyan-550" />;
            default: return <FileCode className="text-slate-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === "ready") return <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</Badge>;
        if (status === "indexing" || status === "processing" || status === "pending") {
            return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 gap-1"><Loader2 className="w-3 h-3 animate-spin" /> {status === 'indexing' ? 'Indexing' : status === 'pending' ? 'Pending Parse' : 'Processing'}</Badge>;
        }
        if (status === "pending_qa") {
            return <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">Pending QA</Badge>;
        }
        if (status === "draft") {
            return <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-700">Draft</Badge>;
        }
        if (status === "uploading" || status === "queued") {
            return <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">{status === 'uploading' ? 'Uploading' : 'Queued'}</Badge>;
        }
        return <Badge variant="destructive" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30">Failed</Badge>;
    };

    return (
        <div className="w-full">
            {/* Desktop View: DataTable */}
            <div className="hidden md:block">
                {isLoading ? (
                    <div className="p-8 text-center text-zinc-500">Loading documents...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={data}
                        searchKey="name"
                        onRowClick={(row) => handleSelect(row.original)}
                    />
                )}
            </div>

            {/* Mobile View: Card List */}
            <div className="md:hidden space-y-4">
                {data.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => handleSelect(doc)}
                        className="bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 rounded-lg p-4 shadow-sm active:scale-[0.98] transition-transform"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">{getFileIcon(doc.type)}</div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{doc.name}</h4>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 -mr-2"
                                onClick={(e: React.MouseEvent) => handleDelete(doc.id, e)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-700/50 pt-3 mt-2">
                            {getStatusBadge(doc.status)}
                            <span className="text-xs font-mono text-slate-400">
                                {(doc.size / 1024).toFixed(1)} KB
                            </span>
                        </div>
                    </div>
                ))}

                {data.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        No documents found.
                    </div>
                )}
            </div>
        </div>
    );
}
