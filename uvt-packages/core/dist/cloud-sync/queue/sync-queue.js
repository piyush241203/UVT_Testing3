"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncQueue = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
class SyncQueue {
    queueFile;
    constructor(cwd) {
        const queueDir = path.join(cwd, '.uvt', 'sync');
        if (!fs.existsSync(queueDir))
            fs.mkdirSync(queueDir, { recursive: true });
        this.queueFile = path.join(queueDir, 'offline-queue.json');
    }
    loadQueue() {
        if (fs.existsSync(this.queueFile)) {
            try {
                return JSON.parse(fs.readFileSync(this.queueFile, 'utf-8'));
            }
            catch {
                return [];
            }
        }
        return [];
    }
    saveQueue(tasks) {
        fs.writeFileSync(this.queueFile, JSON.stringify(tasks, null, 2), 'utf-8');
    }
    enqueue(task) {
        const tasks = this.loadQueue();
        const newTask = {
            ...task,
            id: `task-${crypto.randomBytes(4).toString('hex')}`,
            retryCount: 0,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        tasks.sort((a, b) => b.priority - a.priority);
        this.saveQueue(tasks);
        return newTask;
    }
    getPendingTasks() {
        return this.loadQueue().filter(t => t.status === 'pending' || t.status === 'failed');
    }
    updateTask(taskId, status, retryCount) {
        const tasks = this.loadQueue();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            if (retryCount !== undefined)
                task.retryCount = retryCount;
            if (status === 'completed') {
                const index = tasks.indexOf(task);
                tasks.splice(index, 1);
            }
            this.saveQueue(tasks);
        }
    }
}
exports.SyncQueue = SyncQueue;
//# sourceMappingURL=sync-queue.js.map