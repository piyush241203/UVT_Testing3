import { BetaReadinessReport } from './beta-models.js';
export declare class BetaCertifierReporter {
    private cwd;
    constructor(cwd?: string);
    printConsoleSummary(report: BetaReadinessReport): void;
    generateAllReports(report: BetaReadinessReport): {
        htmlPath: string;
        jsonPath: string;
        mdPath: string;
        officialDocPath: string;
    };
    private buildMarkdownReport;
    private buildHtmlDashboard;
}
//# sourceMappingURL=beta-reporter.d.ts.map