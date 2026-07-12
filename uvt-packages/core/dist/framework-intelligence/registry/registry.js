"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameworkRegistry = void 0;
class FrameworkRegistry {
    adapters = [];
    register(adapter) {
        this.adapters.push(adapter);
    }
    getAdapter(frameworkName) {
        // Exact match or contains (e.g., 'React (Vite)' matches 'React')
        return this.adapters.find(a => a.supports(frameworkName)) || null;
    }
}
exports.FrameworkRegistry = FrameworkRegistry;
//# sourceMappingURL=registry.js.map