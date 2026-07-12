import { DynamicSignal } from '../../dynamic-engine/index.js';
export interface DOMNodeSignature {
    id: string;
    tagName: string;
    className: string;
    role: string | null;
    rect: {
        width: number;
        height: number;
        top: number;
        left: number;
    };
    attributes: Record<string, string>;
    dataset: Record<string, string>;
    isShadowRoot: boolean;
    computedStyle: Record<string, string>;
}
export interface DOMMetadata {
    url: string;
    nodeCount: number;
    shadowRootCount: number;
    mediaCount: number;
    nodes: DOMNodeSignature[];
}
export interface Classifier {
    readonly name: string;
    classify(metadata: DOMMetadata): DynamicSignal[];
}
//# sourceMappingURL=models.d.ts.map