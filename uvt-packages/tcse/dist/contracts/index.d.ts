import { TCSESignal } from '../models/signal.js';
import { TCSEDecision } from '../models/decision.js';
export interface TCSELogger {
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
}
export interface TCSEContext {
    page?: any;
    config?: Record<string, unknown>;
    logger?: TCSELogger;
    url?: string;
    metadata?: Map<string, unknown>;
    [key: string]: unknown;
}
export interface TCSEPlugin {
    name: string;
    version: string;
    enabled?: boolean;
    initialize?(context: TCSEContext): Promise<void>;
    detect?(context: TCSEContext): Promise<TCSESignal[]>;
    evaluate?(signals: TCSESignal[], context: TCSEContext): Promise<TCSEDecision[]>;
    dispose?(): Promise<void>;
}
export interface TCSEProcessResult {
    signals: TCSESignal[];
    decisions: TCSEDecision[];
    durationMs: number;
    isZeroOp: boolean;
    timestamp: number;
}
export declare class TCSEContractToken {
}
//# sourceMappingURL=index.d.ts.map