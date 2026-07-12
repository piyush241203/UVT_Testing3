import * as ts from 'typescript';
import { ASTParser, ASTVisitor, ASTVisitorContext } from '../models/models.js';
export declare class TSParser implements ASTParser {
    parse(filePath: string, content: string): ts.SourceFile;
    traverse(sourceFile: ts.SourceFile, visitors: ASTVisitor[], context: ASTVisitorContext): void;
}
//# sourceMappingURL=ts-parser.d.ts.map