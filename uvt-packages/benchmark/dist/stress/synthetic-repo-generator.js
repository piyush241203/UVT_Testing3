"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntheticRepoGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SyntheticRepoGenerator {
    static getSpecForScenario(id) {
        switch (id) {
            case 'scale_100_routes':
                return { routeCount: 100, componentCount: 500, layoutDepth: 2, isMonorepo: false, packageCount: 1, dependencyDepth: 5 };
            case 'scale_500_routes':
                return { routeCount: 500, componentCount: 2500, layoutDepth: 4, isMonorepo: false, packageCount: 1, dependencyDepth: 10 };
            case 'scale_1000_routes':
                return { routeCount: 1000, componentCount: 5000, layoutDepth: 5, isMonorepo: false, packageCount: 1, dependencyDepth: 15 };
            case 'scale_10000_components':
                return { routeCount: 200, componentCount: 10000, layoutDepth: 3, isMonorepo: false, packageCount: 1, dependencyDepth: 8 };
            case 'nested_layouts':
                return { routeCount: 50, componentCount: 200, layoutDepth: 10, isMonorepo: false, packageCount: 1, dependencyDepth: 4 };
            case 'large_monorepo':
                return { routeCount: 300, componentCount: 1500, layoutDepth: 3, isMonorepo: true, packageCount: 20, dependencyDepth: 12 };
            case 'deep_dependency_graph':
                return { routeCount: 100, componentCount: 400, layoutDepth: 2, isMonorepo: true, packageCount: 10, dependencyDepth: 100 };
        }
    }
    static generateSyntheticRepo(targetDir, id) {
        const spec = this.getSpecForScenario(id);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        // Write package.json
        const pkg = {
            name: `synthetic-${id}`,
            version: '1.0.0',
            private: true,
            dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0'
            }
        };
        fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');
        // Create routes directory
        const srcDir = path.join(targetDir, 'src');
        const routesDir = path.join(srcDir, 'routes');
        const componentsDir = path.join(srcDir, 'components');
        fs.mkdirSync(routesDir, { recursive: true });
        fs.mkdirSync(componentsDir, { recursive: true });
        // Generate mock routes
        for (let i = 0; i < Math.min(20, spec.routeCount); i++) {
            const routeContent = `import React from 'react';\nexport default function Route${i}() { return <div>Route ${i}</div>; }\n`;
            fs.writeFileSync(path.join(routesDir, `page_${i}.tsx`), routeContent, 'utf8');
        }
        return spec;
    }
}
exports.SyntheticRepoGenerator = SyntheticRepoGenerator;
//# sourceMappingURL=synthetic-repo-generator.js.map