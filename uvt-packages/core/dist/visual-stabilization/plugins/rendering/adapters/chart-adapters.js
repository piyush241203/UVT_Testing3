"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartAdapter = void 0;
const models_js_1 = require("../../../models/models.js");
class ChartAdapter {
    supports(signal) {
        return signal.tags?.includes('HAS_CHART') || false;
    }
    plan(signal, config, pluginId) {
        if (!config.freezeCharts)
            return [];
        const actions = [];
        for (const evidence of signal.evidence || []) {
            const ev = evidence;
            if (ev.type === 'dom-selector' && ev.value) {
                actions.push({
                    pluginId,
                    selector: ev.value,
                    strategy: 'FreezeCanvas',
                    priority: models_js_1.PluginPriority.High,
                    reason: 'Freeze Dynamic Chart Canvas'
                });
            }
        }
        return actions;
    }
}
exports.ChartAdapter = ChartAdapter;
//# sourceMappingURL=chart-adapters.js.map