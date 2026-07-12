import { Classifier, DOMMetadata } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export declare class ComponentClassifier implements Classifier {
    readonly name = "ComponentClassifier";
    classify(metadata: DOMMetadata): DynamicSignal[];
}
//# sourceMappingURL=component-classifier.d.ts.map