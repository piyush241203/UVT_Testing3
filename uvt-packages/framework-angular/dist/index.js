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
exports.AngularFrameworkPlugin = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const shared_1 = require("@uvt/shared");
class AngularFrameworkPlugin {
    name = 'angular';
    apiVersion = 1;
    async detect(repo) {
        const deps = repo.dependencies;
        const evidence = [];
        let confidence = 0;
        if (deps['@angular/core']) {
            confidence += 0.8;
            evidence.push('Angular core package detected in dependencies.');
        }
        if (deps['@angular/router']) {
            confidence += 0.2;
            evidence.push('Angular router package detected in dependencies.');
        }
        if (confidence === 0)
            return null;
        return {
            confidence,
            evidence
        };
    }
    async discoverRoutes(repo) {
        shared_1.logger.debug('Angular Framework Plugin scanning routes...');
        const cwd = repo.cwd;
        const routeSet = new Set();
        const descriptors = [];
        // Very basic fallback: scan for standalone components with a @Component decorator that might imply routing
        // or just return Home if we can't deeply parse Angular's AST (since it requires TypeScript/Angular compiler).
        // For UVT Certification, we'll scan for `app.routes.ts` or components.
        const srcDir = path.join(cwd, 'src', 'app');
        if (fs.existsSync(srcDir)) {
            const files = await (0, fast_glob_1.default)('**/*.component.ts', {
                cwd: srcDir,
                absolute: true,
                ignore: ['**/*.spec.ts']
            });
            for (const file of files) {
                // Attempt a regex approach to extract standalone route implications
                // e.g. a component name
                const baseName = path.basename(file, '.component.ts');
                if (baseName === 'app')
                    continue;
                // Convert 'product-detail' -> '/product-detail'
                const rPath = `/${baseName}`;
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
            shared_1.logger.warn(`Source directory src/app/ not found in ${cwd}.`);
        }
        // Always ensure home route is present
        if (!routeSet.has('/')) {
            descriptors.unshift({
                name: 'Home',
                url: '/'
            });
        }
        else {
            // Move Home to the top if we found it under another name or it's implicitly there
            const idx = descriptors.findIndex(d => d.url === '/');
            if (idx !== -1) {
                const d = descriptors.splice(idx, 1)[0];
                descriptors.unshift(d);
            }
            else {
                descriptors.unshift({ name: 'Home', url: '/' });
            }
        }
        return descriptors;
    }
    pathToName(routePath) {
        const cleaned = routePath
            .replace(/^\//, '')
            .split(/[-/]/)
            .map(part => {
            const partClean = part.replace(/^:/, '');
            return partClean.charAt(0).toUpperCase() + partClean.slice(1);
        })
            .join(' ');
        return cleaned || 'Home';
    }
}
exports.AngularFrameworkPlugin = AngularFrameworkPlugin;
//# sourceMappingURL=index.js.map