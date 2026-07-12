export interface ReadinessConfig {
    enabled: boolean;
    profile: 'fast' | 'balanced' | 'strict' | 'ai';
    maxWait: number;
    networkIdle: number;
    mutationStable: number;
    waitFonts: boolean;
    waitImages: boolean;
    waitHydration: boolean;
    ignoreEndpoints: string[];
}
export declare const DEFAULT_READINESS_CONFIG: ReadinessConfig;
export interface VisualReadyResult {
    ready: boolean;
    reason: string;
    confidence: number;
    remainingConditions: string[];
    duration: number;
}
//# sourceMappingURL=models.d.ts.map