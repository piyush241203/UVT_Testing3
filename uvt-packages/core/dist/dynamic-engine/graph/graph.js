"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSignalGraph = exports.RelationshipType = void 0;
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["PARENT_CHILD"] = "PARENT_CHILD";
    RelationshipType["DEPENDENCY"] = "DEPENDENCY";
    RelationshipType["DUPLICATE"] = "DUPLICATE";
    RelationshipType["CAUSED_BY"] = "CAUSED_BY";
    RelationshipType["RELATED"] = "RELATED";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
class DefaultSignalGraph {
    nodes = new Map();
    edges = [];
    addNode(signal) {
        if (!this.nodes.has(signal.id)) {
            this.nodes.set(signal.id, { signal });
        }
    }
    addEdge(sourceId, targetId, relationship, metadata) {
        this.edges.push({ sourceId, targetId, relationship, metadata });
    }
    getNode(id) {
        return this.nodes.get(id);
    }
    getEdges(id) {
        return this.edges.filter(e => e.sourceId === id || e.targetId === id);
    }
    getParents(id) {
        const parentIds = this.edges
            .filter(e => e.targetId === id && e.relationship === RelationshipType.PARENT_CHILD)
            .map(e => e.sourceId);
        return parentIds.map(pid => this.nodes.get(pid)).filter(Boolean);
    }
    getChildren(id) {
        const childIds = this.edges
            .filter(e => e.sourceId === id && e.relationship === RelationshipType.PARENT_CHILD)
            .map(e => e.targetId);
        return childIds.map(cid => this.nodes.get(cid)).filter(Boolean);
    }
    serialize() {
        return JSON.stringify({
            nodes: Array.from(this.nodes.entries()),
            edges: this.edges
        });
    }
    deserialize(data) {
        const parsed = JSON.parse(data);
        this.nodes = new Map(parsed.nodes);
        this.edges = parsed.edges;
    }
}
exports.DefaultSignalGraph = DefaultSignalGraph;
//# sourceMappingURL=graph.js.map