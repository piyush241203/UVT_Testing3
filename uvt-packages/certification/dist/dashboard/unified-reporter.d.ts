import { UnifiedRegressionReport } from './unified-models.js';
export declare class UnifiedRegressionReporter {
    private cwd;
    constructor(cwd?: string);
    printConsoleSummary(report: UnifiedRegressionReport): void;
    generateAllReports(report: UnifiedRegressionReport): {
        htmlPath: string;
        jsonPath: string;
        mdPath: string;
        csvPath: string;
    };
    private buildCsvReport;
    private buildMarkdownReport;
    private buildHtmlDashboard;
}
//# sourceMappingURL=unified-reporter.d.ts.map