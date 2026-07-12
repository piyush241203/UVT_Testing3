import { RegionNode, RegionGraphData } from '../models/models.js';
export declare class RegionGraph {
    private nodes;
    rootId: string;
    constructor(data?: RegionGraphData);
    getNode(id: string): RegionNode | undefined;
    getAllNodes(): RegionNode[];
    findClosestRegion(selector: string): RegionNode | undefined;
}
//# sourceMappingURL=region-graph.d.ts.map