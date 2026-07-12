"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaClassifier = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class MediaClassifier {
    name = 'MediaClassifier';
    classify(metadata) {
        const signals = [];
        const ts = Date.now();
        let hasCanvas = false;
        let hasSvg = false;
        let hasVideo = false;
        for (const node of metadata.nodes) {
            if (node.tagName === 'canvas')
                hasCanvas = true;
            if (node.tagName === 'svg')
                hasSvg = true;
            if (node.tagName === 'video')
                hasVideo = true;
        }
        if (hasCanvas) {
            signals.push(this.createSignal('HAS_CANVAS', index_js_1.SignalCategory.CUSTOM, 'Canvas element detected in DOM.', ts));
        }
        if (hasSvg) {
            signals.push(this.createSignal('HAS_SVG', index_js_1.SignalCategory.CUSTOM, 'SVG element detected in DOM.', ts));
        }
        if (hasVideo) {
            signals.push(this.createSignal('HAS_VIDEO', index_js_1.SignalCategory.CUSTOM, 'Video element detected in DOM.', ts));
        }
        return signals;
    }
    createSignal(tag, category, reason, ts) {
        return {
            id: `rdie-media-${tag}-${ts}`,
            analyzerId: 'rdie',
            analyzerType: 'dom',
            framework: 'unknown',
            category,
            confidence: 100,
            severity: index_js_1.SignalSeverity.INFO,
            executionPhase: index_js_1.ExecutionPhase.BEFORE_SNAPSHOT,
            timestamp: ts,
            reasoning: reason,
            evidence: [],
            metadata: {},
            tags: [tag]
        };
    }
}
exports.MediaClassifier = MediaClassifier;
//# sourceMappingURL=media-classifier.js.map