import { ReadinessCondition } from './condition.js';
export declare class DOMReadyCondition implements ReadinessCondition {
    id: string;
    private page;
    priority(): number;
    initialize(page: any): Promise<void>;
    check(): Promise<boolean>;
    dispose(): void;
}
//# sourceMappingURL=dom-ready.d.ts.map