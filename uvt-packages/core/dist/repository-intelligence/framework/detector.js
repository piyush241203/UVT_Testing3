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
exports.FrameworkDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FrameworkDetector {
    name = 'FrameworkDetector';
    async detect(context) {
        const deps = context.dependencies;
        let framework = 'Static HTML';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Next.js', dep: 'next', config: 'next.config.js' },
            { name: 'Nuxt', dep: 'nuxt', config: 'nuxt.config.ts' },
            { name: 'SvelteKit', dep: '@sveltejs/kit', config: 'svelte.config.js' },
            { name: 'Astro', dep: 'astro', config: 'astro.config.mjs' },
            { name: 'Remix', dep: '@remix-run/react', config: 'remix.config.js' },
            { name: 'Angular', dep: '@angular/core', config: 'angular.json' },
            { name: 'Vue', dep: 'vue', config: 'vue.config.js' }, // Also handled by Vite check
            { name: 'React', dep: 'react', config: 'react-scripts' } // CRA or generic
        ];
        for (const check of checks) {
            const hasDep = !!deps[check.dep];
            const hasConfig = fs.existsSync(path.join(context.cwd, check.config)) ||
                fs.existsSync(path.join(context.cwd, check.config.replace('.js', '.ts'))) ||
                fs.existsSync(path.join(context.cwd, check.config.replace('.mjs', '.ts')));
            if (hasDep && hasConfig) {
                framework = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}" and configuration file "${check.config}".`);
                break;
            }
            else if (hasDep) {
                framework = check.name;
                confidence = 0.8;
                evidence.push(`Found dependency "${check.dep}".`);
                break; // Stop at first matched framework — checks are ordered by specificity
            }
            else if (hasConfig) {
                framework = check.name;
                confidence = 0.6;
                evidence.push(`Found configuration file "${check.config}".`);
                break; // Stop at first matched framework
            }
        }
        if (framework === 'React' && fs.existsSync(path.join(context.cwd, 'vite.config.ts'))) {
            framework = 'React (Vite)';
            evidence.push('Found vite.config.ts with React.');
        }
        context.capabilities.set('framework', {
            id: 'framework',
            type: 'framework',
            name: framework,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.FrameworkDetector = FrameworkDetector;
//# sourceMappingURL=detector.js.map