"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DSERegistry = void 0;
/**
 * Registry container for DSE plugins, analyzers, and providers.
 * Supports DI and runtime registration with Plugin Manifests.
 */
class DSERegistry {
    analyzers = new Map();
    stabilizers = new Map();
    snapshotProviders = new Map();
    // ---------------------------------------------------------
    // Registration
    // ---------------------------------------------------------
    registerAnalyzer(analyzer, manifest) {
        if (this.analyzers.has(analyzer.name)) {
            throw new Error(`Analyzer with name ${analyzer.name} is already registered.`);
        }
        this.analyzers.set(analyzer.name, { instance: analyzer, manifest });
    }
    registerStabilizer(stabilizer, manifest) {
        if (this.stabilizers.has(stabilizer.name)) {
            throw new Error(`Stabilizer with name ${stabilizer.name} is already registered.`);
        }
        this.stabilizers.set(stabilizer.name, { instance: stabilizer, manifest });
    }
    registerSnapshotProvider(provider, manifest) {
        if (this.snapshotProviders.has(provider.name)) {
            throw new Error(`SnapshotProvider with name ${provider.name} is already registered.`);
        }
        this.snapshotProviders.set(provider.name, { instance: provider, manifest });
    }
    // ---------------------------------------------------------
    // Retrieval
    // ---------------------------------------------------------
    getAnalyzers() {
        return Array.from(this.analyzers.values())
            .sort((a, b) => (b.manifest?.priority || 0) - (a.manifest?.priority || 0))
            .map(r => r.instance);
    }
    getAnalyzer(name) {
        return this.analyzers.get(name)?.instance;
    }
    getStabilizers() {
        return Array.from(this.stabilizers.values())
            .sort((a, b) => (b.manifest?.priority || 0) - (a.manifest?.priority || 0))
            .map(r => r.instance);
    }
    getStabilizer(name) {
        return this.stabilizers.get(name)?.instance;
    }
    getSnapshotProviders() {
        return Array.from(this.snapshotProviders.values()).map(r => r.instance);
    }
    getSnapshotProvider(name) {
        return this.snapshotProviders.get(name)?.instance;
    }
}
exports.DSERegistry = DSERegistry;
//# sourceMappingURL=registry.js.map