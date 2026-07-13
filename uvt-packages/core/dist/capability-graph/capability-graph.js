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
exports.CapabilityGraphBuilder = void 0;
/**
 * Capability Graph Engine (CGE) — RC-04 URAE
 *
 * Normalizes a raw RepositoryScanResult into a typed, semantically
 * rich CapabilityGraph. Every downstream engine (Generator Planner,
 * CLI init, Artifact Validator) consumes this graph — never raw strings.
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// ============================================================
// CapabilityGraphBuilder
// ============================================================
class CapabilityGraphBuilder {
    /**
     * Build a fully typed CapabilityGraph from a raw RIE scan result.
     */
    static build(scan, cwd) {
        const m = scan.metadata;
        return {
            framework: CapabilityGraphBuilder.buildFramework(m),
            routing: CapabilityGraphBuilder.buildRouting(m),
            build: CapabilityGraphBuilder.buildBuild(m, cwd),
            workspace: CapabilityGraphBuilder.buildWorkspace(m, cwd),
            packageManager: CapabilityGraphBuilder.buildPackageManager(m, cwd),
            devServer: CapabilityGraphBuilder.buildDevServer(m),
            provider: CapabilityGraphBuilder.buildProvider(),
            ci: CapabilityGraphBuilder.buildCI(cwd),
            projectType: { type: m.projectType }
        };
    }
    static buildFramework(m) {
        const name = m.framework;
        // Normalize to a plugin key
        let pluginName = 'html';
        if (name.toLowerCase().includes('react'))
            pluginName = 'react';
        else if (name.toLowerCase().includes('next'))
            pluginName = 'next';
        else if (name.toLowerCase().includes('vue'))
            pluginName = 'vue';
        else if (name.toLowerCase().includes('angular'))
            pluginName = 'angular';
        else if (name.toLowerCase().includes('svelte'))
            pluginName = 'svelte';
        else if (name.toLowerCase().includes('astro'))
            pluginName = 'astro';
        else if (name.toLowerCase().includes('remix'))
            pluginName = 'remix';
        else if (name.toLowerCase().includes('nuxt'))
            pluginName = 'nuxt';
        return { name, confidence: 0.9, pluginName };
    }
    static buildRouting(m) {
        const r = m.routing;
        let model = 'none';
        if (r.includes('React Router') || r.includes('Vue Router') || r.includes('Angular Router') ||
            r.includes('TanStack') || r.includes('Remix') || r.includes('SvelteKit')) {
            model = 'router-library';
        }
        else if (r.includes('Next Router') || r.includes('Next')) {
            model = 'filesystem';
        }
        else if (m.framework === 'Static HTML') {
            model = 'static-html';
        }
        return { model, library: r };
    }
    static buildBuild(m, cwd) {
        const tool = m.buildTool;
        let configFile = '';
        if (tool === 'Vite')
            configFile = 'vite.config.ts';
        else if (tool === 'Webpack')
            configFile = 'webpack.config.js';
        else if (tool === 'Rollup')
            configFile = 'rollup.config.js';
        else if (tool === 'Angular CLI')
            configFile = 'angular.json';
        return { tool, configFile, outputDir: m.outputDir || 'dist' };
    }
    static buildWorkspace(m, cwd) {
        const type = m.workspace;
        const isMonorepo = type !== 'Single Package';
        let lockfile = '';
        const lockfiles = ['pnpm-lock.yaml', 'yarn.lock', 'bun.lockb', 'bun.lock', 'package-lock.json'];
        for (const lf of lockfiles) {
            if (fs.existsSync(path.join(cwd, lf))) {
                lockfile = path.join(cwd, lf);
                break;
            }
        }
        return { type, lockfile, lockfileGlob: m.lockfileGlob || '**/package-lock.json', isMonorepo };
    }
    static buildPackageManager(m, cwd) {
        const pm = m.packageManager.toLowerCase();
        const hasLock = (name) => fs.existsSync(path.join(cwd, name));
        if (pm.includes('pnpm')) {
            return {
                name: 'pnpm',
                installCmd: hasLock('pnpm-lock.yaml') ? 'pnpm install --frozen-lockfile' : 'pnpm install',
                addDevCmd: 'pnpm add -D',
                runCmd: 'pnpm exec'
            };
        }
        else if (pm.includes('yarn')) {
            return {
                name: 'yarn',
                installCmd: hasLock('yarn.lock') ? 'yarn install --frozen-lockfile' : 'yarn install',
                addDevCmd: 'yarn add -D',
                runCmd: 'yarn'
            };
        }
        else if (pm.includes('bun')) {
            return {
                name: 'bun',
                installCmd: hasLock('bun.lockb') || hasLock('bun.lock') ? 'bun install --frozen-lockfile' : 'bun install',
                addDevCmd: 'bun add -d',
                runCmd: 'bunx'
            };
        }
        // npm default
        return {
            name: 'npm',
            installCmd: hasLock('package-lock.json') ? 'npm ci' : 'npm install',
            addDevCmd: 'npm install --save-dev',
            runCmd: 'npx'
        };
    }
    static buildDevServer(m) {
        return {
            serverModel: m.serverModel,
            startCommand: m.devServerCommand,
            healthCheckUrl: 'http://localhost:3000',
            port: 3000
        };
    }
    static buildProvider() {
        const configured = !!process.env.PERCY_TOKEN;
        return {
            name: 'percy',
            configured,
            cliPackage: '@percy/cli',
            sdkPackage: '@percy/playwright'
        };
    }
    static buildCI(cwd) {
        const ghWorkflowPath = path.join(cwd, '.github', 'workflows', 'uvt.yml');
        const glWorkflowPath = path.join(cwd, '.gitlab-ci.yml');
        if (fs.existsSync(ghWorkflowPath)) {
            return { platform: 'github', workflowExists: true, workflowPath: ghWorkflowPath };
        }
        else if (fs.existsSync(glWorkflowPath)) {
            return { platform: 'gitlab', workflowExists: true, workflowPath: glWorkflowPath };
        }
        const ghDir = path.join(cwd, '.github', 'workflows');
        return {
            platform: 'github',
            workflowExists: false,
            workflowPath: path.join(ghDir, 'uvt.yml')
        };
    }
}
exports.CapabilityGraphBuilder = CapabilityGraphBuilder;
//# sourceMappingURL=capability-graph.js.map