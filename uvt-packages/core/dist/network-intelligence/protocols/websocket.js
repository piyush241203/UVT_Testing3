"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketProtocol = void 0;
const index_js_1 = require("../../dynamic-engine/index.js");
class WebSocketProtocol {
    name = 'WebSocket';
    supports(url, headers) {
        return url.startsWith('ws://') || url.startsWith('wss://');
    }
    analyzeRequest(url, method, headers, postData) { }
    analyzeResponse(url, method, headers, payload) {
        const signals = [];
        const ts = Date.now();
        signals.push({
            id: `snie-ws-${ts}`,
            analyzerId: 'snie',
            analyzerType: 'network',
            framework: 'unknown',
            category: index_js_1.SignalCategory.NETWORK,
            confidence: 100,
            severity: index_js_1.SignalSeverity.INFO,
            executionPhase: index_js_1.ExecutionPhase.RENDER,
            timestamp: ts,
            reasoning: 'Detected WebSocket realtime stream',
            evidence: [{ type: 'network-url', value: url }],
            metadata: {},
            tags: ['USES_REALTIME_STREAM']
        });
        return signals;
    }
}
exports.WebSocketProtocol = WebSocketProtocol;
//# sourceMappingURL=websocket.js.map