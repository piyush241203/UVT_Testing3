import { TCSEActionType, TCSEDecision } from '../models/decision.js';
export interface AdStabilizerConfig {
    hideThreshold: number;
    placeholderThreshold: number;
    maskThreshold: number;
    blurThreshold: number;
}
export declare const DEFAULT_AD_STABILIZER_CONFIG: AdStabilizerConfig;
/**
 * Resolves stabilization action based on confidence score and configurable thresholds.
 * 95+  -> HIDE
 * 90+  -> PLACEHOLDER
 * 70+  -> MASK
 * 50+  -> BLUR
 * <50  -> IGNORE
 */
export declare function resolveAdAction(confidenceScore: number, config?: Partial<AdStabilizerConfig>): TCSEActionType;
export declare class AdStabilizer {
    private config;
    constructor(config?: Partial<AdStabilizerConfig>);
    getConfig(): AdStabilizerConfig;
    setConfig(config: Partial<AdStabilizerConfig>): void;
    resolveAction(confidenceScore: number): TCSEActionType;
    /**
     * Applies non-shifting stabilization mode to target Playwright page element.
     */
    stabilize(page: any, decision: TCSEDecision): Promise<boolean>;
}
//# sourceMappingURL=ad-stabilizer.d.ts.map