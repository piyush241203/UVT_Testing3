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
exports.ArtifactParser = void 0;
const fs = __importStar(require("fs"));
class ArtifactParser {
    parse(filePath, kind) {
        const startTime = Date.now();
        if (!fs.existsSync(filePath)) {
            return {
                passed: false,
                durationMs: Date.now() - startTime,
                error: `File not found at path: ${filePath}`
            };
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        try {
            if (filePath.endsWith('.json') || kind === 'package.json' || kind === 'tsconfig' || kind === 'angular-json') {
                JSON.parse(content);
            }
            else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml') || kind === 'github-workflow' || kind === 'percy-config') {
                this.basicYamlCheck(content);
            }
            else {
                // JS/TS basic structure check
                if (content.trim().length === 0) {
                    throw new Error('File content is empty.');
                }
            }
            return {
                passed: true,
                durationMs: Date.now() - startTime,
                details: `Successfully parsed ${kind} content.`
            };
        }
        catch (err) {
            return {
                passed: false,
                durationMs: Date.now() - startTime,
                error: `Parse error in ${kind}: ${err.message}`
            };
        }
    }
    basicYamlCheck(content) {
        if (!content || content.trim().length === 0) {
            throw new Error('YAML content is empty.');
        }
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('\t')) {
                throw new Error(`YAML syntax error on line ${i + 1}: Tabs are not allowed in YAML.`);
            }
        }
    }
}
exports.ArtifactParser = ArtifactParser;
//# sourceMappingURL=parsers.js.map