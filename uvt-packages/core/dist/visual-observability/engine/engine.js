"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualObservabilityEngine = void 0;
const models_js_1 = require("../models/models.js");
const json_exporter_js_1 = require("../exporters/json-exporter.js");
const chrome_trace_exporter_js_1 = require("../exporters/chrome-trace-exporter.js");
const tracer_js_1 = require("../trace/tracer.js");
class VisualObservabilityEngine {
    config;
    exporters = [];
    constructor(config) {
        this.config = { ...models_js_1.DEFAULT_OBSERVABILITY_CONFIG, ...config };
        if (this.config.exportJson) {
            this.exporters.push(new json_exporter_js_1.JsonExporter());
        }
        if (this.config.exportChromeTrace) {
            this.exporters.push(new chrome_trace_exporter_js_1.ChromeTraceExporter());
        }
    }
    createTracer(traceId) {
        return new tracer_js_1.Tracer(traceId, 'run-' + Date.now());
    }
    async exportTrace(tracer, context) {
        if (!this.config.enabled || !this.config.tracing)
            return;
        const trace = tracer.buildTrace();
        const fp = context.runtimeMetadata.get('repositoryFingerprint');
        if (fp) {
            trace.repositoryFingerprint = fp.id;
        }
        context.logger.info(`VOE: Exporting trace ${trace.traceId}...`);
        for (const exporter of this.exporters) {
            try {
                await exporter.export(trace);
            }
            catch (e) {
                context.logger.warn(`VOE: Failed to export trace: ${e.message}`);
            }
        }
    }
}
exports.VisualObservabilityEngine = VisualObservabilityEngine;
//# sourceMappingURL=engine.js.map