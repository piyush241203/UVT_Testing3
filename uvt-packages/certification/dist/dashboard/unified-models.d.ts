export type CertificationSubsystemId = 'framework' | 'repository' | 'generator' | 'tcse' | 'dse' | 'provider' | 'performance' | 'compatibility' | 'automation-score' | 'golden-regression';
export type CertificationStatus = 'PASS' | 'FAIL' | 'WARNING';
export type OverallHealth = 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
export interface SubsystemCertificationResult {
    id: CertificationSubsystemId;
    name: string;
    score: number;
    status: CertificationStatus;
    passCount: number;
    failCount: number;
    warningCount: number;
    details: string;
    metrics?: Record<string, unknown>;
}
export interface HistoricalTrendPoint {
    runId: string;
    timestamp: string;
    overallScore: number;
    passRatePercent: number;
    degradedSubsystemsCount: number;
}
export interface UnifiedRegressionReport {
    title: string;
    projectName: string;
    timestamp: string;
    overallHealth: OverallHealth;
    overallScore: number;
    totalPasses: number;
    totalFails: number;
    totalWarnings: number;
    passRatePercent: number;
    subsystems: SubsystemCertificationResult[];
    trends: HistoricalTrendPoint[];
}
export declare const UNIFIED_DASHBOARD_VERSION = "1.0.0";
export declare class UnifiedDashboardToken {
}
//# sourceMappingURL=unified-models.d.ts.map