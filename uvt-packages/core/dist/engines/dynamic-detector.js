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
exports.DynamicDetector = void 0;
const shared_1 = require("@uvt/shared");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const index_js_1 = require("../dynamic-engine/index.js");
const legacy_network_analyzer_js_1 = require("../dynamic-engine/legacy/legacy-network-analyzer.js");
const legacy_ast_analyzer_js_1 = require("../dynamic-engine/legacy/legacy-ast-analyzer.js");
const legacy_dom_analyzer_js_1 = require("../dynamic-engine/legacy/legacy-dom-analyzer.js");
const legacy_masking_stabilizer_js_1 = require("../dynamic-engine/legacy/legacy-masking-stabilizer.js");
/**
 * Backward compatibility wrapper.
 * Defers all execution to the Dynamic Stabilization Engine (DSE) plugins.
 */
class DynamicDetector {
    networkAnalyzer;
    cachedRegions = [];
    constructor(networkAnalyzer) {
        this.networkAnalyzer = networkAnalyzer;
    }
    async run(page) {
        const registry = new index_js_1.DSERegistry();
        const eventBus = new index_js_1.EventBus();
        const context = new index_js_1.DynamicContext({
            repositoryRoot: process.cwd(),
            frameworkName: 'legacy',
            config: {},
            logger: shared_1.logger,
            page,
            registry,
            eventBus
        });
        const netAnalyzer = new legacy_network_analyzer_js_1.LegacyNetworkAnalyzer(this.networkAnalyzer);
        const astAnalyzer = new legacy_ast_analyzer_js_1.LegacyASTAnalyzer();
        const domAnalyzer = new legacy_dom_analyzer_js_1.LegacyDOMAnalyzer();
        registry.registerAnalyzer(netAnalyzer);
        registry.registerAnalyzer(astAnalyzer);
        registry.registerAnalyzer(domAnalyzer);
        netAnalyzer.initialize(context);
        astAnalyzer.initialize(context);
        domAnalyzer.initialize(context);
        const [netSigs, astSigs, domSigs] = await Promise.all([
            netAnalyzer.analyze(),
            astAnalyzer.analyze(),
            domAnalyzer.analyze()
        ]);
        const allSignals = [...netSigs, ...astSigs, ...domSigs];
        const regions = allSignals.map(sig => {
            let source = 'ast';
            if (sig.category === 'NETWORK')
                source = 'network';
            else if (sig.category === 'CUSTOM' && sig.analyzerType === 'dom')
                source = 'dom';
            return {
                selector: sig.selector,
                source,
                confidence: sig.confidence / 100, // old scale was 0-1
                maskingStrategy: source === 'network' ? 'blur' : (sig.subtype === 'stripe' ? 'opaque' : 'blur')
            };
        });
        this.cachedRegions = regions;
        shared_1.logger.debug(`Dynamic Detector compatibility layer returned ${regions.length} regions.`);
        return regions;
    }
    getLocalDynamicValues(cwd) {
        const values = new Set();
        const extractValuesLocal = (obj) => {
            if (obj === null || obj === undefined)
                return;
            if (typeof obj === 'string') {
                const trimmed = obj.trim();
                if (trimmed.length >= 3 && trimmed.length < 100) {
                    values.add(trimmed);
                }
            }
            else if (typeof obj === 'number') {
                values.add(obj.toString());
            }
            else if (Array.isArray(obj)) {
                for (const item of obj) {
                    extractValuesLocal(item);
                }
            }
            else if (typeof obj === 'object') {
                for (const key in obj) {
                    if (key === 'icon' || key === 'type')
                        continue;
                    try {
                        extractValuesLocal(obj[key]);
                    }
                    catch { }
                }
            }
        };
        const searchDirs = [
            path.join(cwd, 'src', 'data'),
            path.join(cwd, 'data')
        ];
        for (const dataDir of searchDirs) {
            if (fs.existsSync(dataDir)) {
                try {
                    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
                    for (const file of files) {
                        try {
                            const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
                            extractValuesLocal(content);
                        }
                        catch { }
                    }
                }
                catch { }
            }
        }
        return Array.from(values);
    }
    async applyMasking(page, regions, dynamicValues = []) {
        const registry = new index_js_1.DSERegistry();
        const eventBus = new index_js_1.EventBus();
        const context = new index_js_1.DynamicContext({
            repositoryRoot: process.cwd(),
            frameworkName: 'legacy',
            config: {},
            logger: shared_1.logger,
            page,
            registry,
            eventBus
        });
        const stabilizer = new legacy_masking_stabilizer_js_1.LegacyMaskingStabilizer(dynamicValues);
        registry.registerStabilizer(stabilizer);
        stabilizer.initialize(context);
        // Convert legacy regions back to pseudo-signals if needed, but LegacyMaskingStabilizer ignores them anyway
        const mockSignals = regions.map(r => ({
            id: `pseudo-${Date.now()}`,
            analyzerId: 'legacy',
            analyzerType: r.source,
            framework: 'legacy',
            category: 'CUSTOM',
            confidence: (r.confidence * 100),
            severity: 'HIGH',
            executionPhase: 'RENDER',
            timestamp: Date.now(),
            reasoning: 'Legacy wrap',
            evidence: [],
            tags: [],
            metadata: {}
        }));
        await stabilizer.stabilize(mockSignals);
    }
}
exports.DynamicDetector = DynamicDetector;
//# sourceMappingURL=dynamic-detector.js.map