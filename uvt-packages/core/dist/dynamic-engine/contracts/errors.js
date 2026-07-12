"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ProviderError = exports.PluginError = exports.PipelineError = exports.AnalyzerError = void 0;
class AnalyzerError extends Error {
    analyzerId;
    constructor(analyzerId, message) {
        super(`Analyzer [${analyzerId}] failed: ${message}`);
        this.analyzerId = analyzerId;
        this.name = 'AnalyzerError';
    }
}
exports.AnalyzerError = AnalyzerError;
class PipelineError extends Error {
    phase;
    constructor(message, phase) {
        super(`Pipeline failed during phase [${phase}]: ${message}`);
        this.phase = phase;
        this.name = 'PipelineError';
    }
}
exports.PipelineError = PipelineError;
class PluginError extends Error {
    pluginId;
    constructor(pluginId, message) {
        super(`Plugin [${pluginId}] error: ${message}`);
        this.pluginId = pluginId;
        this.name = 'PluginError';
    }
}
exports.PluginError = PluginError;
class ProviderError extends Error {
    providerId;
    constructor(providerId, message) {
        super(`Provider [${providerId}] error: ${message}`);
        this.providerId = providerId;
        this.name = 'ProviderError';
    }
}
exports.ProviderError = ProviderError;
class ValidationError extends Error {
    field;
    constructor(field, message) {
        super(`Validation failed for [${field}]: ${message}`);
        this.field = field;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=errors.js.map