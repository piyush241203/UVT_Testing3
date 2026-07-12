import * as ts from 'typescript';
import { ASTVisitor, ASTVisitorContext } from '../../models/models.js';
export declare class DateVisitor implements ASTVisitor {
    readonly name = "DateVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class RandomVisitor implements ASTVisitor {
    readonly name = "RandomVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class TimerVisitor implements ASTVisitor {
    readonly name = "TimerVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class NetworkVisitor implements ASTVisitor {
    readonly name = "NetworkVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class BrowserAPIVisitor implements ASTVisitor {
    readonly name = "BrowserAPIVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class ComponentVisitor implements ASTVisitor {
    readonly name = "ComponentVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
export declare class RealtimeVisitor implements ASTVisitor {
    readonly name = "RealtimeVisitor";
    visitNode(node: ts.Node, context: ASTVisitorContext): void;
}
//# sourceMappingURL=index.d.ts.map