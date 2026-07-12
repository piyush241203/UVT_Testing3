"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualReadinessEngine = void 0;
const models_js_1 = require("../models/models.js");
const readiness_coordinator_js_1 = require("../coordinator/readiness-coordinator.js");
const dom_ready_js_1 = require("../conditions/dom-ready.js");
const fonts_ready_js_1 = require("../conditions/fonts-ready.js");
const images_ready_js_1 = require("../conditions/images-ready.js");
class VisualReadinessEngine {
    config;
    coordinator;
    constructor(config) {
        this.config = { ...models_js_1.DEFAULT_READINESS_CONFIG, ...config };
        const conditions = [new dom_ready_js_1.DOMReadyCondition()];
        if (this.config.waitFonts)
            conditions.push(new fonts_ready_js_1.FontsReadyCondition());
        if (this.config.waitImages)
            conditions.push(new images_ready_js_1.ImagesReadyCondition());
        // In the future, add NetworkIdleCondition, FrameworkHydrationCondition, etc.
        this.coordinator = new readiness_coordinator_js_1.ReadinessCoordinator(this.config, conditions);
    }
    async checkReadiness(page) {
        return this.coordinator.waitForReadiness(page);
    }
}
exports.VisualReadinessEngine = VisualReadinessEngine;
//# sourceMappingURL=engine.js.map