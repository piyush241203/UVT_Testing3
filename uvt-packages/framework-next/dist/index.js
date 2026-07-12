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
exports.NextFrameworkPlugin = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const shared_1 = require("@uvt/shared");
class NextFrameworkPlugin {
    name = 'next';
    apiVersion = 1;
    async detect(repo) {
        const deps = repo.dependencies;
        const evidence = [];
        let confidence = 0;
        if (deps['next']) {
            confidence += 0.9;
            evidence.push('Next.js package detected in dependencies.');
        }
        // App/Pages directory presence adds to Next.js detection confidence
        const hasApp = fs.existsSync(path.join(repo.cwd, 'app')) || fs.existsSync(path.join(repo.cwd, 'src', 'app'));
        const hasPages = fs.existsSync(path.join(repo.cwd, 'pages')) || fs.existsSync(path.join(repo.cwd, 'src', 'pages'));
        if (hasApp || hasPages) {
            confidence += 0.1;
            evidence.push('App or Pages Router directory detected.');
        }
        if (confidence === 0)
            return null;
        return {
            confidence: Math.min(confidence, 1.0),
            evidence
        };
    }
    async discoverRoutes(repo) {
        shared_1.logger.debug('Next.js Framework Plugin scanning routes...');
        const cwd = repo.cwd;
        // Check Next.js App Router (root app/ or src/app/)
        const appDir = fs.existsSync(path.join(cwd, 'app')) ? path.join(cwd, 'app') :
            fs.existsSync(path.join(cwd, 'src', 'app')) ? path.join(cwd, 'src', 'app') : null;
        // Check Next.js Pages Router (root pages/ or src/pages/)
        const pagesDir = fs.existsSync(path.join(cwd, 'pages')) ? path.join(cwd, 'pages') :
            fs.existsSync(path.join(cwd, 'src', 'pages')) ? path.join(cwd, 'src', 'pages') : null;
        const routeSet = new Set();
        const descriptors = [];
        // Next.js App Router File-System Routing
        if (appDir) {
            shared_1.logger.info(`Detected Next.js App Router directory: ${appDir}. Discovering file-system routes...`);
            const pageFiles = await (0, fast_glob_1.default)('**/page.{js,ts,jsx,tsx}', {
                cwd: appDir,
                absolute: true,
                ignore: ['**/node_modules/**', '**/dist/**']
            });
            for (const file of pageFiles) {
                const relativeDir = path.relative(appDir, path.dirname(file));
                // Clean dynamic/grouped paths (e.g. (marketing)/about -> /about, [id] -> :id)
                let routePath = '/' + relativeDir.replace(/\\/g, '/');
                // Remove route groups like (auth) or (marketing)
                routePath = routePath.replace(/\/\([^)]+\)/g, '');
                // Replace dynamic parameters like [id] with :id
                routePath = routePath.replace(/\/\[([^\]]+)\]/g, '/:$1');
                // Clean multiple slashes or trailing slashes
                routePath = routePath.replace(/\/+/g, '/').replace(/\/$/, '');
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
        // Next.js Pages Router File-System Routing
        if (pagesDir) {
            shared_1.logger.info(`Detected Next.js Pages Router directory: ${pagesDir}. Discovering file-system routes...`);
            const pageFiles = await (0, fast_glob_1.default)('**/*.{js,ts,jsx,tsx}', {
                cwd: pagesDir,
                absolute: true,
                ignore: ['**/node_modules/**', '**/dist/**', '**/_app.*', '**/_document.*', '**/_error.*', '**/api/**']
            });
            for (const file of pageFiles) {
                const relativeFile = path.relative(pagesDir, file);
                let routePath = '/' + relativeFile.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');
                // E.g. /index -> /
                if (routePath.endsWith('/index')) {
                    routePath = routePath.slice(0, -6);
                }
                // Replace dynamic parameters like [id] with :id
                routePath = routePath.replace(/\/\[([^\]]+)\]/g, '/:$1');
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
        // Convert e.g. "/settings/profile" -> "Settings Profile"
        const cleaned = routePath
            .replace(/^\//, '')
            .split('/')
            .map(part => {
            // remove dynamic param notation
            const partClean = part.replace(/^:/, '');
            return partClean.charAt(0).toUpperCase() + partClean.slice(1);
        })
            .join(' ');
        return cleaned || 'Home';
    }
}
exports.NextFrameworkPlugin = NextFrameworkPlugin;
//# sourceMappingURL=index.js.map