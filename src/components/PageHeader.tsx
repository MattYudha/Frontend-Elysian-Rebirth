interface PageHeaderProps {
    title: string;
    subtitle?: string;
    extra?: React.ReactNode;
}

export function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>
            {extra && <div>{extra}</div>}
        </div>
    );
}
