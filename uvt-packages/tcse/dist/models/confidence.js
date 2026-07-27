"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfidenceModel = void 0;
class DefaultConfidenceModel {
    name = 'DefaultConfidenceModel';
    version = '1.0.0';
    evaluate(signal) {
        const rawScore = signal.confidenceScore ?? 0.5;
        const score = Math.min(Math.max(rawScore, 0), 1);
        let riskLevel = 'MEDIUM';
        if (score >= 0.8) {
            riskLevel = 'HIGH';
        }
        else if (score < 0.4) {
            riskLevel = 'LOW';
        }
        const vendorMatchStrength = signal.vendor && signal.vendor !== 'Unknown' ? 0.9 : 0.3;
        const indicators = [];
        if (signal.selector) {
            indicators.push(`selector:${signal.selector}`);
        }
        if (signal.category) {
            indicators.push(`category:${signal.category}`);
        }
        if (signal.vendor) {
            indicators.push(`vendor:${signal.vendor}`);
        }
        return {
            score,
            riskLevel,
            vendorMatchStrength,
            indicators,
            rationale: `Evaluated confidence score ${score.toFixed(2)} with risk level ${riskLevel}`
        };
    }
}
exports.DefaultConfidenceModel = DefaultConfidenceModel;
//# sourceMappingURL=confidence.js.map