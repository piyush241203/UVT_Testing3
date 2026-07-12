import { FrameworkAdapter } from '../models/models.js';
export declare class FrameworkRegistry {
    private adapters;
    register(adapter: FrameworkAdapter): void;
    getAdapter(frameworkName: string): FrameworkAdapter | null;
}
//# sourceMappingURL=registry.d.ts.map