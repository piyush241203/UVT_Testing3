import { SyncQueue } from '../queue/sync-queue.js';
import { MockRemoteProvider } from '../providers/remote/remote-provider.js';
import { MockAuthAdapter } from '../authentication/auth-adapter.js';
import { SyncManager } from '../sync/sync-manager.js';
import { ConflictResolver } from '../conflicts/conflict-resolver.js';
export declare class UCSEngine {
    queue: SyncQueue;
    remote: MockRemoteProvider;
    auth: MockAuthAdapter;
    sync: SyncManager;
    conflict: ConflictResolver;
    constructor(cwd: string);
}
//# sourceMappingURL=engine.d.ts.map