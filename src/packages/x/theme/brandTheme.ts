import { ThemeConfig } from 'antd';
import { tokens } from './tokens';

export interface BrandColors {
    primary?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
}

export interface BrandThemeOptions {
    colors?: BrandColors;
    darkMode?: boolean;
    companyName?: string;
    borderRadius?: number;
}

/**
 * createBrandTheme - Create a customized theme with brand colors
 * 
 * Allows runtime theme customization for enterprise customers.
 * 
 * @example
 * ```tsx
 * const customTheme = createBrandTheme({
 *   colors: {
 *     primary: '#7C3AED', // Purple brand
 *     success: '#10B981',
 *   },
 *   darkMode: true,
 *   borderRadius: 12,
 * });
 * 
 * <AntdProvider themeOverrides={customTheme}>
 *   <App />
 * </AntdProvider>
 * ```
 */
export const createBrandTheme = (options: BrandThemeOptions = {}): ThemeConfig => {
    const {
        colors = {},
        darkMode = false,
        borderRadius = tokens.borderRadius.md,
    } = options;

    return {
        token: {
            colorPrimary: colors.primary || tokens.colors.primary,
            colorSuccess: colors.success || tokens.colors.success,
            colorWarning: colors.warning || tokens.colors.warning,
            colorError: colors.error || tokens.colors.error,
            colorInfo: colors.info || tokens.colors.info,
            borderRadius,

            // Dark mode overrides
            ...(darkMode && {
                colorBgBase: '#141414',
                colorTextBase: '#ffffff',
                colorBgContainer: '#1f1f1f',
                colorBorder: '#303030',
                colorBorderSecondary: '#424242',
            }),
        },
        algorithm: darkMode ? [] : undefined, // Use dark algorithm if needed
    };
};

/**
 * Predefined brand  themes for quick setup
 */
export const brandThemes = {
    /**
     * Default enterprise theme (blue)
     */
    default: createBrandTheme(),

    /**
     * Purple/violet brand theme
     */
    purple: createBrandTheme({
        colors: {
            primary: '#7C3AED',
            success: '#10B981',
            info: '#8B5CF6',
        },
    }),

    /**
     * Green/eco brand theme
     */
    green: createBrandTheme({
        colors: {
            primary: '#059669',
            success: '#10B981',
            info: '#14B8A6',
        },
    }),

    /**
     * Orange/energetic brand theme
     */
    orange: createBrandTheme({
        colors: {
            primary: '#EA580C',
            success: '#22C55E',
            warning: '#F59E0B',
        },
    }),

    /**
     * Dark mode default theme
     */
    dark: createBrandTheme({
        darkMode: true,
    }),
};

/**
 * CSS custom properties for runtime theme switching
 */
export const generateCSSVars = (theme: ThemeConfig): Record<string, string> => {
    const vars: Record<string, string> = {};

    if (theme.token) {
        if (theme.token.colorPrimary) vars['--color-primary'] = theme.token.colorPrimary;
        if (theme.token.colorSuccess) vars['--color-success'] = theme.token.colorSuccess;
        if (theme.token.colorWarning) vars['--color-warning'] = theme.token.colorWarning;
        if (theme.token.colorError) vars['--color-error'] = theme.token.colorError;
        if (theme.token.colorInfo) vars['--color-info'] = theme.token.colorInfo;
        if (theme.token.borderRadius) vars['--border-radius'] = `${theme.token.borderRadius}px`;
    }

    return vars;
};
