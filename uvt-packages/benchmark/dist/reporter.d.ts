import { PerformanceCertificationReport } from './types.js';
export declare class PerformanceReporter {
    private cwd;
    constructor(cwd?: string);
    printConsoleSummary(report: PerformanceCertificationReport): void;
    generateAllReports(report: PerformanceCertificationReport): {
        htmlPath: string;
        jsonPath: string;
        mdPath: string;
    };
    private buildMarkdownReport;
    private buildHtmlDashboard;
}
//# sourceMappingURL=reporter.d.ts.map