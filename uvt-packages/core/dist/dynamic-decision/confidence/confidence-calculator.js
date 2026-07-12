"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceCalculator = void 0;
class ConfidenceCalculator {
    config;
    constructor(config) {
        this.config = config;
    }
    calculate(signals) {
        let totalScore = 0;
        let maxPossibleScore = 0;
        for (const signal of signals) {
            // Very naive weighting based on signal.source.
            // E.g., signal.analyzerType might be 'mutation-intelligence' or 'network-intelligence'
            let weight = 0.1;
            const source = signal.analyzerType.toLowerCase();
            if (source.includes('mutation'))
                weight = this.config.weights.mutation || 1.0;
            else if (source.includes('runtime') || source.includes('dom'))
                weight = this.config.weights.runtime || 0.9;
            else if (source.includes('network'))
                weight = this.config.weights.network || 0.8;
            else if (source.includes('ast'))
                weight = this.config.weights.ast || 0.7;
            else if (source.includes('framework'))
                weight = this.config.weights.framework || 0.5;
            else if (source.includes('repository'))
                weight = this.config.weights.repository || 0.3;
            totalScore += weight * 100;
            maxPossibleScore += 100; // Simplified
        }
        if (maxPossibleScore === 0)
            return 0;
        // For demonstration, confidence scales with weight accumulation but caps at 100
        // A single mutation signal (1.0) would yield 100 confidence.
        // Two AST signals (0.7 + 0.7 = 1.4) -> 100 confidence (capped).
        const confidence = Math.min(100, Math.round((totalScore / 100) * 100));
        return confidence;
    }
}
exports.ConfidenceCalculator = ConfidenceCalculator;
//# sourceMappingURL=confidence-calculator.js.map