import { ArtifactValidationReport } from './types.js';
export declare class ArtifactValidationReporter {
    renderConsole(report: ArtifactValidationReport): string;
    renderMarkdown(report: ArtifactValidationReport): string;
    renderHTML(report: ArtifactValidationReport): string;
    saveReportFiles(report: ArtifactValidationReport, outputDir?: string): {
        htmlPath: string;
        mdPath: string;
        jsonPath: string;
    };
}
//# sourceMappingURL=reporter.d.ts.map