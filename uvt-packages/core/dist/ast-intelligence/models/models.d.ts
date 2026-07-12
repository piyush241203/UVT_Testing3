import { DynamicSignal } from '../../dynamic-engine/index.js';
import type * as ts from 'typescript';
export interface ASTMetadata {
    parsedFilesCount: number;
    parseTimeMs: number;
    totalSignalsGenerated: number;
    visitorsExecuted: string[];
    componentsClassified: Record<string, number>;
}
export interface ASTVisitorContext {
    filePath: string;
    sourceFile: ts.SourceFile;
    emitSignal(signal: DynamicSignal): void;
    classifyComponent(className: string): void;
}
export interface ASTVisitor {
    readonly name: string;
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export interface ASTParser {
    parse(filePath: string, content: string): ts.SourceFile;
    traverse(sourceFile: ts.SourceFile, visitors: ASTVisitor[], context: ASTVisitorContext): void;
}
//# sourceMappingURL=models.d.ts.map