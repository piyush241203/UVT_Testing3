export interface SyncTask {
    id: string;
    resourceType: 'Build' | 'Baseline' | 'Snapshot' | 'Report';
    operation: 'upload' | 'download' | 'delete';
    resourceId: string;
    retryCount: number;
    priority: number;
    status: 'pending' | 'syncing' | 'failed' | 'completed';
    createdAt: string;
}
export type ConflictPolicy = 'local-wins' | 'remote-wins' | 'newest-timestamp' | 'branch-aware';
export interface AuthContext {
    token: string | null;
    isAuthenticated: boolean;
    userId?: string;
}
//# sourceMappingURL=models.d.ts.map