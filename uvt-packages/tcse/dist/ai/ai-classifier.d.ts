import { TCSESignalCategory } from '../models/signal.js';
export interface AIClassificationResult {
    category: TCSESignalCategory;
    aiScore: number;
    confidenceBoost: number;
    isActionable: boolean;
    rationale: string;
}
export interface AIElementMetadata {
    tagName?: string;
    className?: string;
    id?: string;
    ariaLabel?: string;
    src?: string;
    textSnippet?: string;
}
/**
 * AI-Assisted Classifier for Third-Party Content.
 *
 * STRICT SAFETY RULE:
 * 1. Heuristic detectors are the PRIMARY source of truth.
 * 2. The AI classifier acts ONLY as a SECONDARY scoring input (max +0.15 boost).
 * 3. The AI will NEVER be the only reason an element is hidden or altered.
 *    If heuristicConfidenceScore === 0, confidenceBoost is forced to 0.
 */
export declare class AITCSEClassifier {
    static readonly MAX_SECONDARY_BOOST = 0.15;
    classify(metadata: AIElementMetadata, heuristicConfidenceScore: number): AIClassificationResult;
}
//# sourceMappingURL=ai-classifier.d.ts.map