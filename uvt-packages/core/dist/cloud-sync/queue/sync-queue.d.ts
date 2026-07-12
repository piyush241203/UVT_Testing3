import { SyncTask } from '../models/models.js';
export declare class SyncQueue {
    private queueFile;
    constructor(cwd: string);
    private loadQueue;
    private saveQueue;
    enqueue(task: Omit<SyncTask, 'id' | 'retryCount' | 'status' | 'createdAt'>): SyncTask;
    getPendingTasks(): SyncTask[];
    updateTask(taskId: string, status: SyncTask['status'], retryCount?: number): void;
}
//# sourceMappingURL=sync-queue.d.ts.map