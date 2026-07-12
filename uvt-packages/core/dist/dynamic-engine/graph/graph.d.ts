import { DynamicSignal } from '../models/signal/signal.js';
export declare enum RelationshipType {
    PARENT_CHILD = "PARENT_CHILD",
    DEPENDENCY = "DEPENDENCY",
    DUPLICATE = "DUPLICATE",
    CAUSED_BY = "CAUSED_BY",
    RELATED = "RELATED"
}
export interface SignalNode {
    readonly signal: DynamicSignal;
}
export interface SignalEdge {
    readonly sourceId: string;
    readonly targetId: string;
    readonly relationship: RelationshipType;
    readonly metadata?: Readonly<Record<string, unknown>>;
}
export interface SignalGraph {
    addNode(signal: DynamicSignal): void;
    addEdge(sourceId: string, targetId: string, relationship: RelationshipType, metadata?: Record<string, unknown>): void;
    getNode(id: string): SignalNode | undefined;
    getEdges(id: string): SignalEdge[];
    getParents(id: string): SignalNode[];
    getChildren(id: string): SignalNode[];
    serialize(): string;
    deserialize(data: string): void;
}
export declare class DefaultSignalGraph implements SignalGraph {
    private nodes;
    private edges;
    addNode(signal: DynamicSignal): void;
    addEdge(sourceId: string, targetId: string, relationship: RelationshipType, metadata?: Record<string, unknown>): void;
    getNode(id: string): SignalNode | undefined;
    getEdges(id: string): SignalEdge[];
    getParents(id: string): SignalNode[];
    getChildren(id: string): SignalNode[];
    serialize(): string;
    deserialize(data: string): void;
}
//# sourceMappingURL=graph.d.ts.map