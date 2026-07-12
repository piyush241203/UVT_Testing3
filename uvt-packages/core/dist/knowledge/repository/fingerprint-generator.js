"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintGenerator = void 0;
class FingerprintGenerator {
    generate(context) {
        const fw = context.runtimeMetadata.get('frameworks') || [];
        const deps = context.runtimeMetadata.get('dependencies') || [];
        const routing = context.runtimeMetadata.get('routing') || [];
        const frameworks = Array.isArray(fw) ? fw : [fw];
        const dependencies = Array.isArray(deps) ? deps : [deps];
        const routingArr = Array.isArray(routing) ? routing : [routing];
        const hashString = `fw:${frameworks.join(',')}|deps:${dependencies.join(',')}|route:${routingArr.join(',')}`;
        return {
            id: this.hashCode(hashString),
            frameworks,
            dependencies,
            routing: routingArr
        };
    }
    hashCode(str) {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
        }
        return Math.abs(hash).toString(16);
    }
}
exports.FingerprintGenerator = FingerprintGenerator;
//# sourceMappingURL=fingerprint-generator.js.map