import { AutomationQualityReport } from './types.js';
export declare class QualityReporter {
    renderConsole(report: AutomationQualityReport): string;
    renderMarkdown(report: AutomationQualityReport): string;
    renderHTML(report: AutomationQualityReport): string;
    saveReportFiles(report: AutomationQualityReport, outputDir?: string): {
        htmlPath: string;
        mdPath: string;
        jsonPath: string;
    };
}
//# sourceMappingURL=reporter.d.ts.map