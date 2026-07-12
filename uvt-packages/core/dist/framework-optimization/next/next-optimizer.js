"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextOptimizer = void 0;
class NextOptimizer {
    id = 'NextOptimizer';
    supports(context) {
        const fw = context.runtimeMetadata.get('frameworks');
        if (fw && Array.isArray(fw)) {
            return fw.includes('Next.js');
        }
        return false;
    }
    optimize(decisions, context) {
        return decisions.map(d => {
            let strategy = d.recommendedStrategy;
            // Specific Next.js optimizations (like handling next/image)
            if (d.recommendedStrategy === 'ReplaceSrc' || d.target.includes('img')) {
                strategy = 'Next.ImagePlaceholder';
            }
            else if (d.recommendedStrategy === 'Freeze') {
                strategy = 'Next.ServerComponentFallback';
            }
            return {
                ...d,
                isOptimized: true,
                optimizedStrategy: strategy,
                framework: 'Next.js'
            };
        });
    }
    verify() { }
    dispose() { }
}
exports.NextOptimizer = NextOptimizer;
//# sourceMappingURL=next-optimizer.js.map