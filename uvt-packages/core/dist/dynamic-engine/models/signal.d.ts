export interface DynamicSignal {
    /** Unique identifier for the signal */
    readonly id: string;
    /** Source of the intelligence (e.g., 'ast', 'network', 'dom', 'runtime') */
    readonly source: string;
    /** Type of dynamic behavior detected (e.g., 'time', 'currency', 'animation') */
    readonly type: string;
    /** Confidence score between 0.0 and 1.0 */
    readonly confidence: number;
    /** Severity or impact level (e.g., 'high', 'medium', 'low') */
    readonly severity: 'critical' | 'high' | 'medium' | 'low';
    /** CSS selector targeting the dynamic element, if applicable */
    readonly selector?: string;
    /** DOM Node path or AST node path */
    readonly nodePath?: string;
    /** Human-readable reason for why this was flagged */
    readonly reason: string;
    /** Any additional context metadata from the analyzer */
    readonly metadata?: Readonly<Record<string, unknown>>;
    /** Timestamp when the signal was generated */
    readonly timestamp: number;
}
//# sourceMappingURL=signal.d.ts.map