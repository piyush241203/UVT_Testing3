"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTCSERegistry = exports.TCSERegistry = void 0;
class TCSERegistry {
    plugins = new Map();
    registerPlugin(plugin) {
        if (!plugin || !plugin.name) {
            throw new Error('Invalid TCSE plugin: plugin must have a valid name.');
        }
        this.plugins.set(plugin.name, plugin);
    }
    unregisterPlugin(pluginName) {
        return this.plugins.delete(pluginName);
    }
    getPlugin(pluginName) {
        return this.plugins.get(pluginName);
    }
    getPlugins() {
        return Array.from(this.plugins.values());
    }
    getAllPlugins() {
        return this.getPlugins();
    }
    getEnabledPlugins() {
        return this.getPlugins().filter(p => p.enabled !== false);
    }
    clear() {
        this.plugins.clear();
    }
    count() {
        return this.plugins.size;
    }
}
exports.TCSERegistry = TCSERegistry;
exports.defaultTCSERegistry = new TCSERegistry();
//# sourceMappingURL=registry.js.map