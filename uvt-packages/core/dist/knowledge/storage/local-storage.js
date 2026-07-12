"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalKnowledgeStorage = void 0;
class LocalKnowledgeStorage {
    patterns = new Map();
    async loadPatterns() {
        // Basic mock of disk I/O for pattern loading
        return Array.from(this.patterns.values());
    }
    async savePattern(pattern) {
        this.patterns.set(pattern.id, pattern);
    }
}
exports.LocalKnowledgeStorage = LocalKnowledgeStorage;
//# sourceMappingURL=local-storage.js.map