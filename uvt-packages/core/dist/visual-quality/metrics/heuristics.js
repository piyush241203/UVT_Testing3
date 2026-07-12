"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeuristicsEngine = void 0;
class HeuristicsEngine {
    evaluate(vseMetadata) {
        const heuristics = [];
        if (vseMetadata?.actionsApplied > 50) {
            heuristics.push({
                id: 'HighVolumeMutations',
                type: 'OverStabilization',
                description: 'Large number of stabilizations executed. Potential for hiding real visual content.',
                severity: 'Medium'
            });
        }
        if (vseMetadata?.verification?.failed > 0) {
            heuristics.push({
                id: 'VerificationFailure',
                type: 'UnderStabilization',
                description: 'Some regions failed verification after stabilization.',
                severity: 'High'
            });
        }
        return heuristics;
    }
}
exports.HeuristicsEngine = HeuristicsEngine;
//# sourceMappingURL=heuristics.js.map