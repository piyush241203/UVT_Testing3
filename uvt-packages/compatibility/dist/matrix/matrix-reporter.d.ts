import { CompatibilityMatrixReport } from './matrix-models.js';
export declare class CompatibilityMatrixReporter {
    private cwd;
    constructor(cwd?: string);
    printConsoleSummary(report: CompatibilityMatrixReport): void;
    generateAllReports(report: CompatibilityMatrixReport): {
        htmlPath: string;
        jsonPath: string;
        mdPath: string;
    };
    private buildMarkdownReport;
    private buildHtmlDashboard;
}
//# sourceMappingURL=matrix-reporter.d.ts.map