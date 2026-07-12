import { DynamicSignal } from '../../dynamic-engine/index.js';
export interface DecisionConfig {
    enabled: boolean;
    policy: 'conservative' | 'balanced' | 'aggressive' | 'ai-ready';
    minimumConfidence: number;
    weights: Record<string, number>;
    allowSingleCriticalSignal: boolean;
}
export declare const DEFAULT_DECISION_CONFIG: DecisionConfig;
export interface Decision {
    id: string;
    target: string;
    region: string;
    confidence: number;
    recommendedStrategy: string;
    plugins: string[];
    evidence: DynamicSignal[];
    priority: number;
    reason: string;
    verificationRequired: boolean;
    rollbackRequired: boolean;
}
//# sourceMappingURL=models.d.ts.map