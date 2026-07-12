import { Analyzer, DynamicContext, DynamicSignal } from '../index.js';
export declare class LegacyASTAnalyzer implements Analyzer {
    readonly name = "LegacyASTAnalyzer";
    private context?;
    initialize(context: DynamicContext): void;
    analyze(): Promise<DynamicSignal[]>;
    private createSignal;
    dispose(): void;
}
//# sourceMappingURL=legacy-ast-analyzer.d.ts.map