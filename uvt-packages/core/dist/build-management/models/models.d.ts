export interface Build {
    buildId: string;
    repositoryId: string;
    branch: string;
    commit: string;
    author: string;
    timestamp: string;
    framework: string;
    status: 'running' | 'completed' | 'failed';
    snapshotCount: number;
    duration: number;
    qualityScore: number;
    traceId?: string;
}
export interface Snapshot {
    snapshotId: string;
    buildId: string;
    regionId: string;
    route: string;
    viewport: string;
    browser: string;
    framework: string;
    qualityScore: number;
    stabilizationMetadata: any;
    traceReference?: string;
    baselineReference?: string;
}
export type ApprovalState = 'Pending' | 'Approved' | 'Rejected' | 'Promoted';
export interface Baseline {
    baselineId: string;
    branch: string;
    commit: string;
    snapshotId: string;
    status: ApprovalState;
    createdAt: string;
}
//# sourceMappingURL=models.d.ts.map