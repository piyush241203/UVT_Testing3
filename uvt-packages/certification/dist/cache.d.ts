export declare class RepoCache {
    private cacheDir;
    constructor(customCacheDir?: string);
    getCacheDir(): string;
    getRepoPath(repoId: string): string;
    hasRepo(repoId: string): boolean;
    clearCache(): void;
}
//# sourceMappingURL=cache.d.ts.map