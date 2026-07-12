import { Classifier, DOMMetadata } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export declare class AccessibilityClassifier implements Classifier {
    readonly name = "AccessibilityClassifier";
    classify(metadata: DOMMetadata): DynamicSignal[];
}
//# sourceMappingURL=accessibility-classifier.d.ts.map