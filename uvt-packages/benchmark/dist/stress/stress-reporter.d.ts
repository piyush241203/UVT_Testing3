import { StressCertificationReport } from './stress-models.js';
export declare class StressTestReporter {
    private cwd;
    constructor(cwd?: string);
    printConsoleSummary(report: StressCertificationReport): void;
    generateAllReports(report: StressCertificationReport): {
        htmlPath: string;
        jsonPath: string;
        mdPath: string;
    };
    private buildMarkdownReport;
    private buildHtmlDashboard;
}
//# sourceMappingURL=stress-reporter.d.ts.map