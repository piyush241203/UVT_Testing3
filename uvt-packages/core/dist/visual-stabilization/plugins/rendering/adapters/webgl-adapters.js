"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLAdapter = void 0;
const models_js_1 = require("../../../models/models.js");
class WebGLAdapter {
    supports(signal) {
        return signal.tags?.includes('HAS_WEBGL') || signal.tags?.includes('HAS_RENDER_LOOP') || false;
    }
    plan(signal, config, pluginId) {
        if (!config.freezeWebGL && !config.pauseRenderLoops)
            return [];
        const actions = [];
        for (const evidence of signal.evidence || []) {
            const ev = evidence;
            if (ev.type === 'dom-selector' && ev.value) {
                actions.push({
                    pluginId,
                    selector: ev.value,
                    strategy: 'PauseRenderLoop',
                    priority: models_js_1.PluginPriority.Critical,
                    reason: 'Pause WebGL Render Loop'
                });
            }
        }
        return actions;
    }
}
exports.WebGLAdapter = WebGLAdapter;
//# sourceMappingURL=webgl-adapters.js.map