import { UvtPlugin, PluginContext } from '../plugin-api/models.js';
export declare class PluginLoader {
    private context;
    private plugins;
    constructor(context: PluginContext);
    register(plugin: UvtPlugin): Promise<boolean>;
    private validateManifest;
    invokeHook(hookName: keyof Omit<UvtPlugin, 'manifest'>, ...args: any[]): Promise<void>;
    private safeExecute;
}
//# sourceMappingURL=loader.d.ts.map