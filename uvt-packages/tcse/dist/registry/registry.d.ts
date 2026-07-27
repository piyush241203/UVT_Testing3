import { TCSEPlugin } from '../contracts/index.js';
export declare class TCSERegistry {
    private plugins;
    registerPlugin(plugin: TCSEPlugin): void;
    unregisterPlugin(pluginName: string): boolean;
    getPlugin(pluginName: string): TCSEPlugin | undefined;
    getPlugins(): TCSEPlugin[];
    getAllPlugins(): TCSEPlugin[];
    getEnabledPlugins(): TCSEPlugin[];
    clear(): void;
    count(): number;
}
export declare const defaultTCSERegistry: TCSERegistry;
//# sourceMappingURL=registry.d.ts.map