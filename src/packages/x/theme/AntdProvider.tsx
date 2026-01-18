'use client';

import React, { type PropsWithChildren } from 'react';
import { ConfigProvider, type ThemeConfig } from 'antd';
import { tokens } from './tokens';
import { generateCSSVars } from './brandTheme';

/**
 * Custom theme configuration for Enterprise AI Platform
 */
const customTheme: ThemeConfig = {
    token: {
        colorPrimary: tokens.colors.primary,
        colorSuccess: tokens.colors.success,
        colorWarning: tokens.colors.warning,
        colorError: tokens.colors.error,
        colorInfo: tokens.colors.info,

        fontFamily: tokens.typography.fontFamily,
        fontSize: tokens.typography.fontSize.md,

        borderRadius: tokens.borderRadius.md,

        // Spacing
        padding: tokens.spacing.md,
        margin: tokens.spacing.md,
    },
    components: {
        Button: {
            borderRadius: tokens.borderRadius.md,
            controlHeight: 40,
            paddingContentHorizontal: tokens.spacing.lg,
        },
        Input: {
            borderRadius: tokens.borderRadius.md,
            controlHeight: 40,
            paddingInline: tokens.spacing.md,
        },
        Card: {
            borderRadiusLG: tokens.borderRadius.lg,
            paddingLG: tokens.spacing.lg,
        },
        Modal: {
            borderRadiusLG: tokens.borderRadius.lg,
        },
        Drawer: {
            borderRadiusLG: tokens.borderRadius.lg,
        },
    },
};

export interface AntdProviderProps extends PropsWithChildren {
    /**
     * Optional custom theme config to override defaults
     */
    theme?: ThemeConfig;
}

/**
 * AntdProvider - Wraps the application with Ant Design ConfigProvider and custom theme
 * 
 * @example
 * ```tsx
 * import { AntdProvider } from '@enterprise-ai/x';
 * 
 * function App() {
 *   return (
 *     <AntdProvider>
 *       <YourComponents />
 *     </AntdProvider>
 *   );
 * }
 * ```
 */
export const AntdProvider: React.FC<AntdProviderProps> = ({ children, theme }) => {
    const mergedTheme = theme ? { ...customTheme, ...theme } : customTheme;

    const cssVars = React.useMemo(() => generateCSSVars(mergedTheme), [mergedTheme]);

    return (
        <ConfigProvider theme={mergedTheme}>
            <div style={cssVars as React.CSSProperties} className="contents">
                {children}
            </div>
        </ConfigProvider>
    );
};

AntdProvider.displayName = 'AntdProvider';
