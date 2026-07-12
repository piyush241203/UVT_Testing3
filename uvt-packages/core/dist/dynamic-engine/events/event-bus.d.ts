import { DynamicSignal } from '../models/signal/signal.js';
import { StabilizationResult } from '../types/index.js';
export declare class PipelineStartedEvent {
    readonly timestamp: number;
    constructor(timestamp: number);
}
export declare class PipelineFinishedEvent {
    readonly totalSignals: number;
    readonly executionTimeMs: number;
    readonly timestamp: number;
    constructor(totalSignals: number, executionTimeMs: number, timestamp: number);
}
export declare class AnalyzerStartedEvent {
    readonly analyzerName: string;
    readonly timestamp: number;
    constructor(analyzerName: string, timestamp: number);
}
export declare class AnalyzerCompletedEvent {
    readonly analyzerName: string;
    readonly signals: DynamicSignal[];
    readonly timestamp: number;
    constructor(analyzerName: string, signals: DynamicSignal[], timestamp: number);
}
export declare class AnalyzerFailedEvent {
    readonly analyzerName: string;
    readonly error: Error;
    readonly timestamp: number;
    constructor(analyzerName: string, error: Error, timestamp: number);
}
export declare class SignalGeneratedEvent {
    readonly signal: DynamicSignal;
    readonly timestamp: number;
    constructor(signal: DynamicSignal, timestamp: number);
}
export declare class SignalMergedEvent {
    readonly count: number;
    readonly timestamp: number;
    constructor(count: number, timestamp: number);
}
export declare class StabilizerStartedEvent {
    readonly stabilizerName: string;
    readonly timestamp: number;
    constructor(stabilizerName: string, timestamp: number);
}
export declare class StabilizerFinishedEvent {
    readonly stabilizerName: string;
    readonly result: StabilizationResult;
    readonly timestamp: number;
    constructor(stabilizerName: string, result: StabilizationResult, timestamp: number);
}
export declare class SnapshotStartedEvent {
    readonly url: string;
    readonly timestamp: number;
    constructor(url: string, timestamp: number);
}
export declare class SnapshotFinishedEvent {
    readonly url: string;
    readonly success: boolean;
    readonly timestamp: number;
    constructor(url: string, success: boolean, timestamp: number);
}
type EventTypeMap = {
    'PipelineStarted': PipelineStartedEvent;
    'PipelineFinished': PipelineFinishedEvent;
    'AnalyzerStarted': AnalyzerStartedEvent;
    'AnalyzerCompleted': AnalyzerCompletedEvent;
    'AnalyzerFailed': AnalyzerFailedEvent;
    'SignalGenerated': SignalGeneratedEvent;
    'SignalMerged': SignalMergedEvent;
    'StabilizerStarted': StabilizerStartedEvent;
    'StabilizerFinished': StabilizerFinishedEvent;
    'SnapshotStarted': SnapshotStartedEvent;
    'SnapshotFinished': SnapshotFinishedEvent;
};
/**
 * Event Bus system for DSE decoupling using strictly typed event models.
 */
export declare class EventBus {
    private emitter;
    constructor();
    emit<K extends keyof EventTypeMap>(event: K, payload: EventTypeMap[K]): void;
    on<K extends keyof EventTypeMap>(event: K, listener: (payload: EventTypeMap[K]) => void): void;
    off<K extends keyof EventTypeMap>(event: K, listener: (payload: EventTypeMap[K]) => void): void;
}
export {};
//# sourceMappingURL=event-bus.d.ts.map