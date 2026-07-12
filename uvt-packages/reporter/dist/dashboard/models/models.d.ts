export interface DashboardPayload {
    buildId?: string;
    baselineId?: string;
    repository: string;
    framework: string;
    branch: string;
    commit: string;
    snapshotCount: number;
    executionTimeMs: number;
    qualityReport: any;
    traceData: any;
    syncStatus?: {
        pendingUploads: number;
        pendingDownloads: number;
        isAuthenticated: boolean;
    };
    compatibilityScore?: number;
    pipelineInfo?: any;
}
//# sourceMappingURL=models.d.ts.map