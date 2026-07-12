export interface FrameworkMetadata {
    frameworkName?: string;
    version?: string;
    bundler?: string;
    router?: string;
    ssrEnabled?: boolean;
    csrEnabled?: boolean;
    packageManager?: 'npm' | 'yarn' | 'pnpm' | 'bun' | string;
    workspaceType?: 'single' | 'monorepo' | string;
    isMonorepoRoot?: boolean;
    renderingStrategy?: string;
    ssr?: boolean;
    csr?: boolean;
    hydration?: boolean;
    routing?: string;
    dataFetching?: string;
    stateManagement?: string;
    animation?: string;
    forms?: string;
    transitions?: string;
    reactivity?: string;
    compiler?: string;
    runtime?: string;
    framework?: string;
}
//# sourceMappingURL=framework.d.ts.map