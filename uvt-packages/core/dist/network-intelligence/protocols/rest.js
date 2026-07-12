"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestProtocol = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
const schema_builder_js_1 = require("../schema/schema-builder.js");
const field_classifier_js_1 = require("../classifiers/field-classifier.js");
class RestProtocol {
    name = 'REST';
    supports(url, headers) {
        return url.startsWith('http') && !url.includes('/graphql');
    }
    analyzeRequest(url, method, headers, postData) { }
    analyzeResponse(url, method, headers, payload) {
        const signals = [];
        const ts = Date.now();
        // Auth Headers
        if (headers['authorization'] || headers['set-cookie']) {
            signals.push({
                id: `snie-auth-${ts}`,
                analyzerId: 'snie',
                analyzerType: 'network',
                framework: 'unknown',
                category: index_js_1.SignalCategory.NETWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.RENDER,
                timestamp: ts,
                reasoning: 'Detected Authentication headers (Authorization or Set-Cookie)',
                evidence: [{ type: 'network-header', value: 'auth' }],
                metadata: {},
                tags: ['USES_AUTHENTICATION']
            });
        }
        if (headers['etag']) {
            signals.push({
                id: `snie-etag-${ts}`,
                analyzerId: 'snie',
                analyzerType: 'network',
                framework: 'unknown',
                category: index_js_1.SignalCategory.NETWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.RENDER,
                timestamp: ts,
                reasoning: 'Detected ETag caching header',
                evidence: [{ type: 'network-header', value: 'etag' }],
                metadata: {},
                tags: ['USES_ETAGS']
            });
        }
        if (payload) {
            const schema = schema_builder_js_1.SchemaBuilder.inferSchema(payload);
            for (const [key, type] of Object.entries(schema)) {
                const fieldName = key.split('.').pop() || '';
                const classification = field_classifier_js_1.FieldClassifier.classify(fieldName);
                if (classification.isDynamic) {
                    signals.push({
                        id: `snie-dyn-${ts}-${Math.random().toString(36).substring(7)}`,
                        analyzerId: 'snie',
                        analyzerType: 'network',
                        framework: 'unknown',
                        category: index_js_1.SignalCategory.NETWORK,
                        confidence: classification.confidence,
                        severity: index_js_1.SignalSeverity.INFO,
                        executionPhase: index_js_1.ExecutionPhase.RENDER,
                        timestamp: ts,
                        reasoning: `Identified dynamic field '${fieldName}' (${classification.category}): ${classification.reason}`,
                        evidence: [{ type: 'network-schema', value: key }],
                        metadata: { field: fieldName, type },
                        tags: [`USES_DYNAMIC_${classification.category.toUpperCase()}`]
                    });
                }
            }
        }
        return signals;
    }
}
exports.RestProtocol = RestProtocol;
//# sourceMappingURL=rest.js.map