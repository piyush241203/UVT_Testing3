"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityPlanner = void 0;
const models_js_1 = require("../../../models/models.js");
const models_js_2 = require("../models/models.js");
class IdentityPlanner {
    config;
    constructor(config) {
        this.config = { ...models_js_2.DEFAULT_IDENTITY_CONFIG, ...config };
    }
    plan(signals, pluginId) {
        if (!this.config.enabled)
            return [];
        const actions = [];
        for (const signal of signals) {
            if (!signal.evidence)
                continue;
            for (const evidence of signal.evidence) {
                const ev = evidence;
                if (ev.type !== 'dom-selector' || !ev.value)
                    continue;
                const selector = ev.value;
                const tags = signal.tags || [];
                let replacementValue = this.config.uuidPlaceholder;
                if (tags.includes('USES_REQUEST_IDS')) {
                    replacementValue = this.config.requestIdPlaceholder;
                }
                else if (tags.includes('USES_TRANSACTION_IDS')) {
                    replacementValue = this.config.transactionPlaceholder;
                }
                else if (tags.includes('USES_ORDER_IDS')) {
                    replacementValue = this.config.orderPlaceholder;
                }
                else if (tags.includes('USES_INVOICE_IDS')) {
                    replacementValue = this.config.invoicePlaceholder;
                }
                else if (tags.includes('USES_TRACE_IDS')) {
                    replacementValue = this.config.tracePlaceholder;
                }
                else if (this.config.maskHashes && (tags.includes('USES_HASHES') || tags.includes('USES_VERSIONING') || tags.includes('USES_ETAGS') || tags.includes('USES_SIGNATURES'))) {
                    replacementValue = this.config.hashPlaceholder;
                }
                else if (tags.includes('USES_AUTHENTICATION')) {
                    replacementValue = '[TOKEN_MASKED]';
                }
                actions.push({
                    pluginId,
                    selector,
                    strategy: 'Replace',
                    priority: models_js_1.PluginPriority.High,
                    value: replacementValue,
                    reason: 'Identity logic: ' + tags.join(', ')
                });
            }
        }
        return actions;
    }
}
exports.IdentityPlanner = IdentityPlanner;
//# sourceMappingURL=identity-planner.js.map