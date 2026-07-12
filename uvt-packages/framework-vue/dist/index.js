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
exports.VueFrameworkPlugin = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const shared_1 = require("@uvt/shared");
class VueFrameworkPlugin {
    name = 'vue';
    apiVersion = 1;
    async detect(repo) {
        const deps = repo.dependencies;
        const evidence = [];
        let confidence = 0;
        if (deps['vue']) {
            confidence += 0.8;
            evidence.push('Vue package detected in dependencies.');
        }
        if (deps['nuxt'] || deps['@nuxt/kit']) {
            confidence += 0.9;
            evidence.push('Nuxt package detected in dependencies.');
        }
        if (confidence === 0)
            return null;
        return {
            confidence: Math.min(confidence, 1.0),
            evidence
        };
    }
    async discoverRoutes(repo) {
        shared_1.logger.debug('Vue Framework Plugin scanning routes...');
        const cwd = repo.cwd;
        const routeSet = new Set();
        const descriptors = [];
        // Nuxt or file-system routes (pages/, src/pages/, src/views/)
        const pagesDirs = [
            path.join(cwd, 'pages'),
            path.join(cwd, 'src', 'pages'),
            path.join(cwd, 'src', 'views')
        ];
        for (const pagesDir of pagesDirs) {
            if (fs.existsSync(pagesDir)) {
                shared_1.logger.info(`Detected Vue/Nuxt directory: ${pagesDir}. Discovering file-system routes...`);
                const pageFiles = await (0, fast_glob_1.default)('**/*.{vue,js,ts,jsx,tsx}', {
                    cwd: pagesDir,
                    absolute: true,
                    ignore: ['**/node_modules/**', '**/dist/**']
                });
                for (const file of pageFiles) {
                    const relativeFile = path.relative(pagesDir, file);
                    let routePath = '/' + relativeFile.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');
                    // clean index routes
                    if (routePath.endsWith('/index')) {
                        routePath = routePath.slice(0, -6);
                    }
                    if (!routePath)
                        routePath = '/';
                    if (!routeSet.has(routePath)) {
                        routeSet.add(routePath);
                        descriptors.push({
                            name: this.pathToName(routePath),
                            url: routePath,
                            sourceFile: file
                        });
                    }
                }
            }
        }
        // Always ensure home route is present
        if (!routeSet.has('/')) {
            descriptors.unshift({
                name: 'Home',
                url: '/'
            });
        }
        return descriptors;
    }
    pathToName(routePath) {
        const cleaned = routePath
            .replace(/^\//, '')
            .split('/')
            .map(part => {
            const partClean = part.replace(/^:/, '');
            return partClean.charAt(0).toUpperCase() + partClean.slice(1);
        })
            .join(' ');
        return cleaned || 'Home';
    }
}
exports.VueFrameworkPlugin = VueFrameworkPlugin;
//# sourceMappingURL=index.js.map