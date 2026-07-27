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
exports.ConfidenceCalculator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ConfidenceCalculator {
    calculateProviderReadiness(cwd = process.cwd(), env = process.env) {
        const deductions = [];
        let score = 100;
        const token = env.PERCY_TOKEN;
        if (!token || token.trim().length === 0) {
            score -= 50;
            deductions.push({
                metricKey: 'providerReadiness',
                metricName: 'Provider Readiness',
                pointsLost: 50,
                reason: 'PERCY_TOKEN environment secret is not set.',
                recommendation: 'Export PERCY_TOKEN or configure repository secret to upload visual snapshots to Percy.'
            });
        }
        const nodeModules = path.join(cwd, 'node_modules');
        const hasPlaywright = fs.existsSync(nodeModules) && fs.existsSync(path.join(nodeModules, 'playwright'));
        if (!hasPlaywright) {
            score -= 20;
            deductions.push({
                metricKey: 'providerReadiness',
                metricName: 'Provider Readiness',
                pointsLost: 20,
                reason: 'Playwright browser automation package is not installed in local node_modules.',
                recommendation: 'Run "npm install -D playwright" or "uvt init" to automatically install Playwright.'
            });
        }
        score = Math.max(0, score);
        return {
            key: 'providerReadiness',
            name: 'Provider Readiness',
            score,
            weight: 0.15,
            deductions
        };
    }
    calculateFrameworkConfidence(frameworkName, rawConfidence) {
        const deductions = [];
        const confidencePct = Math.round((rawConfidence || 0.85) * 100);
        let score = confidencePct;
        if (score < 100) {
            const lost = 100 - score;
            deductions.push({
                metricKey: 'frameworkConfidence',
                metricName: 'Framework Confidence',
                pointsLost: lost,
                reason: `Framework detection for "${frameworkName || 'Auto'}" achieved ${confidencePct}% confidence based on file signatures.`,
                recommendation: 'Explicitly specify framework in uvt.config.ts for 100% deterministic binding.'
            });
        }
        return {
            key: 'frameworkConfidence',
            name: 'Framework Confidence',
            score,
            weight: 0.15,
            deductions
        };
    }
    calculateRoutingConfidence(routeCount = 0, routingStrategy = 'auto') {
        const deductions = [];
        let score = 100;
        if (routeCount === 0) {
            score -= 60;
            deductions.push({
                metricKey: 'routingConfidence',
                metricName: 'Routing Confidence',
                pointsLost: 60,
                reason: 'Zero routes discovered in repository AST scan.',
                recommendation: 'Verify page/route source directory location or add explicit routes in uvt.config.ts.'
            });
        }
        else if (routeCount < 3) {
            score -= 15;
            deductions.push({
                metricKey: 'routingConfidence',
                metricName: 'Routing Confidence',
                pointsLost: 15,
                reason: `Only ${routeCount} route(s) discovered. Minimal route coverage detected.`,
                recommendation: 'Ensure all dynamic route parameters are configured in uvt.config.ts.'
            });
        }
        score = Math.max(0, score);
        return {
            key: 'routingConfidence',
            name: 'Routing Confidence',
            score,
            weight: 0.15,
            deductions
        };
    }
}
exports.ConfidenceCalculator = ConfidenceCalculator;
//# sourceMappingURL=confidence.js.map