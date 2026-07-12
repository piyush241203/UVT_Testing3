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
exports.BuildToolDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class BuildToolDetector {
    name = 'BuildToolDetector';
    async detect(context) {
        const deps = context.dependencies;
        let buildTool = 'Unknown';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Vite', dep: 'vite', config: 'vite.config.ts' },
            { name: 'Webpack', dep: 'webpack', config: 'webpack.config.js' },
            { name: 'Rollup', dep: 'rollup', config: 'rollup.config.js' },
            { name: 'Parcel', dep: 'parcel', config: '.parcelrc' },
            { name: 'esbuild', dep: 'esbuild', config: 'esbuild.js' },
            { name: 'Turbopack', dep: 'next', config: 'next.config.js' }, // Next.js often implies turbopack now
            { name: 'Angular CLI', dep: '@angular/cli', config: 'angular.json' }
        ];
        for (const check of checks) {
            const hasDep = !!deps[check.dep];
            const hasConfig = fs.existsSync(path.join(context.cwd, check.config)) ||
                fs.existsSync(path.join(context.cwd, check.config.replace('.ts', '.js')));
            if (hasDep && hasConfig) {
                buildTool = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}" and config "${check.config}".`);
                break;
            }
            else if (hasDep) {
                buildTool = check.name;
                confidence = 0.8;
                evidence.push(`Found dependency "${check.dep}".`);
            }
            else if (hasConfig) {
                buildTool = check.name;
                confidence = 0.6;
                evidence.push(`Found config "${check.config}".`);
            }
        }
        context.capabilities.set('buildTool', {
            id: 'buildTool',
            type: 'buildTool',
            name: buildTool,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.BuildToolDetector = BuildToolDetector;
//# sourceMappingURL=detector.js.map