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
exports.HtmlFrameworkPlugin = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const shared_1 = require("@uvt/shared");
class HtmlFrameworkPlugin {
    name = 'html';
    apiVersion = 1;
    async detect(repo) {
        const evidence = [];
        let confidence = 0;
        // Check if index.html exists in root
        const hasIndexHtml = fs.existsSync(path.join(repo.cwd, 'index.html'));
        // Check that standard framework packages are not present to avoid false matching React/Next/Vue
        const deps = repo.dependencies || {};
        const hasFrameworkDeps = deps['react'] || deps['vue'] || deps['next'] || deps['nuxt'] || deps['@angular/core'] || deps['svelte'];
        if (hasIndexHtml && !hasFrameworkDeps) {
            confidence = 0.8;
            evidence.push('Found "index.html" in workspace root without dynamic framework dependencies.');
        }
        if (confidence === 0)
            return null;
        return {
            confidence,
            evidence
        };
    }
    async discoverRoutes(repo) {
        shared_1.logger.debug('HTML Framework Plugin scanning routes...');
        const cwd = repo.cwd;
        const routeSet = new Set();
        const descriptors = [];
        // Scan for all .html files in the workspace (excluding common dist/node_modules dirs)
        const htmlFiles = await (0, fast_glob_1.default)('**/*.html', {
            cwd,
            absolute: true,
            ignore: [
                '**/node_modules/**',
                '**/dist/**',
                '**/out/**',
                '**/coverage/**',
                '**/.git/**',
                '**/.uvt/**',
                '**/uvt-packages/**',
                '**/uvt-report/**'
            ]
        });
        for (const file of htmlFiles) {
            const relativeFile = path.relative(cwd, file);
            const normalizedPath = relativeFile.replace(/\\/g, '/');
            let routePath = '/' + normalizedPath;
            if (normalizedPath === 'index.html') {
                routePath = '/';
            }
            if (!routeSet.has(routePath)) {
                routeSet.add(routePath);
                descriptors.push({
                    name: this.pathToName(normalizedPath),
                    url: routePath,
                    sourceFile: file
                });
            }
        }
        // Always ensure home route is present
        if (!routeSet.has('/')) {
            descriptors.unshift({
                name: 'Home',
                url: '/'
            });
        }
        // Sort index routes first
        return descriptors.sort((a, b) => {
            if (a.url === '/')
                return -1;
            if (b.url === '/')
                return 1;
            return a.url.localeCompare(b.url);
        });
    }
    pathToName(normalizedPath) {
        if (normalizedPath === 'index.html')
            return 'Home';
        const cleaned = normalizedPath
            .replace(/\.html$/, '')
            .split('/')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
        return cleaned || 'Home';
    }
}
exports.HtmlFrameworkPlugin = HtmlFrameworkPlugin;
//# sourceMappingURL=html-framework-plugin.js.map