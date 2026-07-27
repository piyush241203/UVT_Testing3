import { CertificationSuiteSummary } from './reporter.js';
export declare class CertificationDashboard {
    private matrix;
    constructor();
    renderMarkdown(summary: CertificationSuiteSummary): string;
    renderHTML(summary: CertificationSuiteSummary): string;
    saveDashboardFiles(summary: CertificationSuiteSummary, outputDir?: string): {
        htmlPath: string;
        mdPath: string;
        jsonPath: string;
    };
}
//# sourceMappingURL=dashboard.d.ts.map