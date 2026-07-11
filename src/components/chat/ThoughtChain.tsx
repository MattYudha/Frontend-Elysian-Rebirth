import { ChevronDown, ChevronRight, BrainCircuit } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/';
import { Button } from '@/components/ui/';

export interface ThoughtChainProps {
    thoughts: string[];
}

export function ThoughtChain({ thoughts }: ThoughtChainProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!thoughts || thoughts.length === 0) return null;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-2">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 p-0 text-muted-foreground hover:text-foreground">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    {isOpen ? 'Hide reasoning' : 'Show reasoning'}
                    {isOpen ? (
                        <ChevronDown className="ml-1 h-3 w-3" />
                    ) : (
                        <ChevronRight className="ml-1 h-3 w-3" />
                    )}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 border-l-2 border-primary/20 pl-4">
                {thoughts.map((thought, index) => (
                    <div key={index} className="text-sm text-muted-foreground italic">
                        {thought}
                    </div>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}
