import { TCSESignal } from './signal.js';
export type TCSERiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export interface TCSEConfidenceScore {
    score: number;
    riskLevel: TCSERiskLevel;
    vendorMatchStrength: number;
    indicators: string[];
    rationale: string;
}
export interface TCSEConfidenceModel {
    name: string;
    version: string;
    evaluate(signal: Partial<TCSESignal>): TCSEConfidenceScore;
}
export declare class DefaultConfidenceModel implements TCSEConfidenceModel {
    readonly name = "DefaultConfidenceModel";
    readonly version = "1.0.0";
    evaluate(signal: Partial<TCSESignal>): TCSEConfidenceScore;
}
//# sourceMappingURL=confidence.d.ts.map