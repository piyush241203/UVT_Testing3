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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteFrameworkPlugin = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const shared_1 = require("@uvt/shared");
class SvelteFrameworkPlugin {
    name = 'sveltekit';
    apiVersion = 1;
    async detect(repo) {
        const deps = repo.dependencies;
        const evidence = [];
        let confidence = 0;
        if (deps['svelte']) {
            confidence += 0.4;
            evidence.push('Svelte package detected in dependencies.');
        }
        if (deps['@sveltejs/kit']) {
            confidence += 0.5;
            evidence.push('SvelteKit package detected in dependencies.');
        }
        if (confidence === 0)
            return null;
        return {
            confidence,
            evidence
        };
    }
    async discoverRoutes(repo) {
        shared_1.logger.debug('SvelteKit Framework Plugin scanning routes...');
        const cwd = repo.cwd;
        const routeSet = new Set();
        const descriptors = [];
        // SvelteKit uses directory-based routing in src/routes/
        const srcDir = path.join(cwd, 'src', 'routes');
        if (fs.existsSync(srcDir)) {
            const files = await (0, fast_glob_1.default)('**/+page.svelte', {
                cwd: srcDir,
                absolute: true
            });
            for (const file of files) {
                // Convert 'src/routes/about/+page.svelte' -> '/about'
                const relativeDir = path.dirname(path.relative(srcDir, file));
                let rPath = relativeDir === '.' ? '/' : `/${relativeDir}`;
                // Handle dynamic params [id] -> Ignore them or normalize them
                if (rPath.includes('['))
                    continue; // skip dynamic routes for visual testing baseline if desired, or we can mock it
                // Fix Windows paths
                rPath = rPath.replace(/\\/g, '/');
                if (!routeSet.has(rPath)) {
                    routeSet.add(rPath);
                    descriptors.push({
                        name: this.pathToName(rPath),
                        url: rPath,
                        sourceFile: file
                    });
                }
            }
        }
        else {
            shared_1.logger.warn(`Source directory src/routes/ not found in ${cwd}. Is this a standard SvelteKit project?`);
        }
        if (!routeSet.has('/')) {
            descriptors.unshift({ name: 'Home', url: '/' });
        }
        else {
            const idx = descriptors.findIndex(d => d.url === '/');
            if (idx !== -1) {
                const d = descriptors.splice(idx, 1)[0];
                descriptors.unshift(d);
            }
        }
        return descriptors;
    }
    pathToName(routePath) {
        if (routePath === '/')
            return 'Home';
        const cleaned = routePath
            .replace(/^\//, '')
            .split('/')
            .map(part => {
            const partClean = part.replace(/^:/, '').replace(/\[/g, '').replace(/\]/g, '');
            return partClean.charAt(0).toUpperCase() + partClean.slice(1);
        })
            .join(' ');
        return cleaned || 'Home';
    }
}
exports.SvelteFrameworkPlugin = SvelteFrameworkPlugin;
//# sourceMappingURL=index.js.map