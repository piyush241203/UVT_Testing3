import { DynamicSignal } from '../models/signal/signal.js';
import { StabilizationResult } from '../types/index.js';
import { DynamicContext } from '../context/execution-context.js';
import { Page } from 'playwright';
/**
 * Base interface for intelligence gatherers.
 */
export interface Analyzer {
    readonly name: string;
    /** Initialize the analyzer with the execution context */
    initialize(context: DynamicContext): Promise<void> | void;
    /** Perform analysis and return immutable dynamic signals */
    analyze(): Promise<DynamicSignal[]> | DynamicSignal[];
    /** Clean up resources */
    dispose(): Promise<void> | void;
}
/**
 * Base interface for stabilizers that mitigate dynamic behavior based on signals.
 */
export interface Stabilizer {
    readonly name: string;
    /** Initialize the stabilizer */
    initialize(context: DynamicContext): Promise<void> | void;
    /** Check if this stabilizer can handle the provided signals */
    supports(signals: DynamicSignal[]): boolean;
    /** Apply stabilization logic (e.g., masking, freezing timers) */
    stabilize(signals: DynamicSignal[]): Promise<StabilizationResult>;
    /** Clean up resources */
    dispose(): Promise<void> | void;
}
/**
 * Base interface for Snapshot Providers to decouple DSE from visual backend.
 */
export interface SnapshotProvider {
    readonly name: string;
    initialize(context: DynamicContext): Promise<void> | void;
    capture(page: Page, options: Record<string, unknown>): Promise<void>;
    dispose(): Promise<void> | void;
}
//# sourceMappingURL=interfaces.d.ts.map