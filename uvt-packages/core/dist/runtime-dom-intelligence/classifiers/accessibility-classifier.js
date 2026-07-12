"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityClassifier = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class AccessibilityClassifier {
    name = 'AccessibilityClassifier';
    classify(metadata) {
        const signals = [];
        const ts = Date.now();
        for (const node of metadata.nodes) {
            if (node.attributes['aria-live'] || node.role === 'alert' || node.role === 'log' || node.role === 'status') {
                signals.push({
                    id: `rdie-a11y-${ts}-${Math.random().toString(36).substr(2, 5)}`,
                    analyzerId: 'rdie',
                    analyzerType: 'dom',
                    framework: 'unknown',
                    category: index_js_1.SignalCategory.CUSTOM,
                    confidence: 100,
                    severity: index_js_1.SignalSeverity.HIGH,
                    executionPhase: index_js_1.ExecutionPhase.BEFORE_SNAPSHOT,
                    timestamp: ts,
                    reasoning: 'Detected ARIA live region or alert role which indicates dynamic updates.',
                    evidence: [{ type: 'dom-node', value: node.tagName }],
                    metadata: { role: node.role, ariaLive: node.attributes['aria-live'] },
                    tags: ['HAS_ARIA_LIVE']
                });
            }
        }
        return signals;
    }
}
exports.AccessibilityClassifier = AccessibilityClassifier;
//# sourceMappingURL=accessibility-classifier.js.map