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
exports.RepoCache = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class RepoCache {
    cacheDir;
    constructor(customCacheDir) {
        this.cacheDir = customCacheDir || path.resolve(process.cwd(), '.uvt', 'repo-cache');
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }
    getCacheDir() {
        return this.cacheDir;
    }
    getRepoPath(repoId) {
        return path.join(this.cacheDir, repoId);
    }
    hasRepo(repoId) {
        const repoPath = this.getRepoPath(repoId);
        return fs.existsSync(repoPath) && fs.existsSync(path.join(repoPath, '.git'));
    }
    clearCache() {
        if (fs.existsSync(this.cacheDir)) {
            fs.rmSync(this.cacheDir, { recursive: true, force: true });
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }
}
exports.RepoCache = RepoCache;
//# sourceMappingURL=cache.js.map