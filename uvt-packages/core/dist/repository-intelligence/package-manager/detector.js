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
exports.PackageManagerDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class PackageManagerDetector {
    name = 'PackageManagerDetector';
    async detect(context) {
        let pm = 'npm';
        let confidence = 0.5;
        if (fs.existsSync(path.join(context.cwd, 'pnpm-lock.yaml'))) {
            pm = 'pnpm';
            confidence = 1.0;
        }
        else if (fs.existsSync(path.join(context.cwd, 'yarn.lock'))) {
            pm = 'yarn';
            confidence = 1.0;
        }
        else if (fs.existsSync(path.join(context.cwd, 'bun.lockb'))) {
            pm = 'bun';
            confidence = 1.0;
        }
        else if (fs.existsSync(path.join(context.cwd, 'package-lock.json'))) {
            pm = 'npm';
            confidence = 1.0;
        }
        context.capabilities.set('package-manager', {
            id: 'package-manager',
            type: 'package-manager',
            name: pm,
            confidence,
            evidence: [`Detected via lockfile or default fallback.`],
            dependencies: []
        });
    }
}
exports.PackageManagerDetector = PackageManagerDetector;
//# sourceMappingURL=detector.js.map