import { RepoContext, FrameworkPlugin } from '@uvt/shared';
export declare function createRepoContext(cwd: string): Promise<RepoContext>;
export declare function resolveFramework(repo: RepoContext, plugins: FrameworkPlugin[]): FrameworkPlugin;
export declare function resolveFrameworkAsync(repo: RepoContext, plugins: FrameworkPlugin[]): Promise<{
    plugin: FrameworkPlugin;
    confidence: number;
    evidence: string[];
}>;
//# sourceMappingURL=repository-analyzer.d.ts.map