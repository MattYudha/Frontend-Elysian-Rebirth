/**
 * Design tokens for Enterprise AI Platform UI
 */

export const tokens = {
    colors: {
        primary: '#1677ff',
        success: '#52c41a',
        warning: '#faad14',
        error: '#ff4d4f',
        info: '#13c2c2',

        // Semantic colors for AI states
        thinking: '#722ed1',
        processing: '#1677ff',
        completed: '#52c41a',

        // Neutral colors
        textPrimary: 'rgba(0, 0, 0, 0.88)',
        textSecondary: 'rgba(0, 0, 0, 0.65)',
        textTertiary: 'rgba(0, 0, 0, 0.45)',
        textDisabled: 'rgba(0, 0, 0, 0.25)',

        bgBase: '#ffffff',
        bgContainer: '#ffffff',
        bgElevated: '#ffffff',
        bgLayout: '#f5f5f5',

        border: '#d9d9d9',
        borderSecondary: '#f0f0f0',
    },

    spacing: {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
    },

    typography: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        fontSize: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 18,
            xl: 20,
            xxl: 24,
        },
        fontWeight: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.8,
        },
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    zIndex: {
        dropdown: 1050,
        modal: 1060,
        popover: 1070,
        tooltip: 1080,
    },

    animation: {
        duration: {
            fast: 150,
            normal: 300,
            slow: 500,
        },
        easing: {
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
    },
} as const;

export type Tokens = typeof tokens;
