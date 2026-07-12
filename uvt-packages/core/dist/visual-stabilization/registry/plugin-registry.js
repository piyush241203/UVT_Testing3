"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginRegistry = void 0;
class PluginRegistry {
    plugins = new Map();
    register(plugin) {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`Plugin ${plugin.id} is already registered.`);
        }
        plugin.initialize();
        this.plugins.set(plugin.id, plugin);
    }
    getPlugins() {
        // Sort by priority descending
        return Array.from(this.plugins.values()).sort((a, b) => b.priority - a.priority);
    }
    disposeAll() {
        for (const plugin of this.plugins.values()) {
            plugin.dispose();
        }
        this.plugins.clear();
    }
}
exports.PluginRegistry = PluginRegistry;
//# sourceMappingURL=plugin-registry.js.map