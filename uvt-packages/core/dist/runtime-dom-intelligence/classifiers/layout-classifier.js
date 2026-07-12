"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutClassifier = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class LayoutClassifier {
    name = 'LayoutClassifier';
    classify(metadata) {
        const signals = [];
        const ts = Date.now();
        for (const node of metadata.nodes) {
            const pos = node.computedStyle.position;
            if (pos === 'fixed') {
                signals.push({
                    id: `rdie-layout-fixed-${ts}-${Math.random().toString(36).substr(2, 5)}`,
                    analyzerId: 'rdie',
                    analyzerType: 'dom',
                    framework: 'unknown',
                    category: index_js_1.SignalCategory.CUSTOM,
                    confidence: 100,
                    severity: index_js_1.SignalSeverity.INFO,
                    executionPhase: index_js_1.ExecutionPhase.BEFORE_SNAPSHOT,
                    timestamp: ts,
                    reasoning: 'Detected fixed positioned element.',
                    evidence: [{ type: 'dom-node', value: node.tagName }],
                    metadata: { position: 'fixed' },
                    tags: ['HAS_FIXED_LAYOUT']
                });
            }
            if (pos === 'sticky') {
                signals.push({
                    id: `rdie-layout-sticky-${ts}-${Math.random().toString(36).substr(2, 5)}`,
                    analyzerId: 'rdie',
                    analyzerType: 'dom',
                    framework: 'unknown',
                    category: index_js_1.SignalCategory.CUSTOM,
                    confidence: 100,
                    severity: index_js_1.SignalSeverity.INFO,
                    executionPhase: index_js_1.ExecutionPhase.BEFORE_SNAPSHOT,
                    timestamp: ts,
                    reasoning: 'Detected sticky positioned element.',
                    evidence: [{ type: 'dom-node', value: node.tagName }],
                    metadata: { position: 'sticky' },
                    tags: ['HAS_STICKY_LAYOUT']
                });
            }
        }
        return signals;
    }
}
exports.LayoutClassifier = LayoutClassifier;
//# sourceMappingURL=layout-classifier.js.map