"use client";

import React, { useState, useCallback } from "react";
import { UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";


export interface FileUploadZoneProps {
    onUpload?: (files: File[]) => void;
}

export function FileUploadZone({ onUpload }: FileUploadZoneProps) {
    const [uploadQueue, setUploadQueue] = useState<{ file: File; progress: number; status: 'uploading' | 'completed' | 'error' }[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Optimistic UI: Add files to queue immediately
        const newFiles = acceptedFiles.map(file => ({
            file,
            progress: 0,
            status: 'uploading' as const
        }));

        setUploadQueue(prev => [...prev, ...newFiles]);

        // Simulate upload progress for MVP visualization
        newFiles.forEach((item) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 10) + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);

                    // Update status to completed
                    setUploadQueue(prev => prev.map(q =>
                        q.file === item.file ? { ...q, progress: 100, status: 'completed' } : q
                    ));

                    // Trigger parent callback eventually
                    if (onUpload) onUpload([item.file]);
                } else {
                    setUploadQueue(prev => prev.map(q =>
                        q.file === item.file ? { ...q, progress } : q
                    ));
                }
            }, 300); // Fast simulation
        });
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt', '.md'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    const removeFile = (fileToRemove: File) => {
        setUploadQueue(prev => prev.filter(item => item.file !== fileToRemove));
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone Area */}
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 cursor-pointer text-center overflow-hidden group",
                    "hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
                    isDragActive
                        ? "border-blue-500 bg-blue-50/80 scale-[1.01] shadow-xl"
                        : "border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
                )}
            >
                <input {...getInputProps()} />

                {/* Glow Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative flex flex-col items-center gap-4 z-10">
                    <div className={cn(
                        "p-4 rounded-full transition-all duration-300 shadow-sm",
                        isDragActive ? "bg-blue-100 text-blue-600" : "bg-white dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                    )}>
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                            {isDragActive ? "Drop files here!" : "Click or drag files to upload"}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Supports PDF, DOCX, TXT, and MD (Max 10MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* Optimistic File List Preview */}
            {uploadQueue.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                    {uploadQueue.map((item, idx) => (
                        <div key={idx} className="relative flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in slide-in-from-top-2 overflow-hidden">

                            {/* Progress Background Fill */}
                            <div
                                className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300"
                                style={{ width: `${item.progress}%`, opacity: item.status === 'completed' ? 0 : 1 }}
                            />

                            <div className="flex items-center gap-4 z-10">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    item.status === 'completed' ? "bg-green-100 text-green-600" : "bg-blue-50 text-blue-500"
                                )}>
                                    {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{item.file.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{(item.file.size / 1024).toFixed(0)} KB</span>
                                        {item.status === 'uploading' && (
                                            <>
                                                <span>•</span>
                                                <span className="text-blue-500 font-medium">Uploading {item.progress}%</span>
                                            </>
                                        )}
                                        {item.status === 'completed' && (
                                            <>
                                                <span>•</span>
                                                <span className="text-green-500 font-medium">Ready to index</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); removeFile(item.file); }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                            >
                                <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
