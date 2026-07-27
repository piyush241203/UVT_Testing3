import { FailureRecoveryReport } from './fault-models.js';
export declare class FailureRecoveryReporter {
    private cwd;
    constructor(cwd?: string);
    printConsoleSummary(report: FailureRecoveryReport): void;
    generateAllReports(report: FailureRecoveryReport): {
        htmlPath: string;
        jsonPath: string;
        mdPath: string;
    };
    private buildMarkdownReport;
    private buildHtmlDashboard;
}
//# sourceMappingURL=recovery-reporter.d.ts.map