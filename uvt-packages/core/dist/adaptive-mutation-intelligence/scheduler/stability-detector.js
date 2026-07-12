"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StabilityDetector = void 0;
class StabilityDetector {
    static getConfig(mode) {
        switch (mode) {
            case 'fast':
                return { maxDurationMs: 1000, stabilityWindowMs: 150 };
            case 'strict':
                return { maxDurationMs: 5000, stabilityWindowMs: 1000 };
            case 'balanced':
            default:
                return { maxDurationMs: 2500, stabilityWindowMs: 300 };
        }
    }
}
exports.StabilityDetector = StabilityDetector;
//# sourceMappingURL=stability-detector.js.map