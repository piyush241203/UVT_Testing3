import { ReadinessCondition } from './condition.js';
export declare class ImagesReadyCondition implements ReadinessCondition {
    id: string;
    private page;
    priority(): number;
    initialize(page: any): Promise<void>;
    check(): Promise<boolean>;
    dispose(): void;
}
//# sourceMappingURL=images-ready.d.ts.map