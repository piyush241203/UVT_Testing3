import { SignalCategory, SignalSeverity, SignalRecommendation, ExecutionPhase, SignalConfidence } from '../../classification/enums.js';
import { Evidence } from './evidence.js';
export interface DOMNodeMetadata {
    readonly tagName: string;
    readonly attributes: Record<string, string>;
    readonly classList: string[];
    readonly xPath?: string;
    readonly rect?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export interface SignalMetadata {
    [key: string]: unknown;
}
/**
 * The immutable intelligence payload.
 * Replaces simple signal passing with a deep intelligence model.
 */
export interface DynamicSignal {
    readonly id: string;
    readonly analyzerId: string;
    readonly analyzerType: string;
    readonly framework: string;
    readonly category: SignalCategory;
    readonly subtype?: string;
    readonly confidence: SignalConfidence;
    readonly severity: SignalSeverity;
    readonly executionPhase: ExecutionPhase;
    readonly recommendationPlaceholder?: SignalRecommendation;
    readonly selector?: string;
    readonly xPath?: string;
    readonly cssPath?: string;
    readonly domNodeMetadata?: DOMNodeMetadata;
    readonly sourceFile?: string;
    readonly sourceLocation?: string;
    readonly pageRoute?: string;
    readonly viewport?: {
        width: number;
        height: number;
    };
    readonly timestamp: number;
    readonly scorePlaceholder?: number;
    readonly reasoning: string;
    readonly evidence: Evidence[];
    readonly tags: ReadonlyArray<string>;
    readonly metadata: Readonly<SignalMetadata>;
    readonly regionId?: string;
}
//# sourceMappingURL=signal.d.ts.map