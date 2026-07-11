import React from 'react';
import type { Attachment } from '../../types/x';
import { Button } from '@/components/ui/';
import { FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/';
import { cn } from '@/lib/utils';

export interface AttachmentsProps {
    files: Attachment[];
    onRemove?: (fileId: string) => void;
    readonly?: boolean;
    className?: string;
}

export const Attachments: React.FC<AttachmentsProps> = ({
    files,
    onRemove,
    readonly = false,
    className,
}) => {
    if (files.length === 0) {
        return null;
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className={cn("space-y-2 mb-4", className)}>
            {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium truncate max-w-[200px]" title={file.name}>
                                    {file.name}
                                </span>
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground">
                                    {file.type}
                                </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                            </span>
                        </div>
                    </div>

                    {!readonly && onRemove && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onRemove(file.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
};

Attachments.displayName = 'Attachments';
