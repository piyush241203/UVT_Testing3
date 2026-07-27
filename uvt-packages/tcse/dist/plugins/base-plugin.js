"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTCSEPlugin = void 0;
class BaseTCSEPlugin {
    version = '1.0.0';
    enabled = true;
    async initialize(context) {
        context.logger?.debug?.(`BaseTCSEPlugin [${this.name}]: Initialized.`);
    }
    async detect(context) {
        return [];
    }
    async evaluate(signals, context) {
        return [];
    }
    async dispose() { }
}
exports.BaseTCSEPlugin = BaseTCSEPlugin;
//# sourceMappingURL=base-plugin.js.map