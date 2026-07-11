"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { RagSource } from "@/lib/sdk/schemas";

interface SourceDrawerProps {
    document: RagSource | null;
    open: boolean;
    onClose: () => void;
}

export function SourceDrawer({ document, open, onClose }: SourceDrawerProps) {
    if (!document) return null;

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>{document.name}</SheetTitle>
                    <SheetDescription>
                        Document Details
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <p><strong>Type:</strong> {document.type}</p>
                    <p><strong>Status:</strong> {document.status}</p>
                    <p><strong>Size:</strong> {(document.size / 1024).toFixed(2)} KB</p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
