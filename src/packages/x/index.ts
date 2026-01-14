'use client';

/**
 * @enterprise-ai/x - Enterprise AI Platform UI Component Library
 * 
 * A comprehensive React component library for building enterprise AI applications
 * with support for chat interfaces, RAG knowledge bases, workflow builders,
 * human-in-the-loop editing, and more.
 * 
 * @packageDocumentation
 */

// Theme
export { AntdProvider, type AntdProviderProps } from './theme/AntdProvider';
export { tokens } from './theme/tokens';
export { createBrandTheme, brandThemes, generateCSSVars, type BrandColors, type BrandThemeOptions } from './theme/brandTheme';

// Chat Components
export { ChatShell, type ChatShellProps } from './chat/ChatShell';
export { Bubble, type BubbleProps } from './chat/Bubble';
export { Sender, type SenderProps } from './chat/Sender';
export { Attachments, type AttachmentsProps } from './chat/Attachments';
export { PromptSuggestions, type PromptSuggestionsProps } from './chat/PromptSuggestions';
export { ThoughtChain, type ThoughtChainProps } from './chat/ThoughtChain';
export { ThinkIndicator, type ThinkIndicatorProps } from './chat/ThinkIndicator';

// Dashboard Components
export { DashboardShell, type DashboardShellProps } from './dashboard/DashboardShell';
export { QuickStats, type QuickStatsProps, type StatData } from './dashboard/QuickStats';
export { KnowledgeHealthCard, type KnowledgeHealthCardProps, type KnowledgeHealthData } from './dashboard/KnowledgeHealthCard';
export { ActivePipelinesList, type ActivePipelinesListProps } from './dashboard/ActivePipelinesList';

// Loading Components
export { SplashScreen, type SplashScreenProps } from './loading/SplashScreen';
export { SaaSLoadingOverlay, type SaaSLoadingOverlayProps } from './loading/SaaSLoadingOverlay';

// RAG Components
export { RagConfigPanel, type RagConfigPanelProps, type RagConfigData } from './rag/RagConfigPanel';
export { RagKnowledgeSourcesList, type RagKnowledgeSourcesListProps, type KnowledgeSource } from './rag/RagKnowledgeSourcesList';
export { RagSearchPlayground, type RagSearchPlaygroundProps, type RetrievedChunk, type QAPair } from './rag/RagSearchPlayground';
export { RagQueryPlaygroundDrawer, type RagQueryPlaygroundDrawerProps, type RagQueryResponse } from './rag/RagQueryPlaygroundDrawer';

// Human-in-the-Loop Editor Components
export { HilSplitEditor, type HilEditorProps, type ViewMode } from './hil/HilSplitEditor';
export { HilMobileEditor, type HilMobileEditorProps } from './hil/HilMobileEditor';
export { AiActionBar, type AiActionBarProps } from './hil/AiActionBar';
export { VersionHistoryList, type VersionHistoryListProps, type VersionEntry } from './hil/VersionHistoryList';

// Layout & Navigation Components
export { ShellLayout, type ShellLayoutProps } from './layout/ShellLayout';
export { SidebarNav, type SidebarNavProps, type NavItem } from './layout/SidebarNav';
export { Topbar, type TopbarProps } from './layout/Topbar';
export { BottomTabBar, type BottomTabBarProps, type TabItem } from './layout/BottomTabBar';

// Providers
export { TelemetryProvider, useTelemetry, type TelemetryEvent, type TelemetryHandler } from './providers/TelemetryProvider';
export { I18nProvider, useI18n, type Locale, type Direction, type I18nContextValue } from './providers/I18nProvider';
export { PermissionsProvider, usePermissions, Allowed, type Permission, type Role, type AllowedProps } from './providers/PermissionsProvider';
export { FeatureFlagsProvider, useFeatureFlag, Feature, type FeatureFlags, type FeatureProps } from './providers/FeatureFlagsProvider';

// Performance Utilities
export { useDebounce, useThrottle, useMemoized, usePrevious, useStableCallback } from './utils/performance';

// Common/Utility Components
export { XErrorBoundary, type XErrorBoundaryProps } from './common/XErrorBoundary';
export { XErrorState, type XErrorStateProps } from './common/XErrorState';
export { XEmptyState, type XEmptyStateProps } from './common/XEmptyState';

// Re-export useful types
export type {
    ChatMessage,
    MessageRole,
    ThoughtStep,
    Attachment,
    PipelineItem,
    PipelineStatus,
    StreamChunk,
} from './types';
