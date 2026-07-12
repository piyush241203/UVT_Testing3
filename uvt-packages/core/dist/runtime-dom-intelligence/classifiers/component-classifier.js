"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentClassifier = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class ComponentClassifier {
    name = 'ComponentClassifier';
    classify(metadata) {
        const signals = [];
        const ts = Date.now();
        for (const node of metadata.nodes) {
            const cls = node.className.toLowerCase();
            const role = (node.role || '').toLowerCase();
            const id = node.id.toLowerCase();
            const componentTypes = [
                { key: 'modal', terms: ['modal', 'dialog', 'drawer'], tag: 'HAS_MODAL' },
                { key: 'toast', terms: ['toast', 'snackbar', 'notification'], tag: 'HAS_TOAST' },
                { key: 'avatar', terms: ['avatar', 'profile-pic'], tag: 'HAS_AVATAR' },
                { key: 'timer', terms: ['timer', 'countdown', 'clock'], tag: 'HAS_TIMER' },
                { key: 'chart', terms: ['chart', 'graph', 'recharts', 'apexcharts'], tag: 'HAS_CHART' },
                { key: 'map', terms: ['map', 'leaflet', 'mapbox', 'google-map'], tag: 'HAS_MAP' },
                { key: 'skeleton', terms: ['skeleton', 'shimmer', 'placeholder'], tag: 'HAS_SKELETON' }
            ];
            for (const comp of componentTypes) {
                if (comp.terms.some(t => cls.includes(t) || id.includes(t) || role === t)) {
                    signals.push({
                        id: `rdie-comp-${comp.key}-${ts}-${Math.random().toString(36).substr(2, 5)}`,
                        analyzerId: 'rdie',
                        analyzerType: 'dom',
                        framework: 'unknown',
                        category: index_js_1.SignalCategory.COMPONENT,
                        confidence: 90,
                        severity: index_js_1.SignalSeverity.INFO,
                        executionPhase: index_js_1.ExecutionPhase.BEFORE_SNAPSHOT,
                        timestamp: ts,
                        reasoning: `Component classified as ${comp.key} based on DOM footprint.`,
                        evidence: [{ type: 'dom-node', value: node.tagName }],
                        metadata: { componentType: comp.key },
                        tags: [comp.tag]
                    });
                }
            }
        }
        return signals;
    }
}
exports.ComponentClassifier = ComponentClassifier;
//# sourceMappingURL=component-classifier.js.map