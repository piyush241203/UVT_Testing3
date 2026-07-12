import { SnapshotProvider, DynamicContext } from '../index.js';
import { VisualProvider } from '@uvt/shared';
import { Page } from 'playwright';
/**
 * Adapter converting the old VisualProvider interface into the new SnapshotProvider interface.
 */
export declare class LegacySnapshotProviderAdapter implements SnapshotProvider {
    readonly name: string;
    private provider;
    private context?;
    constructor(provider: VisualProvider);
    initialize(context: DynamicContext): Promise<void>;
    capture(page: Page, options: Record<string, unknown>): Promise<void>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=legacy-snapshot-provider.d.ts.map