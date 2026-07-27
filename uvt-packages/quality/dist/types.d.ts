export type QualityMetricKey = 'repoHealth' | 'frameworkConfidence' | 'routingConfidence' | 'generatorAccuracy' | 'ciAccuracy' | 'artifactAccuracy' | 'providerReadiness' | 'automationCompleteness';
export interface DeductionDetail {
    metricKey: QualityMetricKey;
    metricName: string;
    pointsLost: number;
    reason: string;
    recommendation: string;
}
export interface QualityMetric {
    key: QualityMetricKey;
    name: string;
    score: number;
    weight: number;
    deductions: DeductionDetail[];
}
export interface AutomationQualityReport {
    overallScore: number;
    status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
    metrics: Record<QualityMetricKey, QualityMetric>;
    allDeductions: DeductionDetail[];
    totalDeductionsCount: number;
    timestamp: number;
}
//# sourceMappingURL=types.d.ts.map