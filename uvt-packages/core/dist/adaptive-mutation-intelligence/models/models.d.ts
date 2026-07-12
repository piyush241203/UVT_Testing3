export interface MutationRecordLite {
    timestamp: number;
    type: 'characterData' | 'childList' | 'attributes' | 'layout';
    targetSelector: string;
    targetTag: string;
    attributeName?: string;
}
export interface NodeMutationStatistics {
    selector: string;
    tag: string;
    count: number;
    firstTimestamp: number;
    lastTimestamp: number;
    avgInterval: number;
    types: Set<string>;
}
export interface MutationTimeline {
    startTime: number;
    endTime: number;
    totalMutations: number;
    events: MutationRecordLite[];
}
export interface MutationMetadata {
    url: string;
    fingerprint: string;
    timeline: MutationTimeline;
    statistics: Record<string, NodeMutationStatistics>;
    isStable: boolean;
}
//# sourceMappingURL=models.d.ts.map