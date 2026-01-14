'use client';

import React, { useState, ReactNode } from 'react';
import { Layout } from 'antd';

const { Header, Sider, Content, Footer } = Layout;

export interface ShellLayoutProps {
    /**
     * Topbar component
     */
    topbar?: ReactNode;

    /**
     * Sidebar navigation component
     */
    sidebar?: ReactNode;

    /**
     * Main content area
     */
    children: ReactNode;

    /**
     * Bottom tab bar (for mobile)
     */
    bottomTabBar?: ReactNode;

    /**
     * Footer component
     */
    footer?: ReactNode;

    /**
     * Whether sidebar is collapsible
     */
    collapsible?: boolean;

    /**
     * Initial collapsed state
     */
    defaultCollapsed?: boolean;

    /**
     * Sidebar width when expanded
     */
    sidebarWidth?: number;

    /**
     * Whether to show sidebar (responsive)
     */
    showSidebar?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * ShellLayout - Main application layout skeleton
 * 
 * Provides unified layout structure with:
 * - Topbar (header)
 * - Sidebar navigation (collapsible)
 * - Main content area
 * - Bottom tab bar (mobile)
 * - Footer
 * 
 * Responsive design with mobile-first approach.
 * 
 * @example
 * ```tsx
 * <ShellLayout
 *   topbar={<Topbar />}
 *   sidebar={<SidebarNav />}
 *   bottomTabBar={<BottomTabBar />}
 * >
 *   <Dashboard />
 * </ShellLayout>
 * ```
 */
export const ShellLayout: React.FC<ShellLayoutProps> = ({
    topbar,
    sidebar,
    children,
    bottomTabBar,
    footer,
    collapsible = true,
    defaultCollapsed = false,
    sidebarWidth = 240,
    showSidebar = true,
    className,
}) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    return (
        <Layout className={className} style={{ minHeight: '100vh' }}>
            {/* Topbar */}
            {topbar && (
                <Header
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                        width: '100%',
                        padding: 0,
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #f0f0f0',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    {topbar}
                </Header>
            )}

            <Layout>
                {/* Sidebar */}
                {showSidebar && sidebar && (
                    <Sider
                        collapsible={collapsible}
                        collapsed={collapsed}
                        onCollapse={setCollapsed}
                        width={sidebarWidth}
                        style={{
                            backgroundColor: '#fff',
                            borderRight: '1px solid #f0f0f0',
                            overflow: 'auto',
                            height: topbar ? 'calc(100vh - 64px)' : '100vh',
                            position: 'sticky',
                            top: topbar ? 64 : 0,
                            left: 0,
                        }}
                        breakpoint="lg"
                        collapsedWidth={80}
                    >
                        {sidebar}
                    </Sider>
                )}

                {/* Main Content */}
                <Layout style={{ backgroundColor: '#f5f5f5' }}>
                    <Content
                        style={{
                            padding: 24,
                            minHeight: 280,
                            marginBottom: bottomTabBar ? 60 : 0,
                        }}
                    >
                        {children}
                    </Content>

                    {/* Footer */}
                    {footer && (
                        <Footer
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                borderTop: '1px solid #f0f0f0',
                            }}
                        >
                            {footer}
                        </Footer>
                    )}
                </Layout>
            </Layout>

            {/* Bottom Tab Bar (Mobile) */}
            {bottomTabBar && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 99,
                        backgroundColor: '#fff',
                        borderTop: '1px solid #f0f0f0',
                        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    {bottomTabBar}
                </div>
            )}
        </Layout>
    );
};

ShellLayout.displayName = 'ShellLayout';
