import { PerformanceMetrics, SubsystemName } from './types.js';
export interface ProfilerContext {
    networkRequestsCount?: number;
    domNodesCount?: number;
    routesCount?: number;
    componentsCount?: number;
    importsCount?: number;
}
export declare class SubsystemProfiler {
    static profile<T>(name: SubsystemName, fn: () => Promise<T> | T, context?: ProfilerContext): Promise<{
        result: T;
        metrics: PerformanceMetrics;
    }>;
}
//# sourceMappingURL=profiler.d.ts.map