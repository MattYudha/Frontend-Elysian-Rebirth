import React from 'react';

export interface ListRendererProps {
    children: React.ReactNode;
    ordered?: boolean;
}

/**
 * ListRenderer - Enhanced list renderer for markdown lists
 */
export const ListRenderer: React.FC<ListRendererProps> = ({ children, ordered = false }) => {
    const Tag = ordered ? 'ol' : 'ul';

    return (
        <Tag
            style={{
                margin: '12px 0',
                paddingLeft: ordered ? '24px' : '20px',
                lineHeight: 1.8,
            }}
        >
            {children}
        </Tag>
    );
};

export const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <li
            style={{
                marginBottom: 8,
            }}
        >
            {children}
        </li>
    );
};

ListRenderer.displayName = 'ListRenderer';
ListItem.displayName = 'ListItem';
