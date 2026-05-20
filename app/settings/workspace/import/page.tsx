'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileSpreadsheet, ArrowRight, CheckCircle2, Loader2, FileIcon, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { http } from '@/lib/http';

type ImportStep = 1 | 2 | 3;
type ImportStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function ImportPage() {
    const [step, setStep] = useState<ImportStep>(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<ImportStatus>('idle');
    const [dragOver, setDragOver] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/pdf'];
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx|pdf)$/i)) {
            toast.error('Unsupported file type. Please upload CSV, XLS, XLSX, or PDF.');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 50MB.');
            return;
        }
        setSelectedFile(file);
        setStep(2);
        setStatus('idle');
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => setDragOver(false), []);

    const handleUpload = async () => {
        if (!selectedFile) return;
        setStatus('uploading');
        setStep(3);

        try {
            // Step 1: Get presigned URL
            const presignRes = await http.get<{ status: string; data: { upload_url: string; document_id: string } }>(
                `/api/v1/documents/presign?filename=${encodeURIComponent(selectedFile.name)}`
            );
            const { upload_url, document_id } = presignRes.data;

            // Step 2: Upload file (if presigned URL is available)
            if (upload_url && upload_url !== '') {
                await fetch(upload_url, {
                    method: 'PUT',
                    body: selectedFile,
                    headers: { 'Content-Type': selectedFile.type },
                });
            }

            // Step 3: Confirm upload
            await http.post('/api/v1/documents/confirm', {
                document_id,
                title: selectedFile.name,
                category: 'import',
            });

            setStatus('success');
            toast.success('File imported successfully!');
        } catch (err: any) {
            setStatus('error');
            const errorMsg = err?.response?.data?.error || err?.message || 'Import failed. Please try again.';
            setErrorMessage(errorMsg);
            toast.error(errorMsg);
        }
    };

    const resetFlow = () => {
        setSelectedFile(null);
        setStep(1);
        setStatus('idle');
        setErrorMessage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const steps = ['Upload', 'Confirm', 'Import'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Import Data</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Bring your projects, tasks, and teammates from other tools into Elysian.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Stepper */}
            <div className="flex items-center justify-between max-w-2xl mx-auto mb-8 relative">
                <div className="hidden sm:block absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
                {steps.map((label, idx) => {
                    const stepNum = (idx + 1) as ImportStep;
                    const isActive = step === stepNum;
                    const isDone = step > stepNum || (step === 3 && status === 'success');
                    return (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-300 ${
                                isDone ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' :
                                isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' :
                                'bg-white dark:bg-[#0B1120] border-2 border-slate-200 dark:border-slate-800 text-slate-400'
                            }`}>
                                {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                            </div>
                            <span className={`text-xs font-medium text-center max-w-[80px] sm:max-w-none ${
                                isActive || isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                            }`}>{label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Step 1: Upload Area */}
            {step === 1 && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 md:p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${
                        dragOver
                            ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".csv,.xls,.xlsx,.pdf"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(file);
                        }}
                    />
                    <div className="h-16 w-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-8 w-8" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Click to upload or drag and drop</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                        Supports CSV, XLS, XLSX, PDF formats up to 50MB. Make sure your data includes header rows.
                    </p>
                    <Button variant="outline" className="gap-2 w-full sm:w-auto mt-2 sm:mt-0" type="button">
                        <FileSpreadsheet className="h-4 w-4" />
                        Browse Files
                    </Button>
                </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && selectedFile && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-6 md:p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                            <FileIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {formatFileSize(selectedFile.size)} · {selectedFile.type || 'unknown type'}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={resetFlow} className="text-slate-400 hover:text-red-500">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
                        <p className="font-medium text-slate-900 dark:text-white mb-2">Ready to import</p>
                        <p>This file will be uploaded to your workspace knowledge base. You can review and manage it from the Documents section.</p>
                    </div>
                </div>
            )}

            {/* Step 3: Import Progress / Result */}
            {step === 3 && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] p-8 md:p-12 flex flex-col items-center text-center space-y-4">
                    {status === 'uploading' && (
                        <>
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Importing your data...</h4>
                            <p className="text-sm text-slate-500">This may take a moment depending on file size.</p>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Import Complete!</h4>
                            <p className="text-sm text-slate-500">Your file has been uploaded and is being processed.</p>
                            <Button onClick={resetFlow} variant="outline" className="mt-4">Import Another File</Button>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center animate-bounce">
                                <AlertCircle className="h-8 w-8" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Import Failed</h4>
                            
                            {/* Premium Error Details Card */}
                            <div className="w-full max-w-md bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-5 text-left my-2 animate-in fade-in slide-in-from-bottom-2 duration-350 space-y-3 shadow-sm">
                                <div className="flex gap-2.5">
                                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Error Description</p>
                                        <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all leading-relaxed">
                                            {errorMessage || 'Unknown system conflict or invalid request payload.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-red-100 dark:border-red-900/20 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                                    <p className="font-semibold text-slate-700 dark:text-slate-300">💡 Troubleshooting checklist:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Verify that the document format is explicitly supported (.csv, .xls, .xlsx, .pdf).</li>
                                        <li>Ensure the file is not corrupted and is strictly under the 50MB limit.</li>
                                        <li>Check if you have an active network connection or if database services are healthy.</li>
                                    </ul>
                                </div>
                            </div>

                            <Button onClick={resetFlow} variant="outline" className="mt-4 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900">Try Again</Button>
                        </>
                    )}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
                {step > 1 && step < 3 && (
                    <Button variant="outline" onClick={() => { setStep(1); setSelectedFile(null); }} className="gap-2">
                        Back
                    </Button>
                )}
                {step === 2 && (
                    <Button onClick={handleUpload} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white ml-auto">
                        Import Now <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
