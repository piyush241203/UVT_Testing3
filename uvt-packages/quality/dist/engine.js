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
exports.AutomationQualityEngine = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const analyzer_js_1 = require("./analyzer.js");
const confidence_js_1 = require("./confidence.js");
class AutomationQualityEngine {
    healthAnalyzer;
    confidenceCalculator;
    constructor() {
        this.healthAnalyzer = new analyzer_js_1.RepoHealthAnalyzer();
        this.confidenceCalculator = new confidence_js_1.ConfidenceCalculator();
    }
    evaluate(input = {}) {
        const cwd = input.cwd || process.cwd();
        const env = input.env || process.env;
        const metrics = {};
        // 1. Repository Health (Weight 0.15)
        metrics.repoHealth = this.healthAnalyzer.analyze(cwd);
        // 2. Framework Confidence (Weight 0.15)
        metrics.frameworkConfidence = this.confidenceCalculator.calculateFrameworkConfidence(input.frameworkName, input.frameworkConfidence);
        // 3. Routing Confidence (Weight 0.15)
        metrics.routingConfidence = this.confidenceCalculator.calculateRoutingConfidence(input.routeCount, input.routingStrategy);
        // 4. Generator Accuracy (Weight 0.15)
        metrics.generatorAccuracy = this.evaluateGeneratorAccuracy(cwd);
        // 5. CI Accuracy (Weight 0.10)
        metrics.ciAccuracy = this.evaluateCIAccuracy(cwd);
        // 6. Artifact Accuracy (Weight 0.10)
        metrics.artifactAccuracy = this.evaluateArtifactAccuracy(cwd);
        // 7. Provider Readiness (Weight 0.10)
        metrics.providerReadiness = this.confidenceCalculator.calculateProviderReadiness(cwd, env);
        // 8. Automation Completeness (Weight 0.10)
        metrics.automationCompleteness = this.evaluateAutomationCompleteness(metrics);
        // Calculate Overall Weighted Composite Score
        let overallScore = 0;
        const allDeductions = [];
        for (const key of Object.keys(metrics)) {
            const metric = metrics[key];
            overallScore += metric.score * metric.weight;
            allDeductions.push(...metric.deductions);
        }
        overallScore = Math.round(overallScore);
        let status = 'EXCELLENT';
        if (overallScore < 50)
            status = 'CRITICAL';
        else if (overallScore < 75)
            status = 'NEEDS_ATTENTION';
        else if (overallScore < 90)
            status = 'GOOD';
        return {
            overallScore,
            status,
            metrics,
            allDeductions,
            totalDeductionsCount: allDeductions.length,
            timestamp: Date.now()
        };
    }
    evaluateGeneratorAccuracy(cwd) {
        const deductions = [];
        let score = 100;
        const testsDir = path.join(cwd, 'tests', 'generated');
        if (!fs.existsSync(testsDir)) {
            score -= 30;
            deductions.push({
                metricKey: 'generatorAccuracy',
                metricName: 'Generator Accuracy',
                pointsLost: 30,
                reason: 'Generated test specifications directory (tests/generated) does not exist.',
                recommendation: 'Run "uvt generate" or "uvt test" to auto-create visual regression test specs.'
            });
        }
        score = Math.max(0, score);
        return { key: 'generatorAccuracy', name: 'Generator Accuracy', score, weight: 0.15, deductions };
    }
    evaluateCIAccuracy(cwd) {
        const deductions = [];
        let score = 100;
        const ghaPath = path.join(cwd, '.github', 'workflows', 'uvt.yml');
        if (!fs.existsSync(ghaPath)) {
            score -= 40;
            deductions.push({
                metricKey: 'ciAccuracy',
                metricName: 'CI Accuracy',
                pointsLost: 40,
                reason: 'GitHub Actions workflow artifact (.github/workflows/uvt.yml) missing.',
                recommendation: 'Run "uvt init" to generate framework-aware CI automation workflow.'
            });
        }
        score = Math.max(0, score);
        return { key: 'ciAccuracy', name: 'CI Accuracy', score, weight: 0.10, deductions };
    }
    evaluateArtifactAccuracy(cwd) {
        const deductions = [];
        let score = 100;
        const configPath = path.join(cwd, 'uvt.config.ts');
        if (!fs.existsSync(configPath)) {
            score -= 30;
            deductions.push({
                metricKey: 'artifactAccuracy',
                metricName: 'Artifact Accuracy',
                pointsLost: 30,
                reason: 'UVT configuration file (uvt.config.ts) is missing.',
                recommendation: 'Run "uvt init" to scaffold workspace configuration.'
            });
        }
        score = Math.max(0, score);
        return { key: 'artifactAccuracy', name: 'Artifact Accuracy', score, weight: 0.10, deductions };
    }
    evaluateAutomationCompleteness(metrics) {
        const deductions = [];
        let score = 100;
        // Automation completeness checks whether all required pillars (Repo, CI, Provider, Config) are ready
        if (metrics.ciAccuracy.score < 100 || metrics.providerReadiness.score < 100 || metrics.artifactAccuracy.score < 100) {
            score -= 25;
            deductions.push({
                metricKey: 'automationCompleteness',
                metricName: 'Automation Completeness',
                pointsLost: 25,
                reason: 'Autonomous continuous integration readiness is incomplete due to unconfigured CI or provider secrets.',
                recommendation: 'Complete "uvt init" setup and add PERCY_TOKEN to repository secrets.'
            });
        }
        score = Math.max(0, score);
        return { key: 'automationCompleteness', name: 'Automation Completeness', score, weight: 0.10, deductions };
    }
}
exports.AutomationQualityEngine = AutomationQualityEngine;
//# sourceMappingURL=engine.js.map