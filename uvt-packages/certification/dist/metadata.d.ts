export interface RealRepoMetadata {
    id: string;
    name: string;
    framework: string;
    repositoryUrl: string;
    defaultBranch: string;
    tag?: string;
    packageManager: 'npm' | 'pnpm' | 'yarn' | 'composer';
    expectedFramework: string;
    expectedBuildTool: string;
    expectedRouting: string;
    expectedRouteCount: number;
    expectedDevServer: string;
    expectedProvider: string;
    description: string;
}
export declare const REAL_REPO_CERTIFICATION_REGISTRY: RealRepoMetadata[];
//# sourceMappingURL=metadata.d.ts.map