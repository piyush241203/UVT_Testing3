import { Page } from 'playwright';
import { NetworkAnalyzer } from './network-analyzer.js';
export interface DynamicRegion {
    selector?: string;
    source: 'ast' | 'network' | 'dom';
    confidence: number;
    maskingStrategy: 'blur' | 'opaque' | 'hide';
}
/**
 * Backward compatibility wrapper.
 * Defers all execution to the Dynamic Stabilization Engine (DSE) plugins.
 */
export declare class DynamicDetector {
    private networkAnalyzer;
    private cachedRegions;
    constructor(networkAnalyzer: NetworkAnalyzer);
    run(page: Page): Promise<DynamicRegion[]>;
    getLocalDynamicValues(cwd: string): string[];
    applyMasking(page: Page, regions: DynamicRegion[], dynamicValues?: string[]): Promise<void>;
}
//# sourceMappingURL=dynamic-detector.d.ts.map