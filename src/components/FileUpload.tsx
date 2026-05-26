'use client';

import { Button } from '@/components/ui/';
import { Progress } from '@/components/ui/';
import { Inbox, Trash2, CheckCircle2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateFile } from '@/utils/security';
import { toast } from 'sonner';
import { AIProcessingPipeline } from '@/components/AIProcessingPipeline';

interface UploadFile {
  uid: string;
  name: string;
  size: number;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
}

interface FileUploadProps {
  onUpload?: (file: File) => Promise<void>;
  accept?: string[] | Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
}

export function FileUpload({ onUpload, accept, maxSize, multiple = false }: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          toast.error(validation.error || 'File validation failed');
          continue;
        }

        const fileData: UploadFile = {
          uid: `${Date.now()}-${file.name}`,
          name: file.name,
          size: file.size,
          status: 'uploading',
          progress: 0,
        };

        setFiles((prev) => [...prev, fileData]);

        try {
          // Simulate upload progress
          const interval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.uid === fileData.uid && f.progress < 90
                  ? { ...f, progress: f.progress + 10 }
                  : f
              )
            );
          }, 200);

          // Call upload handler
          if (onUpload) {
            await onUpload(file);
          }

          clearInterval(interval);

          // Mark as done
          setFiles((prev) =>
            prev.map((f) =>
              f.uid === fileData.uid
                ? { ...f, status: 'done', progress: 100 }
                : f
            )
          );

          toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
          setFiles((prev) =>
            prev.map((f) =>
              f.uid === fileData.uid
                ? {
                  ...f,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
                : f
            )
          );
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple,
    accept: accept
      ? Array.isArray(accept)
        ? Object.fromEntries(accept.map((type) => [type, []]))
        : accept
      : undefined,
    maxSize,
  });

  const removeFile = (uid: string) => {
    setFiles((prev) => prev.filter((f) => f.uid !== uid));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <Inbox className="h-12 w-12 mx-auto text-primary mb-4" />
        <p className="text-sm font-medium mb-1">
          {isDragActive
            ? 'Drop files here...'
            : 'Click or drag files here to upload'}
        </p>
        <p className="text-xs text-muted-foreground">
          Supported: PDF, DOC, TXT, MD, CSV (Max 50MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.uid}
              className="flex flex-col gap-2 p-4 border rounded-lg bg-slate-900/10 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    <Inbox className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'done' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => removeFile(file.uid)}
                  >
                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>
              <AIProcessingPipeline 
                progress={file.progress}
                status={file.status === 'done' ? 'completed' : file.status}
                error={file.error}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
