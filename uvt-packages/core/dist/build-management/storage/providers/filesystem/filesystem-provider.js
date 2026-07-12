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
exports.FilesystemProvider = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class FilesystemProvider {
    baseDir;
    constructor(cwd) {
        this.baseDir = path.join(cwd, '.uvt', 'storage');
        this.ensureDirs();
    }
    ensureDirs() {
        const dirs = ['builds', 'snapshots', 'baselines'];
        dirs.forEach(d => fs.mkdirSync(path.join(this.baseDir, d), { recursive: true }));
    }
    readJson(filePath) {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        return null;
    }
    writeJson(filePath, data) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    async saveBuild(build) {
        this.writeJson(path.join(this.baseDir, 'builds', `${build.buildId}.json`), build);
    }
    async getBuild(buildId) {
        return this.readJson(path.join(this.baseDir, 'builds', `${buildId}.json`));
    }
    async listBuilds(repositoryId) {
        const buildsDir = path.join(this.baseDir, 'builds');
        if (!fs.existsSync(buildsDir))
            return [];
        return fs.readdirSync(buildsDir)
            .filter(f => f.endsWith('.json'))
            .map(f => this.readJson(path.join(buildsDir, f)))
            .filter((b) => b !== null && b.repositoryId === repositoryId);
    }
    async saveSnapshot(snapshot) {
        this.writeJson(path.join(this.baseDir, 'snapshots', `${snapshot.snapshotId}.json`), snapshot);
    }
    async getSnapshot(snapshotId) {
        return this.readJson(path.join(this.baseDir, 'snapshots', `${snapshotId}.json`));
    }
    async saveBaseline(baseline) {
        const sanitizedBranch = baseline.branch.replace(/[^a-z0-9]/gi, '_');
        this.writeJson(path.join(this.baseDir, 'baselines', `${sanitizedBranch}_${baseline.baselineId}.json`), baseline);
    }
    async getBaseline(branch, regionId) {
        const baselines = await this.listBaselines(branch);
        return baselines.length > 0 ? baselines[baselines.length - 1] : null;
    }
    async listBaselines(branch) {
        const baselinesDir = path.join(this.baseDir, 'baselines');
        if (!fs.existsSync(baselinesDir))
            return [];
        const sanitizedBranch = branch.replace(/[^a-z0-9]/gi, '_');
        return fs.readdirSync(baselinesDir)
            .filter(f => f.startsWith(sanitizedBranch) && f.endsWith('.json'))
            .map(f => this.readJson(path.join(baselinesDir, f)))
            .filter((b) => b !== null);
    }
}
exports.FilesystemProvider = FilesystemProvider;
//# sourceMappingURL=filesystem-provider.js.map