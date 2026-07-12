"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictResolver = void 0;
class ConflictResolver {
    resolve(decisions) {
        // In this basic version, if two decisions target the same selector,
        // we keep the one with the highest confidence or priority.
        const resolved = new Map();
        for (const decision of decisions) {
            if (resolved.has(decision.target)) {
                const existing = resolved.get(decision.target);
                if (decision.confidence > existing.confidence) {
                    resolved.set(decision.target, decision);
                }
            }
            else {
                resolved.set(decision.target, decision);
            }
        }
        return Array.from(resolved.values());
    }
}
exports.ConflictResolver = ConflictResolver;
//# sourceMappingURL=conflict-resolver.js.map