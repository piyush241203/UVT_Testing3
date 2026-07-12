"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizerRegistry = void 0;
class OptimizerRegistry {
    optimizers = [];
    register(optimizer) {
        this.optimizers.push(optimizer);
    }
    getOptimizers() {
        return this.optimizers;
    }
}
exports.OptimizerRegistry = OptimizerRegistry;
//# sourceMappingURL=registry.js.map