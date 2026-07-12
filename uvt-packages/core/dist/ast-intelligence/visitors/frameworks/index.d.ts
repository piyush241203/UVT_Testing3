import * as ts from 'typescript';
import { ASTVisitor, ASTVisitorContext } from '../../models/models.js';
export declare class ReactVisitor implements ASTVisitor {
    readonly name = "ReactVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class NextVisitor implements ASTVisitor {
    readonly name = "NextVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class VueVisitor implements ASTVisitor {
    readonly name = "VueVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class AngularVisitor implements ASTVisitor {
    readonly name = "AngularVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class SvelteVisitor implements ASTVisitor {
    readonly name = "SvelteVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class AstroVisitor implements ASTVisitor {
    readonly name = "AstroVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
//# sourceMappingURL=index.d.ts.map