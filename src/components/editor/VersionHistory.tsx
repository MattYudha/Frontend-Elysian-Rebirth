import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { History, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/';

interface Version {
    id: string;
    type: 'ai' | 'human';
    label: string;
    timestamp: Date;
}

interface VersionHistoryProps {
    versions: Version[];
}

export function VersionHistory({ versions }: VersionHistoryProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="absolute top-4 right-4 z-10">
                    <Button variant="outline" size="icon" className="shadow-md bg-background">
                        <History className="h-4 w-4" />
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Version History</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)] mt-6 pr-4">
                    <div className="space-y-6">
                        {versions.map((version) => (
                            <div key={version.id} className="relative pl-6 border-l-2 border-border pb-6 last:pb-0">
                                <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-background 
                                    ${version.type === 'ai' ? 'bg-purple-500' : 'bg-blue-500'}`}
                                />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none flex items-center gap-2">
                                        {version.type === 'ai' ? (
                                            <Bot className="h-3 w-3 text-purple-400" />
                                        ) : (
                                            <User className="h-3 w-3 text-blue-400" />
                                        )}
                                        {version.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {version.timestamp.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
