"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTCSEDecision = createTCSEDecision;
function createTCSEDecision(signal, action, rationale, options, priority = 10) {
    return {
        id: `tcse-dec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        signalId: signal.id,
        action,
        targetSelector: signal.selector,
        confidenceScore: signal.confidenceScore,
        priority,
        rationale,
        options: options || {},
        timestamp: Date.now()
    };
}
//# sourceMappingURL=decision.js.map