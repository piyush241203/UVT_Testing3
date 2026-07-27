export type BetaSuiteId = 'framework' | 'repository' | 'automation-quality' | 'artifact-validation' | 'performance' | 'compatibility' | 'unified-regression' | 'stress' | 'failure-injection';
export type BetaApprovalDecision = 'APPROVED_FOR_PUBLIC_BETA' | 'REJECTED';
export interface BetaSuiteResult {
    id: BetaSuiteId;
    name: string;
    score: number;
    passed: boolean;
    telemetry: string;
    notes: string[];
}
export interface RiskItem {
    category: 'SECURITY' | 'PERFORMANCE' | 'CI_FLAKINESS' | 'COMPATIBILITY';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    mitigation: string;
}
export interface LimitationItem {
    subsystem: string;
    description: string;
    workaround: string;
}
export interface BetaReadinessReport {
    title: string;
    projectName: string;
    timestamp: string;
    decision: BetaApprovalDecision;
    readinessScore: number;
    totalSuitesVerified: number;
    passedSuitesCount: number;
    failedSuitesCount: number;
    suites: BetaSuiteResult[];
    risks: RiskItem[];
    limitations: LimitationItem[];
    recommendations: string[];
}
export declare const BETA_CERTIFICATION_VERSION = "1.0.0-beta.1";
export declare class BetaFrameworkToken {
}
//# sourceMappingURL=beta-models.d.ts.map