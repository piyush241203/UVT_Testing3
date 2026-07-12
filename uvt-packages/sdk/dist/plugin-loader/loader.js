"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginLoader = void 0;
class PluginLoader {
    context;
    plugins = new Map();
    constructor(context) {
        this.context = context;
    }
    async register(plugin) {
        try {
            this.validateManifest(plugin);
            await this.safeExecute('initialize', plugin, () => plugin.initialize?.(this.context));
            this.plugins.set(plugin.manifest.name, plugin);
            return true;
        }
        catch (err) {
            this.context.logger?.error(`Failed to register plugin ${plugin.manifest?.name || 'unknown'}: ${err.message}`);
            return false;
        }
    }
    validateManifest(plugin) {
        if (!plugin.manifest || !plugin.manifest.name || !plugin.manifest.version) {
            throw new Error('Invalid PluginManifest');
        }
    }
    async invokeHook(hookName, ...args) {
        for (const [name, plugin] of this.plugins.entries()) {
            const hookFn = plugin[hookName];
            if (typeof hookFn === 'function') {
                try {
                    await this.safeExecute(hookName, plugin, () => hookFn.apply(plugin, args));
                }
                catch (err) {
                    this.context.logger?.error(`Plugin ${name} failed during ${hookName}. Disabling plugin.`);
                    this.plugins.delete(name);
                }
            }
        }
    }
    async safeExecute(hookName, plugin, fn) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout exceeded (2000ms) during ${hookName}`));
            }, 2000);
            Promise.resolve(fn())
                .then(res => {
                clearTimeout(timer);
                resolve(res);
            })
                .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
        });
    }
}
exports.PluginLoader = PluginLoader;
//# sourceMappingURL=loader.js.map