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
exports.RIECache = void 0;
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class RIECache {
    cacheDir;
    constructor(cwd) {
        this.cacheDir = path.join(cwd, '.uvt', 'cache');
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }
    generateFingerprint(cwd) {
        const hash = crypto.createHash('md5');
        // Hash package.json
        const pkgPath = path.join(cwd, 'package.json');
        if (fs.existsSync(pkgPath)) {
            hash.update(fs.readFileSync(pkgPath, 'utf8'));
        }
        // Hash lockfiles
        const lockfiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'];
        for (const lock of lockfiles) {
            const lockPath = path.join(cwd, lock);
            if (fs.existsSync(lockPath)) {
                hash.update(fs.readFileSync(lockPath, 'utf8'));
            }
        }
        return hash.digest('hex');
    }
    get(cwd) {
        try {
            const fingerprint = this.generateFingerprint(cwd);
            const cachePath = path.join(this.cacheDir, `rie_${fingerprint}.json`);
            if (fs.existsSync(cachePath)) {
                return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            }
        }
        catch (e) {
            // Ignore cache read errors
        }
        return null;
    }
    set(cwd, result) {
        try {
            const fingerprint = this.generateFingerprint(cwd);
            const cachePath = path.join(this.cacheDir, `rie_${fingerprint}.json`);
            fs.writeFileSync(cachePath, JSON.stringify(result, null, 2), 'utf8');
        }
        catch (e) {
            // Ignore cache write errors
        }
    }
}
exports.RIECache = RIECache;
//# sourceMappingURL=rie-cache.js.map