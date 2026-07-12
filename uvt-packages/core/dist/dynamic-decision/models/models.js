"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_DECISION_CONFIG = void 0;
exports.DEFAULT_DECISION_CONFIG = {
    enabled: true,
    policy: 'balanced',
    minimumConfidence: 70,
    weights: {
        mutation: 1.0,
        runtime: 0.9,
        network: 0.8,
        ast: 0.7,
        framework: 0.5,
        repository: 0.3
    },
    allowSingleCriticalSignal: true
};
//# sourceMappingURL=models.js.map