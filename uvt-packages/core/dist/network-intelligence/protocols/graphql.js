"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLProtocol = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class GraphQLProtocol {
    name = 'GraphQL';
    supports(url, headers) {
        return url.includes('/graphql') || (headers['content-type'] || '').includes('graphql');
    }
    analyzeRequest(url, method, headers, postData) { }
    analyzeResponse(url, method, headers, payload) {
        const signals = [];
        const ts = Date.now();
        if (payload && (payload.data || payload.errors)) {
            signals.push({
                id: `snie-graphql-${ts}`,
                analyzerId: 'snie',
                analyzerType: 'network',
                framework: 'unknown',
                category: index_js_1.SignalCategory.NETWORK,
                confidence: 100,
                severity: index_js_1.SignalSeverity.INFO,
                executionPhase: index_js_1.ExecutionPhase.RENDER,
                timestamp: ts,
                reasoning: 'Detected GraphQL payload',
                evidence: [{ type: 'network-url', value: url }],
                metadata: {},
                tags: ['USES_GRAPHQL']
            });
        }
        return signals;
    }
}
exports.GraphQLProtocol = GraphQLProtocol;
//# sourceMappingURL=graphql.js.map