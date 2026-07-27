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
exports.RepoHealthAnalyzer = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class RepoHealthAnalyzer {
    analyze(cwd = process.cwd()) {
        const deductions = [];
        let score = 100;
        const pkgPath = path.join(cwd, 'package.json');
        const composerPath = path.join(cwd, 'composer.json');
        if (!fs.existsSync(pkgPath) && !fs.existsSync(composerPath)) {
            score -= 40;
            deductions.push({
                metricKey: 'repoHealth',
                metricName: 'Repository Health',
                pointsLost: 40,
                reason: 'Missing package.json and composer.json project manifest files.',
                recommendation: 'Initialize npm (npm init) or composer (composer init) to establish project dependencies.'
            });
        }
        const hasLockfile = fs.existsSync(path.join(cwd, 'package-lock.json')) ||
            fs.existsSync(path.join(cwd, 'pnpm-lock.yaml')) ||
            fs.existsSync(path.join(cwd, 'yarn.lock')) ||
            fs.existsSync(path.join(cwd, 'composer.lock'));
        if (!hasLockfile) {
            score -= 20;
            deductions.push({
                metricKey: 'repoHealth',
                metricName: 'Repository Health',
                pointsLost: 20,
                reason: 'No frozen lockfile found (package-lock.json, pnpm-lock.yaml, yarn.lock, composer.lock).',
                recommendation: 'Run your package manager install to generate a deterministic lockfile for CI builds.'
            });
        }
        const gitDir = path.join(cwd, '.git');
        if (!fs.existsSync(gitDir)) {
            score -= 10;
            deductions.push({
                metricKey: 'repoHealth',
                metricName: 'Repository Health',
                pointsLost: 10,
                reason: 'Repository is not initialized with Git (.git directory missing).',
                recommendation: 'Initialize git repository (git init) for selective testing and branch tracking.'
            });
        }
        score = Math.max(0, score);
        return {
            key: 'repoHealth',
            name: 'Repository Health',
            score,
            weight: 0.15,
            deductions
        };
    }
}
exports.RepoHealthAnalyzer = RepoHealthAnalyzer;
//# sourceMappingURL=analyzer.js.map