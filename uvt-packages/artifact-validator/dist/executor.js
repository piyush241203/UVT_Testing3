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
exports.ArtifactExecutor = void 0;
const fs = __importStar(require("fs"));
class ArtifactExecutor {
    async execute(filePath, kind) {
        const startTime = Date.now();
        if (!fs.existsSync(filePath)) {
            return {
                passed: false,
                durationMs: Date.now() - startTime,
                error: `Execute phase error: File missing at ${filePath}`
            };
        }
        try {
            if (filePath.endsWith('.json')) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                if (typeof data !== 'object' || data === null) {
                    throw new Error('Parsed JSON did not evaluate to an object.');
                }
            }
            else if (kind === 'uvt-config' || filePath.endsWith('uvt.config.ts')) {
                // Simulating config execution validation
                const content = fs.readFileSync(filePath, 'utf-8');
                if (!content.includes('export default') && !content.includes('module.exports')) {
                    throw new Error('uvt.config must export a configuration object.');
                }
            }
            return {
                passed: true,
                durationMs: Date.now() - startTime,
                details: `Execute phase passed for ${kind}.`
            };
        }
        catch (err) {
            return {
                passed: false,
                durationMs: Date.now() - startTime,
                error: `Execute phase failed for ${kind}: ${err.message}`
            };
        }
    }
}
exports.ArtifactExecutor = ArtifactExecutor;
//# sourceMappingURL=executor.js.map