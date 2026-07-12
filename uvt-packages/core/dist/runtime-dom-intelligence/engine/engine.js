"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeDOMIntelligenceEngine = void 0;
const cache_js_1 = require("../cache/cache.js");
const browser_walker_js_1 = require("../walker/browser-walker.js");
const component_classifier_js_1 = require("../classifiers/component-classifier.js");
const media_classifier_js_1 = require("../classifiers/media-classifier.js");
const layout_classifier_js_1 = require("../classifiers/layout-classifier.js");
const accessibility_classifier_js_1 = require("../classifiers/accessibility-classifier.js");
const form_classifier_js_1 = require("../classifiers/form-classifier.js");
class RuntimeDOMIntelligenceEngine {
    cache = new cache_js_1.RDIECache();
    classifiers = [];
    constructor() {
        this.classifiers.push(new component_classifier_js_1.ComponentClassifier(), new media_classifier_js_1.MediaClassifier(), new layout_classifier_js_1.LayoutClassifier(), new accessibility_classifier_js_1.AccessibilityClassifier(), new form_classifier_js_1.FormClassifier());
    }
    async scan(page) {
        try {
            const rawJson = await page.evaluate(browser_walker_js_1.BROWSER_WALKER_SCRIPT);
            const url = page.url();
            const fingerprint = this.cache.getFingerprint(url, rawJson);
            let metadata;
            if (this.cache.has(fingerprint)) {
                metadata = this.cache.get(fingerprint);
                // In a full implementation, we might also cache the signals.
            }
            else {
                metadata = JSON.parse(rawJson);
                this.cache.set(fingerprint, metadata);
            }
            const signals = [];
            for (const classifier of this.classifiers) {
                try {
                    const classifierSignals = classifier.classify(metadata);
                    signals.push(...classifierSignals);
                }
                catch (e) {
                    // ensure failure of one classifier does not break the entire pipeline
                }
            }
            return { metadata, signals };
        }
        catch (e) {
            // In case evaluation fails (e.g., page closed)
            return {
                metadata: { url: page.url(), nodeCount: 0, shadowRootCount: 0, mediaCount: 0, nodes: [] },
                signals: []
            };
        }
    }
}
exports.RuntimeDOMIntelligenceEngine = RuntimeDOMIntelligenceEngine;
//# sourceMappingURL=engine.js.map