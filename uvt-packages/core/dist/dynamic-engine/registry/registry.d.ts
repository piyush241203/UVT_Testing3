import { Analyzer, Stabilizer, SnapshotProvider } from '../core/interfaces.js';
import { PluginManifest } from '../contracts/manifest.js';
export interface RegisteredPlugin<T> {
    readonly manifest?: PluginManifest;
    readonly instance: T;
}
/**
 * Registry container for DSE plugins, analyzers, and providers.
 * Supports DI and runtime registration with Plugin Manifests.
 */
export declare class DSERegistry {
    private analyzers;
    private stabilizers;
    private snapshotProviders;
    registerAnalyzer(analyzer: Analyzer, manifest?: PluginManifest): void;
    registerStabilizer(stabilizer: Stabilizer, manifest?: PluginManifest): void;
    registerSnapshotProvider(provider: SnapshotProvider, manifest?: PluginManifest): void;
    getAnalyzers(): Analyzer[];
    getAnalyzer(name: string): Analyzer | undefined;
    getStabilizers(): Stabilizer[];
    getStabilizer(name: string): Stabilizer | undefined;
    getSnapshotProviders(): SnapshotProvider[];
    getSnapshotProvider(name: string): SnapshotProvider | undefined;
}
//# sourceMappingURL=registry.d.ts.map