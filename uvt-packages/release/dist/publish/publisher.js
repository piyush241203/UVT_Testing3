"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleasePublisher = void 0;
const gatekeeper_js_1 = require("../verify/gatekeeper.js");
const generator_js_1 = require("../changelog/generator.js");
class ReleasePublisher {
    async dryRun() {
        const gatekeeper = new gatekeeper_js_1.ReleaseGatekeeper();
        const changelog = new generator_js_1.ChangelogGenerator();
        await gatekeeper.verifyGates();
        return await changelog.generateChangelog('next');
    }
    async publish() {
    }
}
exports.ReleasePublisher = ReleasePublisher;
//# sourceMappingURL=publisher.js.map