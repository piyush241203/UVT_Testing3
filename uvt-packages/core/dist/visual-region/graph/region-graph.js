"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionGraph = void 0;
class RegionGraph {
    nodes = new Map();
    rootId = 'root';
    constructor(data) {
        if (data) {
            this.rootId = data.rootId;
            for (const [id, node] of Object.entries(data.nodes)) {
                this.nodes.set(id, node);
            }
        }
    }
    getNode(id) {
        return this.nodes.get(id);
    }
    getAllNodes() {
        return Array.from(this.nodes.values());
    }
    findClosestRegion(selector) {
        // Basic heuristic: search nodes by selector.
        // In a robust implementation, this evaluates DOM hierarchy boundaries.
        return this.getAllNodes().find(n => n.selector === selector || selector.includes(n.selector));
    }
}
exports.RegionGraph = RegionGraph;
//# sourceMappingURL=region-graph.js.map