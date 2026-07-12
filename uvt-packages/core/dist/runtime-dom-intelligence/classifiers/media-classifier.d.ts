import { Classifier, DOMMetadata } from '../models/models.js';
import { DynamicSignal } from '../../dynamic-engine/index.js';
export declare class MediaClassifier implements Classifier {
    readonly name = "MediaClassifier";
    classify(metadata: DOMMetadata): DynamicSignal[];
    private createSignal;
}
//# sourceMappingURL=media-classifier.d.ts.map