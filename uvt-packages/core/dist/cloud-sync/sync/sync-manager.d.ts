import { SyncQueue } from '../queue/sync-queue.js';
import { RemoteProvider } from '../providers/remote/remote-provider.js';
import { AuthAdapter } from '../authentication/auth-adapter.js';
export declare class SyncManager {
    private queue;
    private remote;
    private auth;
    constructor(queue: SyncQueue, remote: RemoteProvider, auth: AuthAdapter);
    processQueue(): Promise<{
        processed: number;
        failed: number;
    }>;
    getStatus(): {
        pendingUploads: number;
        pendingDownloads: number;
    };
}
//# sourceMappingURL=sync-manager.d.ts.map