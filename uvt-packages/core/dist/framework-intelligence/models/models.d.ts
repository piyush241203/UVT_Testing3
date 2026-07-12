import { DynamicSignal } from '../../dynamic-engine/index.js';
import { FrameworkMetadata } from '../../dynamic-engine/metadata/framework.js';
export { FrameworkMetadata };
export interface FrameworkAdapter {
    readonly name: string;
    initialize(cwd: string): void;
    supports(frameworkName: string): boolean;
    detect(): Promise<void>;
    analyze(): Promise<DynamicSignal[]>;
    dispose(): void;
    getMetadata(): Partial<FrameworkMetadata>;
}
//# sourceMappingURL=models.d.ts.map