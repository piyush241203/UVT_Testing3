import { ExecutionTrace } from '../models/models.js';
export declare class Tracer {
    private spans;
    private activeSpans;
    readonly traceId: string;
    readonly runId: string;
    readonly startTime: number;
    constructor(traceId: string, runId: string);
    startSpan(name: string, metadata?: Record<string, any>): string;
    endSpan(id: string): void;
    addEvent(name: string, metadata?: Record<string, any>): void;
    buildTrace(): ExecutionTrace;
}
//# sourceMappingURL=tracer.d.ts.map