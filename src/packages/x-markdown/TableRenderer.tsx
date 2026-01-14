import React from 'react';

export interface TableRendererProps {
    children: React.ReactNode;
}

/**
 * TableRenderer - Enhanced table renderer for markdown tables
 */
export const TableRenderer: React.FC<TableRendererProps> = ({ children }) => {
    return (
        <div style={{ overflowX: 'auto', margin: '16px 0' }}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                }}
            >
                {children}
            </table>
        </div>
    );
};

export const TableHead: React.FC<TableRendererProps> = ({ children }) => {
    return (
        <thead
            style={{
                backgroundColor: '#fafafa',
                borderBottom: '2px solid #e8e8e8',
            }}
        >
            {children}
        </thead>
    );
};

export const TableBody: React.FC<TableRendererProps> = ({ children }) => {
    return <tbody>{children}</tbody>;
};

export const TableRow: React.FC<TableRendererProps> = ({ children }) => {
    return (
        <tr
            style={{
                borderBottom: '1px solid #f0f0f0',
            }}
        >
            {children}
        </tr>
    );
};

export const TableCell: React.FC<TableRendererProps & { isHeader?: boolean }> = ({ children, isHeader }) => {
    const Tag = isHeader ? 'th' : 'td';
    return (
        <Tag
            style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: isHeader ? 600 : 400,
            }}
        >
            {children}
        </Tag>
    );
};

TableRenderer.displayName = 'TableRenderer';
TableHead.displayName = 'TableHead';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableCell.displayName = 'TableCell';
