import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/';
import { Input } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { Search, Zap } from 'lucide-react';

interface SearchResult {
    score: number;
    content: string;
}

interface RagSearchProps {
    query: string;
    onQueryChange: (query: string) => void;
    onSearch: () => void;
    results: SearchResult[];
    latency?: string;
}

export function RagSearch({ query, onQueryChange, onSearch, results, latency }: RagSearchProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <Card className="bg-card/50 border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-amber-400" />
                    Semantic Search Playground
                </CardTitle>
                <CardDescription>
                    Test retrieval relevance matches.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <Input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a test query..."
                        className="flex-1"
                    />
                    <Button onClick={onSearch}>Search</Button>
                </div>

                <div className="space-y-4">
                    {latency && results.length > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-400" />
                            Retrieval took {latency}
                        </div>
                    )}

                    {results.length > 0 ? (
                        <div className="space-y-2">
                            {results.map((result, i) => (
                                <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border text-sm">
                                    <div className="mb-1 text-xs text-blue-400 font-mono">
                                        Score: {(result.score * 100).toFixed(1)}%
                                    </div>
                                    <div className="line-clamp-3 text-muted-foreground">
                                        {result.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
                            Results will appear here
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
