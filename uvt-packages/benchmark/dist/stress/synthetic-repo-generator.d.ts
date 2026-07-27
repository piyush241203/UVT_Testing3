import { StressScenarioId } from './stress-models.js';
export interface SyntheticRepoSpec {
    routeCount: number;
    componentCount: number;
    layoutDepth: number;
    isMonorepo: boolean;
    packageCount: number;
    dependencyDepth: number;
}
export declare class SyntheticRepoGenerator {
    static getSpecForScenario(id: StressScenarioId): SyntheticRepoSpec;
    static generateSyntheticRepo(targetDir: string, id: StressScenarioId): SyntheticRepoSpec;
}
//# sourceMappingURL=synthetic-repo-generator.d.ts.map