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
exports.PhpFrameworkPlugin = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const shared_1 = require("@uvt/shared");
/**
 * PHP Framework Plugin for UVT
 * Supports both Plain PHP and Laravel projects.
 * Detects via composer.json + artisan file (Laravel) or plain .php files.
 */
class PhpFrameworkPlugin {
    constructor() {
        this.name = 'php';
        this.apiVersion = 1;
    }
    async detect(repo) {
        const cwd = repo.cwd;
        const evidence = [];
        let confidence = 0;
        const hasComposerJson = fs.existsSync(path.join(cwd, 'composer.json'));
        const hasArtisan = fs.existsSync(path.join(cwd, 'artisan'));
        const hasPhpFiles = fs.readdirSync(cwd).some(f => f.endsWith('.php'));
        const hasRoutesDir = fs.existsSync(path.join(cwd, 'routes', 'web.php'));
        if (hasComposerJson) {
            confidence += 0.5;
            evidence.push('composer.json detected — PHP project.');
            let composerData = {};
            try {
                composerData = JSON.parse(fs.readFileSync(path.join(cwd, 'composer.json'), 'utf8'));
            }
            catch { }
            const requires = { ...(composerData.require || {}), ...(composerData['require-dev'] || {}) };
            if (requires['laravel/framework']) {
                confidence += 0.4;
                evidence.push('laravel/framework in composer.json — Laravel project detected.');
            }
        }
        if (hasArtisan) {
            confidence += 0.3;
            evidence.push('artisan file detected — Laravel CLI available.');
        }
        if (hasRoutesDir) {
            confidence += 0.2;
            evidence.push('routes/web.php detected — Laravel routing structure.');
        }
        if (hasPhpFiles && !hasComposerJson) {
            confidence = 0.6;
            evidence.push('Plain PHP files found in project root.');
        }
        if (confidence === 0)
            return null;
        return { confidence: Math.min(confidence, 1), evidence };
    }
    async discoverRoutes(repo) {
        const cwd = repo.cwd;
        const hasArtisan = fs.existsSync(path.join(cwd, 'artisan'));
        const hasRoutesWebPhp = fs.existsSync(path.join(cwd, 'routes', 'web.php'));
        if (hasArtisan && hasRoutesWebPhp) {
            return this.discoverLaravelRoutes(cwd);
        }
        return this.discoverPlainPhpRoutes(cwd);
    }
    /**
     * Laravel: parse routes/web.php for Route::get() definitions
     */
    async discoverLaravelRoutes(cwd) {
        shared_1.logger.debug('PHP Plugin (Laravel): parsing routes/web.php...');
        const routesFile = path.join(cwd, 'routes', 'web.php');
        const descriptors = [];
        const routeSet = new Set();
        try {
            const content = fs.readFileSync(routesFile, 'utf8');
            // Match Route::get('/path', ...) or Route::get("path", ...)
            const routeRegex = /Route::(?:get|view)\s*\(\s*['"]([^'"]+)['"]/g;
            let match;
            while ((match = routeRegex.exec(content)) !== null) {
                let routePath = match[1];
                if (!routePath.startsWith('/'))
                    routePath = '/' + routePath;
                // Skip dynamic routes {id}
                if (routePath.includes('{'))
                    continue;
                if (!routeSet.has(routePath)) {
                    routeSet.add(routePath);
                    descriptors.push({
                        name: this.pathToName(routePath),
                        url: routePath,
                        sourceFile: routesFile
                    });
                }
            }
        }
        catch (e) {
            shared_1.logger.warn(`Could not parse routes/web.php: ${e}`);
        }
        if (!routeSet.has('/')) {
            descriptors.unshift({ name: 'Home', url: '/' });
        }
        return descriptors.sort((a, b) => {
            if (a.url === '/')
                return -1;
            if (b.url === '/')
                return 1;
            return a.url.localeCompare(b.url);
        });
    }
    /**
     * Plain PHP: scan all .php files and map them to routes
     */
    async discoverPlainPhpRoutes(cwd) {
        shared_1.logger.debug('PHP Plugin (Plain): scanning .php files...');
        const descriptors = [];
        const routeSet = new Set();
        const phpFiles = await (0, fast_glob_1.default)('**/*.php', {
            cwd,
            absolute: true,
            ignore: [
                '**/vendor/**',
                '**/node_modules/**',
                '**/.git/**',
                '**/.uvt/**',
                '**/uvt-packages/**',
                '**/config/**',
                '**/includes/**',
                '**/helpers/**'
            ]
        });
        for (const file of phpFiles) {
            const relativeFile = path.relative(cwd, file).replace(/\\/g, '/');
            let routePath = '/' + relativeFile;
            if (relativeFile === 'index.php') {
                routePath = '/';
            }
            if (!routeSet.has(routePath)) {
                routeSet.add(routePath);
                descriptors.push({
                    name: this.pathToName(relativeFile.replace(/\.php$/, '')),
                    url: routePath,
                    sourceFile: file
                });
            }
        }
        if (!routeSet.has('/')) {
            descriptors.unshift({ name: 'Home', url: '/' });
        }
        return descriptors.sort((a, b) => {
            if (a.url === '/')
                return -1;
            if (b.url === '/')
                return 1;
            return a.url.localeCompare(b.url);
        });
    }
    pathToName(routePath) {
        if (routePath === '/' || routePath === 'index')
            return 'Home';
        const cleaned = routePath
            .replace(/^\//, '')
            .replace(/\.php$/, '')
            .split('/')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
        return cleaned || 'Home';
    }
}
exports.PhpFrameworkPlugin = PhpFrameworkPlugin;
//# sourceMappingURL=index.js.map