import { Page } from 'playwright';
import { DynamicContext, DynamicSignal } from '../../dynamic-engine/index.js';
import { RegionConfig } from '../models/models.js';
import { RegionGraph } from '../graph/region-graph.js';
export declare class VisualRegionEngine {
    private config;
    constructor(config?: Partial<RegionConfig>);
    evaluate(page: Page, signals: DynamicSignal[], context: DynamicContext): Promise<{
        graph: RegionGraph;
        signals: DynamicSignal[];
    }>;
}
//# sourceMappingURL=engine.d.ts.map