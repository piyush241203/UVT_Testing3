"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMIESignalGenerator = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class AMIESignalGenerator {
    static generate(stats) {
        const signals = [];
        const ts = Date.now();
        for (const stat of Object.values(stats)) {
            if (stat.count >= 2 && stat.avgInterval > 0) {
                let tag = 'HAS_REACTIVE_TEXT';
                let reason = 'Detected reactive framework updates.';
                // Typical timer patterns: ~1000ms update rate
                if (stat.avgInterval >= 900 && stat.avgInterval <= 1100 && stat.types.has('characterData')) {
                    tag = 'HAS_DYNAMIC_TIMER';
                    reason = 'Detected 1-second interval timer/clock mutation pattern.';
                }
                // Fast polling or animation (< 100ms)
                if (stat.avgInterval < 100) {
                    tag = 'HAS_ANIMATED_LAYOUT';
                    reason = 'Detected very high-frequency layout or style shifts (Animation/Canvas).';
                }
                signals.push({
                    id: `amie-${tag.toLowerCase()}-${ts}-${Math.random().toString(36).substr(2, 5)}`,
                    analyzerId: 'amie',
                    analyzerType: 'dom',
                    framework: 'unknown',
                    category: index_js_1.SignalCategory.CUSTOM,
                    confidence: 95,
                    severity: index_js_1.SignalSeverity.HIGH,
                    executionPhase: index_js_1.ExecutionPhase.BEFORE_SNAPSHOT,
                    timestamp: ts,
                    reasoning: reason,
                    evidence: [{ type: 'dom-selector', value: stat.selector }],
                    metadata: { count: stat.count, interval: stat.avgInterval },
                    tags: [tag]
                });
            }
        }
        return signals;
    }
}
exports.AMIESignalGenerator = AMIESignalGenerator;
//# sourceMappingURL=signal-generator.js.map