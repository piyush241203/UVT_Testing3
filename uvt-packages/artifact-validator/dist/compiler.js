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
exports.ArtifactCompiler = void 0;
const fs = __importStar(require("fs"));
class ArtifactCompiler {
    compile(filePath, kind) {
        const startTime = Date.now();
        if (!fs.existsSync(filePath)) {
            return {
                passed: false,
                durationMs: Date.now() - startTime,
                error: `Compile error: File missing at ${filePath}`
            };
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        try {
            // Basic AST compile verification for TS/JS files
            if (filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
                this.verifyJsTsSyntax(content);
            }
            return {
                passed: true,
                durationMs: Date.now() - startTime,
                details: `Compile phase passed for ${kind}.`
            };
        }
        catch (err) {
            return {
                passed: false,
                durationMs: Date.now() - startTime,
                error: `Compile phase failed for ${kind}: ${err.message}`
            };
        }
    }
    verifyJsTsSyntax(code) {
        let openBraces = 0;
        let openParens = 0;
        let openBrackets = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            if (char === '{')
                openBraces++;
            else if (char === '}')
                openBraces--;
            else if (char === '(')
                openParens++;
            else if (char === ')')
                openParens--;
            else if (char === '[')
                openBrackets++;
            else if (char === ']')
                openBrackets--;
        }
        if (openBraces !== 0 || openParens !== 0 || openBrackets !== 0) {
            throw new Error(`Unbalanced syntax delimiters in code (Braces: ${openBraces}, Parens: ${openParens}, Brackets: ${openBrackets}).`);
        }
    }
}
exports.ArtifactCompiler = ArtifactCompiler;
//# sourceMappingURL=compiler.js.map