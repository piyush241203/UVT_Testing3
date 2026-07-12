export type RegionType = 'Root' | 'Route' | 'Layout' | 'Region' | 'Component' | 'Element';
export interface RegionNode {
    id: string;
    type: RegionType;
    name: string;
    selector: string;
    parentId?: string;
    childrenIds: string[];
    attributes: Record<string, string>;
    isPersistent: boolean;
    isOverlay: boolean;
    isPortal: boolean;
    frameworkOwner?: string;
    rect?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export interface RegionConfig {
    enabled: boolean;
    detectPersistentLayouts: boolean;
    enableRegionCaching: boolean;
    optimizeRouteTransitions: boolean;
    detectPortals: boolean;
    detectMicroFrontends: boolean;
}
export declare const DEFAULT_REGION_CONFIG: RegionConfig;
export interface RegionGraphData {
    nodes: Record<string, RegionNode>;
    rootId: string;
}
//# sourceMappingURL=models.d.ts.map