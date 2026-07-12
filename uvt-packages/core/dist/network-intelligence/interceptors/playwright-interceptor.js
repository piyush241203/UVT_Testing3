"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightInterceptor = void 0;
const schema_builder_js_1 = require("../schema/schema-builder.js");
const field_classifier_js_1 = require("../classifiers/field-classifier.js");
class PlaywrightInterceptor {
    page;
    protocols;
    cache;
    onSignal;
    onSchema;
    constructor(page, protocols, cache, onSignal, onSchema) {
        this.page = page;
        this.protocols = protocols;
        this.cache = cache;
        this.onSignal = onSignal;
        this.onSchema = onSchema;
    }
    attach() {
        this.page.on('request', this.handleRequest.bind(this));
        this.page.on('response', this.handleResponse.bind(this));
    }
    detach() {
        this.page.off('request', this.handleRequest.bind(this));
        this.page.off('response', this.handleResponse.bind(this));
    }
    handleRequest(request) {
        // Non-blocking interceptor
        const url = request.url();
        const method = request.method();
        const headers = request.headers();
        // WebSockets have no classic HTTP response in playwright's 'response' event sometimes
        if (url.startsWith('ws://') || url.startsWith('wss://')) {
            const handler = this.protocols.find(p => p.supports(url, headers));
            if (handler) {
                const signals = handler.analyzeResponse(url, method, headers, null);
                signals.forEach(s => this.onSignal(s));
            }
        }
    }
    async handleResponse(response) {
        try {
            const url = response.url();
            const method = response.request().method();
            const headers = response.headers();
            const signature = schema_builder_js_1.SchemaBuilder.buildSignature(method, url);
            // Skip static assets
            if (url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i))
                return;
            const handler = this.protocols.find(p => p.supports(url, headers));
            if (!handler)
                return;
            // Only parse JSON bodies
            let payload = null;
            if ((headers['content-type'] || '').includes('application/json')) {
                try {
                    payload = await response.json();
                }
                catch { /* ignore parse errors */ }
            }
            // Generate semantic signals
            const signals = handler.analyzeResponse(url, method, headers, payload);
            signals.forEach(s => this.onSignal(s));
            // Build Schema if not cached
            if (payload && !this.cache.has(signature)) {
                const rawSchema = schema_builder_js_1.SchemaBuilder.inferSchema(payload);
                const dynamicFields = {};
                for (const [key, type] of Object.entries(rawSchema)) {
                    const fieldName = key.split('.').pop() || '';
                    const classification = field_classifier_js_1.FieldClassifier.classify(fieldName);
                    if (classification.isDynamic) {
                        dynamicFields[key] = classification;
                    }
                }
                const schema = {
                    url,
                    method,
                    signature,
                    responseSchema: rawSchema,
                    dynamicFields,
                    protocol: handler.name
                };
                this.cache.set(signature, schema);
                this.onSchema(schema);
            }
        }
        catch (e) {
            // Avoid breaking Playwright loop
        }
    }
}
exports.PlaywrightInterceptor = PlaywrightInterceptor;
//# sourceMappingURL=playwright-interceptor.js.map