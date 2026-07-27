"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITCSEClassifier = void 0;
/**
 * AI-Assisted Classifier for Third-Party Content.
 *
 * STRICT SAFETY RULE:
 * 1. Heuristic detectors are the PRIMARY source of truth.
 * 2. The AI classifier acts ONLY as a SECONDARY scoring input (max +0.15 boost).
 * 3. The AI will NEVER be the only reason an element is hidden or altered.
 *    If heuristicConfidenceScore === 0, confidenceBoost is forced to 0.
 */
class AITCSEClassifier {
    static MAX_SECONDARY_BOOST = 0.15;
    classify(metadata, heuristicConfidenceScore) {
        // Rule 1: Heuristic evidence is required. If 0, AI boost is forced to 0.
        if (!heuristicConfidenceScore || heuristicConfidenceScore <= 0) {
            return {
                category: 'unknown',
                aiScore: 0.8,
                confidenceBoost: 0,
                isActionable: false,
                rationale: 'AI classifier rejected: Element has zero heuristic evidence. AI alone cannot hide or modify elements.'
            };
        }
        const textToTest = `${metadata.id || ''} ${metadata.className || ''} ${metadata.ariaLabel || ''} ${metadata.src || ''}`.toLowerCase();
        let rawAiScore = 0.5;
        if (/\b(ad|ads|banner|sponsor|sponsored|promo|popup|widget|notice|cookie)\b/i.test(textToTest)) {
            rawAiScore = 0.9;
        }
        else if (/\b(header|footer|sidebar|content|main|wrapper|nav)\b/i.test(textToTest)) {
            rawAiScore = 0.2;
        }
        // Rule 2: Secondary boost is strictly capped at MAX_SECONDARY_BOOST (0.15)
        const confidenceBoost = Math.min(AITCSEClassifier.MAX_SECONDARY_BOOST, Math.round(rawAiScore * AITCSEClassifier.MAX_SECONDARY_BOOST * 100) / 100);
        return {
            category: 'ad',
            aiScore: rawAiScore,
            confidenceBoost,
            isActionable: true,
            rationale: `AI secondary classification boost (+${confidenceBoost}) applied alongside primary heuristic score (${heuristicConfidenceScore}).`
        };
    }
}
exports.AITCSEClassifier = AITCSEClassifier;
//# sourceMappingURL=ai-classifier.js.map