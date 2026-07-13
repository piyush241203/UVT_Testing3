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
exports.ServerModelDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Infers the server model, dev server start command, output directory,
 * and lockfile glob pattern from repository signals.
 */
class ServerModelDetector {
    name = 'ServerModelDetector';
    async detect(context) {
        const deps = context.dependencies;
        const pkg = context.packageJson;
        const cwd = context.cwd;
        let serverModel = 'static';
        let devServerCommand = 'npx vite --port 3000 --strictPort &';
        let outputDir = 'dist';
        let lockfileGlob = '**/package-lock.json';
        const evidence = [];
        // --- Server Model ---
        if (deps['next']) {
            serverModel = 'SSR';
            // Next.js serves from .next after `next build && next start`
            devServerCommand = 'npx next start -p 3000 &';
            outputDir = '.next';
            evidence.push('Next.js: SSR server, starts with `next start`.');
        }
        else if (deps['nuxt'] || deps['@nuxt/kit']) {
            serverModel = 'SSR';
            devServerCommand = 'npx nuxt start --port 3000 &';
            outputDir = '.output';
            evidence.push('Nuxt.js: SSR server, starts with `nuxt start`.');
        }
        else if (deps['@remix-run/react']) {
            serverModel = 'Node';
            devServerCommand = 'npx remix dev --port 3000 &';
            outputDir = 'build';
            evidence.push('Remix: Node server, starts with `remix dev`.');
        }
        else if (deps['astro']) {
            serverModel = 'SSR';
            devServerCommand = 'npx astro dev --port 3000 &';
            outputDir = 'dist';
            evidence.push('Astro: SSR/SSG, starts with `astro dev`.');
        }
        else if (deps['gatsby']) {
            serverModel = 'static';
            devServerCommand = 'npx gatsby serve --port 3000 &';
            outputDir = 'public';
            evidence.push('Gatsby: static serve, starts with `gatsby serve`.');
        }
        else if (deps['@angular/cli'] || deps['@angular/core']) {
            serverModel = 'dev-server';
            devServerCommand = 'npx ng serve --port 3000 &';
            outputDir = 'dist';
            evidence.push('Angular: dev-server, starts with `ng serve`.');
        }
        else if (deps['@sveltejs/kit']) {
            serverModel = 'SSR';
            devServerCommand = 'npx vite preview --port 3000 &';
            outputDir = 'build';
            evidence.push('SvelteKit: Vite-based, starts with `vite preview`.');
        }
        else if (deps['vite'] || deps['react'] || deps['vue'] || deps['svelte']) {
            // Generic Vite SPA
            serverModel = 'dev-server';
            devServerCommand = 'npx vite preview --port 3000 --strictPort &';
            outputDir = 'dist';
            evidence.push('Vite SPA: serves built output with `vite preview`.');
        }
        else {
            // Pure static HTML — serve with a lightweight static server
            serverModel = 'static';
            devServerCommand = 'npx http-server . -p 3000 -c-1 &';
            outputDir = '.';
            evidence.push('No framework detected: static HTML server with http-server.');
        }
        // Override with scripts if the project has explicit build/serve scripts
        if (pkg?.scripts?.serve) {
            devServerCommand = `npm run serve &`;
            evidence.push('Found explicit "serve" script in package.json.');
        }
        else if (pkg?.scripts?.start && !deps['next'] && !deps['nuxt']) {
            devServerCommand = `npm run start &`;
            evidence.push('Found explicit "start" script in package.json.');
        }
        // --- Lockfile glob ---
        if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
            lockfileGlob = '**/pnpm-lock.yaml';
            evidence.push('pnpm lockfile found.');
        }
        else if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
            lockfileGlob = '**/yarn.lock';
            evidence.push('yarn lockfile found.');
        }
        else if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) {
            lockfileGlob = '**/bun.lockb';
            evidence.push('bun lockfile found.');
        }
        context.capabilities.set('serverModel', {
            id: 'serverModel',
            type: 'serverModel',
            name: serverModel,
            confidence: 0.9,
            evidence,
            dependencies: []
        });
        context.capabilities.set('devServerCommand', {
            id: 'devServerCommand',
            type: 'devServerCommand',
            name: devServerCommand,
            confidence: 0.9,
            evidence,
            dependencies: []
        });
        context.capabilities.set('outputDir', {
            id: 'outputDir',
            type: 'outputDir',
            name: outputDir,
            confidence: 0.9,
            evidence,
            dependencies: []
        });
        context.capabilities.set('lockfileGlob', {
            id: 'lockfileGlob',
            type: 'lockfileGlob',
            name: lockfileGlob,
            confidence: 0.9,
            evidence,
            dependencies: []
        });
    }
}
exports.ServerModelDetector = ServerModelDetector;
//# sourceMappingURL=detector.js.map