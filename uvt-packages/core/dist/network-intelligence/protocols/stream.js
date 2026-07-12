"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamProtocol = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class StreamProtocol {
    name = 'Stream';
    supports(url, headers) {
        const contentType = headers['content-type'] || '';
        return contentType.includes('text/event-stream') || contentType.includes('application/stream+json');
    }
    analyzeRequest(url, method, headers, postData) { }
    analyzeResponse(url, method, headers, payload) {
        const signals = [];
        const ts = Date.now();
        signals.push({
            id: `snie-stream-${ts}`,
            analyzerId: 'snie',
            analyzerType: 'network',
            framework: 'unknown',
            category: index_js_1.SignalCategory.NETWORK,
            confidence: 100,
            severity: index_js_1.SignalSeverity.INFO,
            executionPhase: index_js_1.ExecutionPhase.RENDER,
            timestamp: ts,
            reasoning: 'Detected Server-Sent Events (SSE) or streaming payload',
            evidence: [{ type: 'network-url', value: url }],
            metadata: {},
            tags: ['USES_REALTIME_STREAM']
        });
        return signals;
    }
}
exports.StreamProtocol = StreamProtocol;
//# sourceMappingURL=stream.js.map