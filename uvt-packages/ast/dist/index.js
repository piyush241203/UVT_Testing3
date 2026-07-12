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
exports.parseFile = parseFile;
exports.extractImports = extractImports;
exports.extractRoutePaths = extractRoutePaths;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
// ==========================================
// AST Parsing & Analysis
// ==========================================
function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
}
function extractImports(sourceFile) {
    const imports = [];
    function visit(node) {
        if (ts.isImportDeclaration(node)) {
            const moduleName = node.moduleSpecifier.text;
            const specifiers = [];
            if (node.importClause) {
                if (node.importClause.name) {
                    specifiers.push(node.importClause.name.text); // Default import
                }
                if (node.importClause.namedBindings) {
                    if (ts.isNamedImports(node.importClause.namedBindings)) {
                        node.importClause.namedBindings.elements.forEach(el => {
                            specifiers.push(el.name.text);
                        });
                    }
                    else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
                        specifiers.push(node.importClause.namedBindings.name.text);
                    }
                }
            }
            imports.push({ moduleName, specifiers });
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return imports;
}
/**
 * Robustly search for route structures.
 * 1. JSX elements: <Route path="/about" /> -> "/about"
 * 2. Object properties: { path: "/about" } -> "/about"
 * 3. Router functions: createBrowserRouter([ { path: "/about" } ])
 */
function extractRoutePaths(sourceFile) {
    const routes = new Set();
    function visit(node) {
        // 1. Check object literal properties named "path" (e.g. { path: '/about' })
        if (ts.isPropertyAssignment(node)) {
            const name = node.name.getText(sourceFile);
            if (name === 'path' || name === '"path"' || name === "'path'") {
                if (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer)) {
                    routes.add(node.initializer.text);
                }
            }
        }
        // 2. Check JSX Attributes named "path" (e.g. <Route path="/about" />)
        if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name) && node.name.text === 'path') {
            if (node.initializer) {
                if (ts.isStringLiteral(node.initializer)) {
                    routes.add(node.initializer.text);
                }
                else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
                    if (ts.isStringLiteral(node.initializer.expression) || ts.isNoSubstitutionTemplateLiteral(node.initializer.expression)) {
                        routes.add(node.initializer.expression.text);
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return Array.from(routes);
}
//# sourceMappingURL=index.js.map