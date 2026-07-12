import { FrameworkAdapter, FrameworkMetadata } from '../../models/models.js';
import { DynamicSignal } from '../../../dynamic-engine/index.js';
export declare class NextAdapter implements FrameworkAdapter {
    readonly name = "NextAdapter";
    private cwd;
    private metadata;
    private signals;
    initialize(cwd: string): void;
    supports(frameworkName: string): boolean;
    detect(): Promise<void>;
    analyze(): Promise<DynamicSignal[]>;
    getMetadata(): Partial<FrameworkMetadata>;
    dispose(): void;
}
//# sourceMappingURL=adapter.d.ts.map