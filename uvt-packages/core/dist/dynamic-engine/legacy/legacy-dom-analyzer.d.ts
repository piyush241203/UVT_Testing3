import { Analyzer, DynamicContext, DynamicSignal } from '../index.js';
export declare class LegacyDOMAnalyzer implements Analyzer {
    readonly name = "LegacyDOMAnalyzer";
    private context?;
    initialize(context: DynamicContext): void;
    analyze(): Promise<DynamicSignal[]>;
    dispose(): void;
}
//# sourceMappingURL=legacy-dom-analyzer.d.ts.map