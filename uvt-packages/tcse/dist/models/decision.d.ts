import { TCSESignal } from './signal.js';
export type TCSEActionType = 'HIDE' | 'PLACEHOLDER' | 'BLUR' | 'MASK' | 'IGNORE' | 'REMOVE' | 'FREEZE' | 'WAIT_FOR_LOAD' | 'NO_ACTION' | 'hide' | 'placeholder' | 'blur' | 'mask' | 'ignore';
export type TCSEActionMode = TCSEActionType;
export interface TCSEDecisionOptions {
    timeoutMs?: number;
    maskColor?: string;
    cssProperty?: string;
    customScript?: string;
    [key: string]: unknown;
}
export interface TCSEDecision {
    id: string;
    signalId: string;
    action: TCSEActionType;
    targetSelector: string;
    confidenceScore: number;
    priority: number;
    rationale: string;
    options?: TCSEDecisionOptions;
    timestamp: number;
}
export declare function createTCSEDecision(signal: TCSESignal, action: TCSEActionType, rationale: string, options?: TCSEDecisionOptions, priority?: number): TCSEDecision;
//# sourceMappingURL=decision.d.ts.map