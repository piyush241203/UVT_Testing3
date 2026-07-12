"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormClassifier = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class FormClassifier {
    name = 'FormClassifier';
    classify(metadata) {
        const signals = [];
        const ts = Date.now();
        for (const node of metadata.nodes) {
            if (node.tagName === 'input' || node.tagName === 'select' || node.tagName === 'textarea') {
                let formType = node.tagName;
                if (node.tagName === 'input' && node.attributes['type']) {
                    formType = `input-${node.attributes['type']}`;
                }
                signals.push({
                    id: `rdie-form-${ts}-${Math.random().toString(36).substr(2, 5)}`,
                    analyzerId: 'rdie',
                    analyzerType: 'dom',
                    framework: 'unknown',
                    category: index_js_1.SignalCategory.CUSTOM,
                    confidence: 100,
                    severity: index_js_1.SignalSeverity.INFO,
                    executionPhase: index_js_1.ExecutionPhase.BEFORE_SNAPSHOT,
                    timestamp: ts,
                    reasoning: `Detected form control: ${formType}`,
                    evidence: [{ type: 'dom-node', value: node.tagName }],
                    metadata: { formType },
                    tags: ['HAS_FORM_CONTROL']
                });
            }
        }
        return signals;
    }
}
exports.FormClassifier = FormClassifier;
//# sourceMappingURL=form-classifier.js.map