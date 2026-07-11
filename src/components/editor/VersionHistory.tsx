import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, RotateCcw, Clock } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export function VersionHistory() {
    const { snapshots, restoreSnapshot } = useEditorStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleRestore = (id: string) => {
        restoreSnapshot(id);
        setIsOpen(false);
        toast.success("Version Restored", {
            description: "Your editor content has been reverted to this snapshot."
        });
        // We might need to force editor re-render or content update here
        // But since we bound content to store, it *should* update if DocumentEditor handles prop changes or we force it.
        // For Tiptap, we usually need to imperatively set content.
        // We'll handle that in DocumentEditor's useEffect.
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Version History</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Version History
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-4">
                    {snapshots.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p>No snapshots yet.</p>
                            <p className="text-xs">Click &quot;Save&quot; to create a version.</p>
                        </div>
                    ) : (
                        snapshots.map((snap) => (
                            <div key={snap.id} className="flex flex-col gap-2 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-all">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm">{snap.name}</span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        v{snap.version}
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDistanceToNow(snap.timestamp, { addSuffix: true })}
                                </div>
                                <div className="mt-2 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs gap-1"
                                        onClick={() => handleRestore(snap.id)}
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                        Restore
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
