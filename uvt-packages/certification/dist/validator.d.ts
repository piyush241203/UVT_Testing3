import { RealRepoMetadata } from './metadata.js';
export interface ValidationItemResult {
    passed: boolean;
    name: string;
    expected: string | number;
    actual: string | number;
    score: number;
}
export interface RepoValidationReport {
    repoId: string;
    repoName: string;
    framework: string;
    passed: boolean;
    score: number;
    items: ValidationItemResult[];
    timestamp: number;
}
export declare class RepoValidator {
    validateRepository(meta: RealRepoMetadata, actualAnalysis: {
        frameworkDetected: string;
        buildToolDetected: string;
        routingDetected: string;
        routeCountDetected: number;
        configArtifactGenerated: boolean;
        workflowArtifactGenerated: boolean;
    }): RepoValidationReport;
}
//# sourceMappingURL=validator.d.ts.map