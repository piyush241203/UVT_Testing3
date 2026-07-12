import { Stabilizer, DynamicContext, DynamicSignal, StabilizationResult } from '../index.js';
export declare class LegacyMaskingStabilizer implements Stabilizer {
    readonly name = "LegacyMaskingStabilizer";
    private context?;
    private localValues;
    constructor(localValues: string[]);
    initialize(context: DynamicContext): void;
    supports(signals: DynamicSignal[]): boolean;
    stabilize(signals: DynamicSignal[]): Promise<StabilizationResult>;
    dispose(): void;
}
//# sourceMappingURL=legacy-masking-stabilizer.d.ts.map