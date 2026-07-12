"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryIntelligenceEngine = void 0;
const rie_cache_js_1 = require("../cache/rie-cache.js");
const parser_js_1 = require("../dependency/parser.js");
const detector_js_1 = require("../package-manager/detector.js");
const detector_js_2 = require("../workspace/detector.js");
const detector_js_3 = require("../framework/detector.js");
const detector_js_4 = require("../build/detector.js");
const detector_js_5 = require("../routing/detector.js");
const detector_js_6 = require("../styling/detector.js");
const detector_js_7 = require("../animation/detector.js");
const detector_js_8 = require("../auth/detector.js");
const detector_js_9 = require("../realtime/detector.js");
const detector_js_10 = require("../charts/detector.js");
const detector_js_11 = require("../maps/detector.js");
const detector_js_12 = require("../analytics/detector.js");
const detector_js_13 = require("../payments/detector.js");
const detector_js_14 = require("../testing/detector.js");
const detector_js_15 = require("../cms/detector.js");
const index_js_1 = require("../../dynamic-engine/index.js");
class RepositoryIntelligenceEngine {
    cache;
    detectors;
    constructor(cwd) {
        this.cache = new rie_cache_js_1.RIECache(cwd);
        this.detectors = [
            new detector_js_1.PackageManagerDetector(),
            new detector_js_2.WorkspaceDetector(),
            new detector_js_3.FrameworkDetector(),
            new detector_js_4.BuildToolDetector(),
            new detector_js_5.RoutingDetector(),
            new detector_js_6.StylingDetector(),
            new detector_js_7.AnimationDetector(),
            new detector_js_8.AuthDetector(),
            new detector_js_9.RealtimeDetector(),
            new detector_js_10.ChartsDetector(),
            new detector_js_11.MapsDetector(),
            new detector_js_12.AnalyticsDetector(),
            new detector_js_13.PaymentsDetector(),
            new detector_js_14.TestingDetector(),
            new detector_js_15.CMSDetector()
        ];
    }
    async scan(cwd, force = false) {
        if (!force) {
            const cached = this.cache.get(cwd);
            if (cached) {
                return cached;
            }
        }
        const context = await parser_js_1.DependencyParser.createContext(cwd);
        await Promise.all(this.detectors.map(d => d.detect(context)));
        const graph = Array.from(context.capabilities.values());
        const metadata = {
            framework: context.capabilities.get('framework')?.name || 'Static HTML',
            buildTool: context.capabilities.get('buildTool')?.name || 'Unknown',
            packageManager: context.capabilities.get('package-manager')?.name || 'npm',
            workspace: context.capabilities.get('workspace')?.name || 'Single Package',
            routing: context.capabilities.get('routing')?.name || 'None',
            styling: context.capabilities.get('styling')?.name || 'Vanilla CSS',
            auth: context.capabilities.get('auth')?.name || 'None',
            realtime: context.capabilities.get('realtime')?.name || 'None',
            charts: context.capabilities.get('charts')?.name || 'None',
            maps: context.capabilities.get('maps')?.name || 'None',
            analytics: context.capabilities.get('analytics')?.name || 'None',
            payments: context.capabilities.get('payments')?.name || 'None',
            testing: context.capabilities.get('testing')?.name || 'None',
            cms: context.capabilities.get('cms')?.name || 'None',
            animation: context.capabilities.get('animation')?.name || 'None'
        };
        const signals = [];
        // Map frameworks to signals
        if (metadata.framework !== 'Static HTML') {
            signals.push({
                id: `rie-framework-${Date.now()}`,
                analyzerId: 'rie',
                analyzerType: 'repository',
                framework: metadata.framework,
                category: index_js_1.SignalCategory.FRAMEWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                timestamp: Date.now(),
                reasoning: `Repository relies on ${metadata.framework}`,
                evidence: (context.capabilities.get('framework')?.evidence || []),
                metadata: { framework: metadata.framework },
                tags: ['framework']
            });
        }
        // Map specific capabilities to generic capability signals
        const capabilityKeys = ['charts', 'maps', 'realtime', 'auth', 'animation', 'payments'];
        for (const key of capabilityKeys) {
            const val = metadata[key];
            if (val && val !== 'None' && val !== 'None / Custom') {
                signals.push({
                    id: `rie-cap-${key}-${Date.now()}`,
                    analyzerId: 'rie',
                    analyzerType: 'repository',
                    framework: metadata.framework,
                    category: index_js_1.SignalCategory.CUSTOM,
                    confidence: 100,
                    severity: index_js_1.SignalSeverity.INFO,
                    executionPhase: index_js_1.ExecutionPhase.INITIALIZATION,
                    timestamp: Date.now(),
                    reasoning: `Repository uses ${val} for ${key}`,
                    evidence: (context.capabilities.get(key)?.evidence || []),
                    metadata: { capability: key, provider: val },
                    tags: [`capability:${key}`, `provider:${val}`]
                });
            }
        }
        const result = {
            metadata,
            graph,
            signals
        };
        this.cache.set(cwd, result);
        return result;
    }
}
exports.RepositoryIntelligenceEngine = RepositoryIntelligenceEngine;
//# sourceMappingURL=rie-engine.js.map