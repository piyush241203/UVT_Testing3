"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualRegionEngine = void 0;
const models_js_1 = require("../models/models.js");
const region_graph_js_1 = require("../graph/region-graph.js");
const browser_region_builder_js_1 = require("../builder/browser-region-builder.js");
class VisualRegionEngine {
    config;
    constructor(config) {
        this.config = { ...models_js_1.DEFAULT_REGION_CONFIG, ...config };
    }
    async evaluate(page, signals, context) {
        if (!this.config.enabled) {
            return { graph: new region_graph_js_1.RegionGraph(), signals };
        }
        context.logger.info(`VRegE: Building Region Graph...`);
        let graphData;
        try {
            graphData = await page.evaluate(browser_region_builder_js_1.BROWSER_REGION_BUILDER_SCRIPT);
        }
        catch (e) {
            context.logger.error(`VRegE: Failed to evaluate region builder: ${e}`);
            return { graph: new region_graph_js_1.RegionGraph(), signals };
        }
        const graph = new region_graph_js_1.RegionGraph(graphData);
        // Enrich signals with region metadata
        const enrichedSignals = signals.map(s => {
            let regionId = undefined;
            if (s.selector) {
                const closestRegion = graph.findClosestRegion(s.selector);
                if (closestRegion) {
                    regionId = closestRegion.id;
                }
            }
            return Object.assign({}, s, { regionId });
        });
        context.logger.info(`VRegE: Enriched ${enrichedSignals.length} signals with spatial context.`);
        return { graph, signals: enrichedSignals };
    }
}
exports.VisualRegionEngine = VisualRegionEngine;
//# sourceMappingURL=engine.js.map