"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameworkIntelligenceEngine = void 0;
const cache_js_1 = require("../cache/cache.js");
const shared_1 = require("@uvt/shared");
class FrameworkIntelligenceEngine {
    registry;
    cache;
    cwd;
    constructor(cwd, registry) {
        this.cwd = cwd;
        this.registry = registry;
        this.cache = new cache_js_1.FIECache(cwd);
    }
    async analyze(frameworkName, force = false) {
        if (!force) {
            const cached = this.cache.get(this.cwd);
            if (cached) {
                return cached;
            }
        }
        const adapter = this.registry.getAdapter(frameworkName);
        if (!adapter) {
            shared_1.logger.debug(`FIE: No adapter found for framework "${frameworkName}".`);
            return { signals: [], metadata: {} };
        }
        try {
            adapter.initialize(this.cwd);
            await adapter.detect();
            const signals = await adapter.analyze();
            const metadata = adapter.getMetadata();
            const result = { signals, metadata };
            this.cache.set(this.cwd, result);
            return result;
        }
        catch (e) {
            shared_1.logger.warn(`FIE: Adapter ${adapter.name} failed: ${e.message}`);
            return { signals: [], metadata: {} };
        }
        finally {
            adapter.dispose();
        }
    }
}
exports.FrameworkIntelligenceEngine = FrameworkIntelligenceEngine;
//# sourceMappingURL=engine.js.map