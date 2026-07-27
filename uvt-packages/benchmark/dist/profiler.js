"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubsystemProfiler = void 0;
class SubsystemProfiler {
    static async profile(name, fn, context = {}) {
        const startMemory = process.memoryUsage();
        const startCpu = process.cpuUsage();
        const startTime = performance.now();
        const result = await fn();
        const endTime = performance.now();
        const endCpu = process.cpuUsage(startCpu);
        const endMemory = process.memoryUsage();
        const durationMs = Math.max(0.01, Number((endTime - startTime).toFixed(2)));
        // Process CPU time in milliseconds converted to rough percentage over duration
        const userCpuMs = endCpu.user / 1000;
        const sysCpuMs = endCpu.system / 1000;
        const cpuUserPercent = Number(Math.min(100, (userCpuMs / durationMs) * 100).toFixed(1));
        const cpuSystemPercent = Number(Math.min(100, (sysCpuMs / durationMs) * 100).toFixed(1));
        const heapUsedMb = Number(((endMemory.heapUsed - startMemory.heapUsed) / (1024 * 1024)).toFixed(2));
        const rssMb = Number((endMemory.rss / (1024 * 1024)).toFixed(2));
        const metrics = {
            executionTimeMs: durationMs,
            memoryHeapUsedMb: heapUsedMb > 0 ? heapUsedMb : 0.05,
            memoryRssMb: rssMb,
            cpuUserPercent: Math.max(0.1, cpuUserPercent),
            cpuSystemPercent: Math.max(0.1, cpuSystemPercent),
            networkRequestsCount: context.networkRequestsCount ?? 0,
            domNodesCount: context.domNodesCount ?? 0,
            routesCount: context.routesCount ?? 0,
            componentsCount: context.componentsCount ?? 0,
            importsCount: context.importsCount ?? 0
        };
        return { result, metrics };
    }
}
exports.SubsystemProfiler = SubsystemProfiler;
//# sourceMappingURL=profiler.js.map