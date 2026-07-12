"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SNIECache = void 0;
class SNIECache {
    memoryCache = new Map();
    get(signature) {
        return this.memoryCache.get(signature) || null;
    }
    set(signature, schema) {
        this.memoryCache.set(signature, schema);
    }
    has(signature) {
        return this.memoryCache.has(signature);
    }
    getAll() {
        return Array.from(this.memoryCache.values());
    }
    clear() {
        this.memoryCache.clear();
    }
}
exports.SNIECache = SNIECache;
//# sourceMappingURL=cache.js.map