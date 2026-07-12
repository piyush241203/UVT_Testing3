export interface StabilityConfig {
    maxDurationMs: number;
    stabilityWindowMs: number;
}
export declare class StabilityDetector {
    static getConfig(mode: 'fast' | 'balanced' | 'strict'): StabilityConfig;
}
//# sourceMappingURL=stability-detector.d.ts.map