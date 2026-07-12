"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptiveMutationIntelligenceEngine = void 0;
const cache_js_1 = require("../cache/cache.js");
const browser_observer_js_1 = require("../observer/browser-observer.js");
const frequency_analyzer_js_1 = require("../mutation/frequency-analyzer.js");
const signal_generator_js_1 = require("../signals/signal-generator.js");
const stability_detector_js_1 = require("../scheduler/stability-detector.js");
class AdaptiveMutationIntelligenceEngine {
    cache = new cache_js_1.AMIECache();
    async observe(page, mode = 'balanced') {
        try {
            const config = stability_detector_js_1.StabilityDetector.getConfig(mode);
            const url = page.url();
            // Use URL as cache fingerprint for simplicity. A true fingerprint might include layout hash.
            const fingerprint = this.cache.getFingerprint(url, 'default-layout');
            if (this.cache.has(fingerprint)) {
                const cachedMetadata = this.cache.get(fingerprint);
                // In full impl, cached signals would be returned.
                const signals = signal_generator_js_1.AMIESignalGenerator.generate(cachedMetadata.statistics);
                return { metadata: cachedMetadata, signals };
            }
            // Execute browser observer script, passing in config
            const rawJson = await page.evaluate(`(${browser_observer_js_1.BROWSER_OBSERVER_SCRIPT})(${config.maxDurationMs}, ${config.stabilityWindowMs})`);
            const timeline = JSON.parse(rawJson);
            const statistics = frequency_analyzer_js_1.FrequencyAnalyzer.analyze(timeline);
            const isStable = timeline.endTime - timeline.startTime < config.maxDurationMs;
            const metadata = {
                url,
                fingerprint,
                timeline,
                statistics,
                isStable
            };
            this.cache.set(fingerprint, metadata);
            const signals = signal_generator_js_1.AMIESignalGenerator.generate(statistics);
            return { metadata, signals };
        }
        catch (e) {
            return {
                metadata: { url: page.url(), fingerprint: '', timeline: { startTime: 0, endTime: 0, totalMutations: 0, events: [] }, statistics: {}, isStable: false },
                signals: []
            };
        }
    }
}
exports.AdaptiveMutationIntelligenceEngine = AdaptiveMutationIntelligenceEngine;
//# sourceMappingURL=engine.js.map