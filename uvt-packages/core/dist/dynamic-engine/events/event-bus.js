"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = exports.SnapshotFinishedEvent = exports.SnapshotStartedEvent = exports.StabilizerFinishedEvent = exports.StabilizerStartedEvent = exports.SignalMergedEvent = exports.SignalGeneratedEvent = exports.AnalyzerFailedEvent = exports.AnalyzerCompletedEvent = exports.AnalyzerStartedEvent = exports.PipelineFinishedEvent = exports.PipelineStartedEvent = void 0;
const events_1 = require("events");
class PipelineStartedEvent {
    timestamp;
    constructor(timestamp) {
        this.timestamp = timestamp;
    }
}
exports.PipelineStartedEvent = PipelineStartedEvent;
class PipelineFinishedEvent {
    totalSignals;
    executionTimeMs;
    timestamp;
    constructor(totalSignals, executionTimeMs, timestamp) {
        this.totalSignals = totalSignals;
        this.executionTimeMs = executionTimeMs;
        this.timestamp = timestamp;
    }
}
exports.PipelineFinishedEvent = PipelineFinishedEvent;
class AnalyzerStartedEvent {
    analyzerName;
    timestamp;
    constructor(analyzerName, timestamp) {
        this.analyzerName = analyzerName;
        this.timestamp = timestamp;
    }
}
exports.AnalyzerStartedEvent = AnalyzerStartedEvent;
class AnalyzerCompletedEvent {
    analyzerName;
    signals;
    timestamp;
    constructor(analyzerName, signals, timestamp) {
        this.analyzerName = analyzerName;
        this.signals = signals;
        this.timestamp = timestamp;
    }
}
exports.AnalyzerCompletedEvent = AnalyzerCompletedEvent;
class AnalyzerFailedEvent {
    analyzerName;
    error;
    timestamp;
    constructor(analyzerName, error, timestamp) {
        this.analyzerName = analyzerName;
        this.error = error;
        this.timestamp = timestamp;
    }
}
exports.AnalyzerFailedEvent = AnalyzerFailedEvent;
class SignalGeneratedEvent {
    signal;
    timestamp;
    constructor(signal, timestamp) {
        this.signal = signal;
        this.timestamp = timestamp;
    }
}
exports.SignalGeneratedEvent = SignalGeneratedEvent;
class SignalMergedEvent {
    count;
    timestamp;
    constructor(count, timestamp) {
        this.count = count;
        this.timestamp = timestamp;
    }
}
exports.SignalMergedEvent = SignalMergedEvent;
class StabilizerStartedEvent {
    stabilizerName;
    timestamp;
    constructor(stabilizerName, timestamp) {
        this.stabilizerName = stabilizerName;
        this.timestamp = timestamp;
    }
}
exports.StabilizerStartedEvent = StabilizerStartedEvent;
class StabilizerFinishedEvent {
    stabilizerName;
    result;
    timestamp;
    constructor(stabilizerName, result, timestamp) {
        this.stabilizerName = stabilizerName;
        this.result = result;
        this.timestamp = timestamp;
    }
}
exports.StabilizerFinishedEvent = StabilizerFinishedEvent;
class SnapshotStartedEvent {
    url;
    timestamp;
    constructor(url, timestamp) {
        this.url = url;
        this.timestamp = timestamp;
    }
}
exports.SnapshotStartedEvent = SnapshotStartedEvent;
class SnapshotFinishedEvent {
    url;
    success;
    timestamp;
    constructor(url, success, timestamp) {
        this.url = url;
        this.success = success;
        this.timestamp = timestamp;
    }
}
exports.SnapshotFinishedEvent = SnapshotFinishedEvent;
/**
 * Event Bus system for DSE decoupling using strictly typed event models.
 */
class EventBus {
    emitter = new events_1.EventEmitter();
    constructor() {
        this.emitter.setMaxListeners(50);
    }
    emit(event, payload) {
        this.emitter.emit(event, payload);
    }
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    off(event, listener) {
        this.emitter.off(event, listener);
    }
}
exports.EventBus = EventBus;
//# sourceMappingURL=event-bus.js.map