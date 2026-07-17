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
exports.TSParser = void 0;
const ts = __importStar(require("typescript"));
class TSParser {
    parse(filePath, content) {
        const extension = filePath.split('.').pop()?.toLowerCase() || 'js';
        // Extract script blocks for .svelte and .vue to avoid TS syntax errors on HTML
        let parseContent = content;
        if (extension === 'svelte' || extension === 'vue') {
            const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            if (scriptMatch && scriptMatch[1]) {
                parseContent = scriptMatch[1];
            }
            else {
                parseContent = ''; // No script to parse
            }
        }
        const scriptKind = extension === 'tsx' || extension === 'jsx' ? ts.ScriptKind.TSX
            : (extension === 'ts' || extension === 'svelte' || extension === 'vue') ? ts.ScriptKind.TS
                : extension === 'js' ? ts.ScriptKind.JS
                    : ts.ScriptKind.Unknown;
        return ts.createSourceFile(filePath, parseContent, ts.ScriptTarget.Latest, true, // setParentNodes
        scriptKind);
    }
    traverse(sourceFile, visitors, context) {
        const visit = (node) => {
            // Execute all visitors for the current node
            for (const visitor of visitors) {
                try {
                    visitor.visitNode(node, context);
                }
                catch (e) {
                    // Ignore visitor crashes to keep pipeline stable
                }
            }
            // Recursively visit children
            ts.forEachChild(node, visit);
        };
        // Start traversal at the root source file
        visit(sourceFile);
    }
}
exports.TSParser = TSParser;
//# sourceMappingURL=ts-parser.js.map