"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticNetworkIntelligenceEngine = void 0;
const cache_js_1 = require("../cache/cache.js");
const rest_js_1 = require("../protocols/rest.js");
const graphql_js_1 = require("../protocols/graphql.js");
const websocket_js_1 = require("../protocols/websocket.js");
const stream_js_1 = require("../protocols/stream.js");
const playwright_interceptor_js_1 = require("../interceptors/playwright-interceptor.js");
class SemanticNetworkIntelligenceEngine {
    cache = new cache_js_1.SNIECache();
    protocols = [];
    interceptor;
    signals = [];
    endpoints = [];
    constructor() {
        this.protocols.push(new graphql_js_1.GraphQLProtocol(), // Check GraphQL first
        new stream_js_1.StreamProtocol(), new websocket_js_1.WebSocketProtocol(), new rest_js_1.RestProtocol() // Fallback to REST
        );
    }
    attach(page) {
        this.interceptor = new playwright_interceptor_js_1.PlaywrightInterceptor(page, this.protocols, this.cache, (signal) => this.signals.push(signal), (schema) => this.endpoints.push(schema));
        this.interceptor.attach();
    }
    detach() {
        if (this.interceptor) {
            this.interceptor.detach();
        }
    }
    getMetadata() {
        const detectedProtocols = Array.from(new Set(this.endpoints.map(e => e.protocol)));
        let dynamicFieldsCount = 0;
        this.endpoints.forEach(e => {
            dynamicFieldsCount += Object.keys(e.dynamicFields).length;
        });
        const hasAuthentication = this.signals.some(s => s.tags?.includes('USES_AUTHENTICATION'));
        const hasRealtime = this.signals.some(s => s.tags?.includes('USES_REALTIME_STREAM'));
        return {
            endpoints: this.endpoints,
            detectedProtocols,
            dynamicFieldsCount,
            hasAuthentication,
            hasRealtime
        };
    }
}
exports.SemanticNetworkIntelligenceEngine = SemanticNetworkIntelligenceEngine;
//# sourceMappingURL=engine.js.map