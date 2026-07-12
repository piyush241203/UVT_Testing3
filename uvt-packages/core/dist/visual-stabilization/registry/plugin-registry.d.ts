import { StabilizationPlugin } from '../models/models.js';
export declare class PluginRegistry {
    private plugins;
    register(plugin: StabilizationPlugin): void;
    getPlugins(): StabilizationPlugin[];
    disposeAll(): void;
}
//# sourceMappingURL=plugin-registry.d.ts.map