export * from './dashboard/index.js';
export interface SnapshotResult {
    name: string;
    url: string;
    status: 'passed' | 'failed' | 'skipped';
    screenshotPath?: string;
    diffPath?: string;
    providerUrl?: string;
    error?: string;
    duration: number;
}
export interface ReportData {
    projectName: string;
    timestamp: string;
    provider: string;
    framework: string;
    totalDuration: number;
    summary: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
    };
    results: SnapshotResult[];
}
export declare function generateJSONReport(outputDir: string, data: ReportData): string;
export declare function generateHTMLReport(outputDir: string, data: ReportData): string;
//# sourceMappingURL=index.d.ts.map