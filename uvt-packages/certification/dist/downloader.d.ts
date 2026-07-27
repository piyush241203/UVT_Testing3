import { RealRepoMetadata } from './metadata.js';
import { RepoCache } from './cache.js';
export declare class RepoDownloader {
    private cache;
    constructor(cache?: RepoCache);
    prepareRepository(meta: RealRepoMetadata): Promise<string>;
    private createMockWorkspaceFallback;
}
//# sourceMappingURL=downloader.d.ts.map