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
exports.WorkspaceDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class WorkspaceDetector {
    name = 'WorkspaceDetector';
    async detect(context) {
        let workspaceType = 'Single Package';
        const evidence = [];
        if (fs.existsSync(path.join(context.cwd, 'turbo.json'))) {
            workspaceType = 'Turborepo';
            evidence.push('Found turbo.json');
        }
        else if (fs.existsSync(path.join(context.cwd, 'nx.json'))) {
            workspaceType = 'Nx';
            evidence.push('Found nx.json');
        }
        else if (fs.existsSync(path.join(context.cwd, 'lerna.json'))) {
            workspaceType = 'Lerna';
            evidence.push('Found lerna.json');
        }
        else if (fs.existsSync(path.join(context.cwd, 'rush.json'))) {
            workspaceType = 'Rush';
            evidence.push('Found rush.json');
        }
        else if (fs.existsSync(path.join(context.cwd, 'pnpm-workspace.yaml'))) {
            workspaceType = 'pnpm workspace';
            evidence.push('Found pnpm-workspace.yaml');
        }
        else if (context.packageJson.workspaces) {
            workspaceType = 'Yarn/NPM workspace';
            evidence.push('Found workspaces array in package.json');
        }
        else {
            evidence.push('No workspace configuration found.');
        }
        context.capabilities.set('workspace', {
            id: 'workspace',
            type: 'workspace',
            name: workspaceType,
            confidence: evidence.length > 0 && workspaceType !== 'Single Package' ? 1.0 : 0.8,
            evidence,
            dependencies: []
        });
    }
}
exports.WorkspaceDetector = WorkspaceDetector;
//# sourceMappingURL=detector.js.map