"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UBMSEngine = void 0;
const filesystem_provider_js_1 = require("../storage/providers/filesystem/filesystem-provider.js");
const build_manager_js_1 = require("../builds/build-manager.js");
const baseline_manager_js_1 = require("../baselines/baseline-manager.js");
class UBMSEngine {
    storage;
    builds;
    baselines;
    constructor(cwd) {
        this.storage = new filesystem_provider_js_1.FilesystemProvider(cwd);
        this.builds = new build_manager_js_1.BuildManager(this.storage);
        this.baselines = new baseline_manager_js_1.BaselineManager(this.storage);
    }
}
exports.UBMSEngine = UBMSEngine;
//# sourceMappingURL=engine.js.map