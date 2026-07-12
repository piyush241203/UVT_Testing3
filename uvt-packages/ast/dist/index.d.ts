import * as ts from 'typescript';
export declare function parseFile(filePath: string): ts.SourceFile;
export interface ImportDetails {
    moduleName: string;
    specifiers: string[];
}
export declare function extractImports(sourceFile: ts.SourceFile): ImportDetails[];
/**
 * Robustly search for route structures.
 * 1. JSX elements: <Route path="/about" /> -> "/about"
 * 2. Object properties: { path: "/about" } -> "/about"
 * 3. Router functions: createBrowserRouter([ { path: "/about" } ])
 */
export declare function extractRoutePaths(sourceFile: ts.SourceFile): string[];
//# sourceMappingURL=index.d.ts.map