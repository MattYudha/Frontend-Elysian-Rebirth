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
                        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{row.original.name}</span>
                            <span className="text-xs text-slate-500 uppercase">{type}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                if (status === "ready") return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</Badge>;
                if (status === "indexing") return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Indexing</Badge>;
                if (status === "uploading") return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Uploading</Badge>;
                return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">Failed</Badge>;
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
                return <span className="text-slate-500 text-xs">{date.toLocaleDateString()}</span>;
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
            case 'url': return <LinkIcon className="text-cyan-500" />;
            default: return <FileCode className="text-slate-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === "ready") return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</Badge>;
        if (status === "indexing" || status === "processing") return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><Loader2 className="w-3 h-3 animate-spin" /> {status === 'indexing' ? 'Indexing' : 'Processing'}</Badge>;
        if (status === "queued") return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Queued</Badge>;
        return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">Failed</Badge>;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Desktop View: DataTable */}
            <div className="hidden md:block">
                {isLoading ? (
                    <div className="p-8 text-center text-zinc-500">Loading documents...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={data}
                        searchKey="name"
                        onRowClick={(row) => onSelectDocument?.(row.original)}
                    />
                )}
            </div>

            {/* Mobile View: Card List */}
            <div className="md:hidden p-4 space-y-4">
                {data.map((doc) => (
                    <div
                        key={doc.id}
                        onClick={() => onSelectDocument?.(doc)}
                        className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm active:scale-[0.98] transition-transform"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg">{getFileIcon(doc.type)}</div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 line-clamp-1">{doc.name}</h4>
                                    <span className="text-xs text-slate-500 uppercase">{doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}</span>
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

                        <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-2">
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
