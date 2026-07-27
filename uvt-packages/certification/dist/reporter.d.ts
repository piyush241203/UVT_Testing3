import { RepoValidationReport } from './validator.js';
export interface FrameworkCertificationScore {
    framework: string;
    repositoryCount: number;
    passedCount: number;
    averageScore: number;
    status: 'CERTIFIED' | 'FAILED';
}
export interface CertificationSuiteSummary {
    totalRepositories: number;
    passedRepositories: number;
    failedRepositories: number;
    overallScore: number;
    repositoryScore: number;
    frameworkScore: number;
    automationScore: number;
    frameworkScores: FrameworkCertificationScore[];
    reports: RepoValidationReport[];
    timestamp: number;
}
export declare class CertificationReporter {
    compileSuiteSummary(reports: RepoValidationReport[]): CertificationSuiteSummary;
}
//# sourceMappingURL=reporter.d.ts.map