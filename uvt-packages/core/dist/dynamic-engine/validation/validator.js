"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalValidator = void 0;
const errors_js_1 = require("../contracts/errors.js");
const enums_js_1 = require("../classification/enums.js");
class SignalValidator {
    validate(signal) {
        this.validateRequired(signal);
        this.validateRanges(signal);
        this.validateEnums(signal);
    }
    validateRequired(signal) {
        if (!signal.id)
            throw new errors_js_1.ValidationError('id', 'Signal ID is required.');
        if (!signal.analyzerId)
            throw new errors_js_1.ValidationError('analyzerId', 'Analyzer ID is required.');
        if (!signal.category)
            throw new errors_js_1.ValidationError('category', 'Category is required.');
        if (signal.confidence === undefined)
            throw new errors_js_1.ValidationError('confidence', 'Confidence is required.');
        if (!signal.severity)
            throw new errors_js_1.ValidationError('severity', 'Severity is required.');
        if (!signal.executionPhase)
            throw new errors_js_1.ValidationError('executionPhase', 'ExecutionPhase is required.');
        if (!signal.timestamp)
            throw new errors_js_1.ValidationError('timestamp', 'Timestamp is required.');
    }
    validateRanges(signal) {
        if (signal.confidence < 0 || signal.confidence > 100) {
            throw new errors_js_1.ValidationError('confidence', `Confidence must be between 0 and 100. Got ${signal.confidence}`);
        }
    }
    validateEnums(signal) {
        if (!Object.values(enums_js_1.SignalCategory).includes(signal.category)) {
            throw new errors_js_1.ValidationError('category', `Invalid category: ${signal.category}`);
        }
        if (!Object.values(enums_js_1.SignalSeverity).includes(signal.severity)) {
            throw new errors_js_1.ValidationError('severity', `Invalid severity: ${signal.severity}`);
        }
    }
}
exports.SignalValidator = SignalValidator;
//# sourceMappingURL=validator.js.map