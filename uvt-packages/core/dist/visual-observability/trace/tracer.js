"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracer = void 0;
class Tracer {
    spans = new Map();
    activeSpans = [];
    traceId;
    runId;
    startTime;
    constructor(traceId, runId) {
        this.traceId = traceId;
        this.runId = runId;
        this.startTime = Date.now();
    }
    startSpan(name, metadata = {}) {
        const id = `span-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const parentId = this.activeSpans.length > 0 ? this.activeSpans[this.activeSpans.length - 1] : undefined;
        const span = {
            id,
            parentId,
            name,
            startTime: Date.now(),
            metadata,
            events: []
        };
        this.spans.set(id, span);
        this.activeSpans.push(id);
        return id;
    }
    endSpan(id) {
        const span = this.spans.get(id);
        if (span && !span.endTime) {
            span.endTime = Date.now();
            span.duration = span.endTime - span.startTime;
        }
        this.activeSpans = this.activeSpans.filter(activeId => activeId !== id);
    }
    addEvent(name, metadata) {
        const event = { name, timestamp: Date.now(), metadata };
        const currentSpanId = this.activeSpans.length > 0 ? this.activeSpans[this.activeSpans.length - 1] : undefined;
        if (currentSpanId) {
            const span = this.spans.get(currentSpanId);
            if (span) {
                span.events.push(event);
            }
        }
    }
    buildTrace() {
        const endTime = Date.now();
        return {
            traceId: this.traceId,
            runId: this.runId,
            startTime: this.startTime,
            endTime,
            duration: endTime - this.startTime,
            spans: Array.from(this.spans.values())
        };
    }
}
exports.Tracer = Tracer;
//# sourceMappingURL=tracer.js.map