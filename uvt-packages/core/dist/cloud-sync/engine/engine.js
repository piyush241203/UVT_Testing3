"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UCSEngine = void 0;
const sync_queue_js_1 = require("../queue/sync-queue.js");
const remote_provider_js_1 = require("../providers/remote/remote-provider.js");
const auth_adapter_js_1 = require("../authentication/auth-adapter.js");
const sync_manager_js_1 = require("../sync/sync-manager.js");
const conflict_resolver_js_1 = require("../conflicts/conflict-resolver.js");
class UCSEngine {
    queue;
    remote;
    auth;
    sync;
    conflict;
    constructor(cwd) {
        this.queue = new sync_queue_js_1.SyncQueue(cwd);
        this.remote = new remote_provider_js_1.MockRemoteProvider();
        this.auth = new auth_adapter_js_1.MockAuthAdapter();
        this.sync = new sync_manager_js_1.SyncManager(this.queue, this.remote, this.auth);
        this.conflict = new conflict_resolver_js_1.ConflictResolver('local-wins');
    }
}
exports.UCSEngine = UCSEngine;
//# sourceMappingURL=engine.js.map