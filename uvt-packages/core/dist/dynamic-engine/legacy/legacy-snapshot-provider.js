"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacySnapshotProviderAdapter = void 0;
/**
 * Adapter converting the old VisualProvider interface into the new SnapshotProvider interface.
 */
class LegacySnapshotProviderAdapter {
    name;
    provider;
    context;
    constructor(provider) {
        this.name = provider.name;
        this.provider = provider;
    }
    async initialize(context) {
        this.context = context;
        // The old provider was already initialized via `provider.initialize(...)` in CoreEngine.
        // We don't need to re-initialize it here unless necessary.
        this.context.logger.debug(`[LegacySnapshotProviderAdapter] Bound provider: ${this.name}`);
    }
    async capture(page, options) {
        if (!options.route || !options.url) {
            throw new Error(`[LegacySnapshotProviderAdapter] Missing 'route' or 'url' in snapshot options.`);
        }
        const name = options.name || options.url;
        const url = options.url;
        const route = options.route;
        await this.provider.snapshot(page, { name, url, route });
    }
    async dispose() {
        // CoreEngine calls provider.finalize() at the very end.
        // So we don't finalize here, because dispose() runs per-snapshot in some pipeline loops.
    }
}
exports.LegacySnapshotProviderAdapter = LegacySnapshotProviderAdapter;
//# sourceMappingURL=legacy-snapshot-provider.js.map