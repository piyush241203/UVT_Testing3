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
exports.ProjectTypeDetector = void 0;
const fs = __importStar(require("fs"));
/**
 * Detects the project type: SPA, SSR, SSG, MPA, Hybrid, or Static.
 * Reads dependency and config file signals to infer the rendering model.
 */
class ProjectTypeDetector {
    name = 'ProjectTypeDetector';
    async detect(context) {
        const deps = context.dependencies;
        const cwd = context.cwd;
        let projectType = 'Static';
        const evidence = [];
        // SSR frameworks
        if (deps['next']) {
            // Next.js can be SSR, SSG, or hybrid — treat as Hybrid (can do both)
            projectType = 'Hybrid';
            evidence.push('Next.js detected: supports SSR, SSG, and Static simultaneously (Hybrid).');
        }
        else if (deps['nuxt'] || deps['@nuxt/kit']) {
            projectType = 'Hybrid';
            evidence.push('Nuxt.js detected: supports Hybrid SSR/SSG rendering.');
        }
        else if (deps['@remix-run/react']) {
            projectType = 'SSR';
            evidence.push('Remix detected: server-side rendering model.');
        }
        else if (deps['@sveltejs/kit']) {
            projectType = 'Hybrid';
            evidence.push('SvelteKit detected: supports Hybrid SSR/SSG rendering.');
        }
        else if (deps['astro']) {
            projectType = 'SSG';
            evidence.push('Astro detected: static site generation model.');
        }
        else if (deps['gatsby']) {
            projectType = 'SSG';
            evidence.push('Gatsby detected: static site generation model.');
        }
        else if (deps['react'] || deps['vue'] || deps['@angular/core'] || deps['svelte']) {
            // Vite/CRA based apps are pure SPA
            projectType = 'SPA';
            evidence.push(`Client-side framework (${deps['react'] ? 'React' : deps['vue'] ? 'Vue' : deps['@angular/core'] ? 'Angular' : 'Svelte'}) without SSR wrapper: SPA.`);
        }
        else if (this.hasHtmlFiles(cwd)) {
            // Pure HTML files — multi-page or single-page static
            const htmlCount = this.countHtmlFiles(cwd);
            projectType = htmlCount > 1 ? 'MPA' : 'Static';
            evidence.push(`${htmlCount} HTML file(s) found in root: ${projectType}.`);
        }
        context.capabilities.set('projectType', {
            id: 'projectType',
            type: 'projectType',
            name: projectType,
            confidence: 0.9,
            evidence,
            dependencies: []
        });
    }
    hasHtmlFiles(cwd) {
        try {
            return fs.readdirSync(cwd).some(f => f.endsWith('.html'));
        }
        catch {
            return false;
        }
    }
    countHtmlFiles(cwd) {
        try {
            return fs.readdirSync(cwd).filter(f => f.endsWith('.html')).length;
        }
        catch {
            return 0;
        }
    }
}
exports.ProjectTypeDetector = ProjectTypeDetector;
//# sourceMappingURL=detector.js.map