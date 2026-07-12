import { Analyzer, DynamicContext, DynamicSignal } from '../index.js';
import { NetworkAnalyzer } from '../../engines/network-analyzer.js';
export declare class LegacyNetworkAnalyzer implements Analyzer {
    readonly name = "LegacyNetworkAnalyzer";
    private networkAnalyzer;
    private context?;
    private snieEngine?;
    constructor(networkAnalyzer: NetworkAnalyzer);
    initialize(context: DynamicContext): void;
    analyze(): Promise<DynamicSignal[]>;
    dispose(): void;
}
//# sourceMappingURL=legacy-network-analyzer.d.ts.map