"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncManager = void 0;
class SyncManager {
    queue;
    remote;
    auth;
    constructor(queue, remote, auth) {
        this.queue = queue;
        this.remote = remote;
        this.auth = auth;
    }
    async processQueue() {
        const isAuthenticated = await this.auth.isAuthenticated();
        if (!isAuthenticated) {
            throw new Error('Not authenticated. Cannot sync to cloud. Use "uvt login" first.');
        }
        const tasks = this.queue.getPendingTasks();
        let processed = 0;
        let failed = 0;
        for (const task of tasks) {
            this.queue.updateTask(task.id, 'syncing');
            try {
                let success = false;
                if (task.operation === 'upload') {
                    // Mock uploading local payload
                    const payload = { mock: true, id: task.resourceId };
                    success = await this.remote.uploadArtifact(task.resourceType, task.resourceId, payload);
                }
                else if (task.operation === 'download') {
                    await this.remote.downloadArtifact(task.resourceType, task.resourceId);
                    success = true;
                }
                if (success) {
                    this.queue.updateTask(task.id, 'completed');
                    processed++;
                }
                else {
                    this.queue.updateTask(task.id, 'failed', task.retryCount + 1);
                    failed++;
                }
            }
            catch (err) {
                this.queue.updateTask(task.id, 'failed', task.retryCount + 1);
                failed++;
            }
        }
        return { processed, failed };
    }
    getStatus() {
        const tasks = this.queue.getPendingTasks();
        return {
            pendingUploads: tasks.filter(t => t.operation === 'upload').length,
            pendingDownloads: tasks.filter(t => t.operation === 'download').length,
        };
    }
}
exports.SyncManager = SyncManager;
//# sourceMappingURL=sync-manager.js.map