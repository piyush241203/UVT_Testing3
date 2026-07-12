"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticOptimizer = void 0;
class StaticOptimizer {
    id = 'StaticOptimizer';
    supports(context) {
        return true; // Fallback for all other environments
    }
    optimize(decisions, context) {
        return decisions.map(d => ({
            ...d,
            isOptimized: false,
            framework: 'Static'
        }));
    }
    verify() { }
    dispose() { }
}
exports.StaticOptimizer = StaticOptimizer;
//# sourceMappingURL=static-optimizer.js.map