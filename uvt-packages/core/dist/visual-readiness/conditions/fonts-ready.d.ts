import { ReadinessCondition } from './condition.js';
export declare class FontsReadyCondition implements ReadinessCondition {
    id: string;
    private page;
    priority(): number;
    initialize(page: any): Promise<void>;
    check(): Promise<boolean>;
    dispose(): void;
}
//# sourceMappingURL=fonts-ready.d.ts.map