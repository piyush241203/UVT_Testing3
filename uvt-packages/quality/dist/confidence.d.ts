import { QualityMetric } from './types.js';
export declare class ConfidenceCalculator {
    calculateProviderReadiness(cwd?: string, env?: Record<string, string | undefined>): QualityMetric;
    calculateFrameworkConfidence(frameworkName?: string, rawConfidence?: number): QualityMetric;
    calculateRoutingConfidence(routeCount?: number, routingStrategy?: string): QualityMetric;
}
//# sourceMappingURL=confidence.d.ts.map