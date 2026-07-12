export declare class ASTCache {
    private cacheDir;
    private hashCache;
    constructor(cwd: string);
    getFileHash(filePath: string, content: string): string;
    hasChanged(filePath: string, currentHash: string): boolean;
    markProcessed(filePath: string, hash: string): void;
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map