"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationEngine = void 0;
class CorrelationEngine {
    correlate(signals) {
        const groups = new Map();
        for (const signal of signals) {
            if (!signal.evidence)
                continue;
            for (const evidence of signal.evidence) {
                if (evidence.type === 'dom-selector' && evidence.value) {
                    const target = evidence.value;
                    if (!groups.has(target)) {
                        groups.set(target, []);
                    }
                    groups.get(target).push(signal);
                }
            }
        }
        // Deduplicate signals per group based on ID
        for (const [target, groupSignals] of groups.entries()) {
            const unique = new Map();
            for (const s of groupSignals) {
                unique.set(s.id, s);
            }
            groups.set(target, Array.from(unique.values()));
        }
        return groups;
    }
}
exports.CorrelationEngine = CorrelationEngine;
//# sourceMappingURL=correlation-engine.js.map