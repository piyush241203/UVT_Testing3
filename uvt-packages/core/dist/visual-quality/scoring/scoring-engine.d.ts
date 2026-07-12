import { VisualQualityReport, QualityHeuristic, PluginEffectiveness } from '../models/models.js';
export declare class ScoringEngine {
    calculateScore(heuristics: QualityHeuristic[], pluginStats: PluginEffectiveness[], actionsApplied: number, actionsFailed: number): VisualQualityReport;
}
//# sourceMappingURL=scoring-engine.d.ts.map