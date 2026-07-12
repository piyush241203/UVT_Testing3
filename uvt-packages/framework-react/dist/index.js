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
exports.ReactFrameworkPlugin = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const shared_1 = require("@uvt/shared");
const ast_1 = require("@uvt/ast");
class ReactFrameworkPlugin {
    name = 'react';
    apiVersion = 1;
    async detect(repo) {
        const deps = repo.dependencies;
        const evidence = [];
        let confidence = 0;
        if (deps['react']) {
            confidence += 0.4;
            evidence.push('React package detected in dependencies.');
        }
        if (deps['react-router-dom'] || deps['react-router']) {
            confidence += 0.5;
            evidence.push('React Router package detected in dependencies.');
        }
        if (deps['@remix-run/react']) {
            confidence += 0.45;
            evidence.push('Remix React package detected in dependencies.');
        }
        if (confidence === 0)
            return null;
        return {
            confidence,
            evidence
        };
    }
    async discoverRoutes(repo) {
        shared_1.logger.debug('React Framework Plugin scanning routes...');
        const cwd = repo.cwd;
        const routeSet = new Set();
        const descriptors = [];
        if (descriptors.length === 0) {
            const srcDir = path.join(cwd, 'src');
            if (fs.existsSync(srcDir)) {
                // Find all JS/TS/JSX/TSX files
                const files = await (0, fast_glob_1.default)('**/*.{js,ts,jsx,tsx}', {
                    cwd: srcDir,
                    absolute: true,
                    ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.*', '**/*.spec.*']
                });
                for (const file of files) {
                    try {
                        const sourceFile = (0, ast_1.parseFile)(file);
                        const paths = (0, ast_1.extractRoutePaths)(sourceFile);
                        for (const rPath of paths) {
                            if (!rPath || rPath.includes('*') || rPath === '/')
                                continue;
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
                    catch (err) {
                        shared_1.logger.debug(`Could not parse file ${file}: ${err.message}`);
                    }
                }
            }
            else {
                shared_1.logger.warn(`Source directory src/, app/, or pages/ not found in ${cwd}.`);
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
exports.ReactFrameworkPlugin = ReactFrameworkPlugin;
//# sourceMappingURL=index.js.map