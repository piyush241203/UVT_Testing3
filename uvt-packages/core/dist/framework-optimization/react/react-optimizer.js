"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactOptimizer = void 0;
class ReactOptimizer {
    id = 'ReactOptimizer';
    supports(context) {
        const fw = context.runtimeMetadata.get('frameworks');
        if (fw && Array.isArray(fw)) {
            return fw.includes('React');
        }
        return false;
    }
    optimize(decisions, context) {
        return decisions.map(d => {
            let strategy = d.recommendedStrategy;
            // Instead of generic freezing, React can use internal boundaries
            if (d.recommendedStrategy === 'Freeze' && d.confidence > 90) {
                strategy = 'React.Suspense';
            }
            else if (d.recommendedStrategy === 'Mask') {
                strategy = 'React.RenderNull';
            }
            return {
                ...d,
                isOptimized: true,
                optimizedStrategy: strategy,
                framework: 'React'
            };
        });
    }
    verify() { }
    dispose() { }
}
exports.ReactOptimizer = ReactOptimizer;
//# sourceMappingURL=react-optimizer.js.map