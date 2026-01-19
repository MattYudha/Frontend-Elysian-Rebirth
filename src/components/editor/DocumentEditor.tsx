import { Button } from '@/components/ui/';
import { Textarea } from '@/components/ui/';
import { Card } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { Save, FileText, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorDocument } from '@/lib/sdk/schemas';

interface DocumentEditorProps {
    document: EditorDocument;
    content: string;
    onChange: (value: string) => void;
    onSave: () => void;
    pdfUrl?: string;
    isMobile?: boolean;
}

export function DocumentEditor({
    document,
    content,
    onChange,
    onSave,
    pdfUrl,
    isMobile = false
}: DocumentEditorProps) {
    return (
        <div className={cn(
            "flex flex-1 gap-4 p-4 h-full",
            isMobile ? "flex-col" : "flex-row"
        )}>
            {/* PDF/Source View */}
            {!isMobile && pdfUrl && (
                <Card className="flex-1 bg-muted/30 border-border overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-border flex justify-between items-center bg-card/50">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium">Source Document</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Maximize2 className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground">
                        {/* Placeholder for PDF Viewer */}
                        <div className="text-center p-6">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>PDF Viewer Placeholder</p>
                            <p className="text-xs text-muted-foreground mt-1">{pdfUrl}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Editor View */}
            <Card className="flex-1 border-border flex flex-col bg-card">
                <div className="p-3 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                            v{document.version}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                            {document.title}
                        </span>
                    </div>
                    <Button size="sm" onClick={onSave} className="h-8 gap-2">
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                </div>
                <div className="flex-1 relative">
                    <Textarea
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute inset-0 w-full h-full resize-none p-4 font-mono text-sm bg-transparent border-0 focus-visible:ring-0 rounded-none"
                        placeholder="Start typing..."
                    />
                </div>
            </Card>
        </div>
    );
}
