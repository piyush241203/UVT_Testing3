import { Classifier, DOMMetadata } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export declare class LayoutClassifier implements Classifier {
    readonly name = "LayoutClassifier";
    classify(metadata: DOMMetadata): DynamicSignal[];
}
//# sourceMappingURL=layout-classifier.d.ts.map