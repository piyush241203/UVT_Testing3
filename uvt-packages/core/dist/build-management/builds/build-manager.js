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
exports.BuildManager = void 0;
const crypto = __importStar(require("crypto"));
class BuildManager {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    async startBuild(repoId, branch, commit) {
        const build = {
            buildId: `build-${crypto.randomBytes(4).toString('hex')}`,
            repositoryId: repoId,
            branch,
            commit,
            author: 'local',
            timestamp: new Date().toISOString(),
            framework: 'auto',
            status: 'running',
            snapshotCount: 0,
            duration: 0,
            qualityScore: 0
        };
        await this.storage.saveBuild(build);
        return build;
    }
    async finalizeBuild(buildId, snapshots, durationMs) {
        const build = await this.storage.getBuild(buildId);
        if (!build)
            throw new Error(`Build ${buildId} not found`);
        build.status = 'completed';
        build.snapshotCount = snapshots.length;
        build.duration = durationMs;
        build.qualityScore = snapshots.length ? Math.round(snapshots.reduce((acc, s) => acc + s.qualityScore, 0) / snapshots.length) : 0;
        await this.storage.saveBuild(build);
        for (const s of snapshots) {
            await this.storage.saveSnapshot(s);
        }
        return build;
    }
}
exports.BuildManager = BuildManager;
//# sourceMappingURL=build-manager.js.map