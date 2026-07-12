import { DynamicContext } from '../../dynamic-engine/index.js';
import { ObservabilityConfig } from '../models/models.js';
import { Tracer } from '../trace/tracer.js';
export declare class VisualObservabilityEngine {
    private config;
    private exporters;
    constructor(config?: Partial<ObservabilityConfig>);
    createTracer(traceId: string): Tracer;
    exportTrace(tracer: Tracer, context: DynamicContext): Promise<void>;
}
//# sourceMappingURL=engine.d.ts.map