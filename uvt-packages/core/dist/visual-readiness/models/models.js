"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_READINESS_CONFIG = void 0;
exports.DEFAULT_READINESS_CONFIG = {
    enabled: true,
    profile: 'balanced',
    maxWait: 5000,
    networkIdle: 500,
    mutationStable: 300,
    waitFonts: true,
    waitImages: true,
    waitHydration: true,
    ignoreEndpoints: ['/analytics', '/telemetry']
};
//# sourceMappingURL=models.js.map