export interface ReadinessCondition {
    id: string;
    priority(): number;
    initialize(page: any): Promise<void>;
    check(): Promise<boolean>;
    dispose(): void;
}
//# sourceMappingURL=condition.d.ts.map