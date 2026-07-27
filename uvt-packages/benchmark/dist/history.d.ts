import { HistoricalBenchmarkData, SubsystemBenchmarkResult } from './types.js';
export declare class BenchmarkHistoryStore {
    private historyFilePath;
    constructor(cwd: string);
    load(): HistoricalBenchmarkData;
    save(data: HistoricalBenchmarkData): void;
    recordRun(projectName: string, subsystems: SubsystemBenchmarkResult[], overallScore: number): {
        data: HistoricalBenchmarkData;
        degradedSubsystems: string[];
        improvedSubsystems: string[];
        previousRunTimestamp?: string;
    };
}
//# sourceMappingURL=history.d.ts.map