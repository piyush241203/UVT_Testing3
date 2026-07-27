"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTCSESignal = createTCSESignal;
function createTCSESignal(params) {
    const score = Math.min(Math.max(params.confidenceScore ?? params.confidence ?? 0.5, 0), 1);
    return {
        id: params.id || `tcse-sig-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: params.category,
        type: params.type || params.category,
        selector: params.selector,
        vendor: params.vendor || params.source || 'Unknown',
        source: params.source || params.vendor || 'Unknown',
        confidenceScore: score,
        confidence: score,
        reason: params.reason || `Detected ${params.category} element via ${params.vendor || 'heuristics'}`,
        suggestedAction: params.suggestedAction || (score >= 0.7 ? 'HIDE' : 'MASK'),
        boundingBox: params.boundingBox,
        attributes: params.attributes || {},
        metadata: params.metadata || {},
        timestamp: params.timestamp || Date.now()
    };
}
//# sourceMappingURL=signal.js.map