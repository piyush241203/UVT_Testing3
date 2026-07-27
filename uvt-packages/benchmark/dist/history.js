"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenchmarkHistoryStore = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const types_js_1 = require("./types.js");
class BenchmarkHistoryStore {
    historyFilePath;
    constructor(cwd) {
        const dir = path.join(cwd, '.uvt', 'benchmarks');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        this.historyFilePath = path.join(dir, 'history.json');
    }
    load() {
        if (fs.existsSync(this.historyFilePath)) {
            try {
                const raw = fs.readFileSync(this.historyFilePath, 'utf8');
                return JSON.parse(raw);
            }
            catch (e) {
                // Fallback to fresh store if corrupt
            }
        }
        return {
            schemaVersion: types_js_1.BENCHMARK_SCHEMA_VERSION,
            lastUpdated: new Date().toISOString(),
            history: [],
            baselines: {
                'repository-scan': 45,
                'capability-graph': 25,
                'generator': 35,
                'validation': 85,
                'tcse': 40,
                'dse': 55,
                'playwright': 120,
                'provider': 30,
                'snapshot': 20,
                'report': 15
            }
        };
    }
    save(data) {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(this.historyFilePath, JSON.stringify(data, null, 2), 'utf8');
    }
    recordRun(projectName, subsystems, overallScore) {
        const store = this.load();
        const runId = `run_${Date.now()}`;
        const timestamp = new Date().toISOString();
        const previousRun = store.history.length > 0 ? store.history[store.history.length - 1] : undefined;
        const degradedSubsystems = [];
        const improvedSubsystems = [];
        // Compare each subsystem against stored baseline or previous run
        for (const sub of subsystems) {
            const baselineMs = store.baselines[sub.subsystem] ?? 50;
            sub.baselineTimeMs = baselineMs;
            const diff = ((sub.metrics.executionTimeMs - baselineMs) / baselineMs) * 100;
            sub.diffPercent = Number(diff.toFixed(1));
            if (sub.diffPercent > 15) {
                sub.status = 'degraded';
                degradedSubsystems.push(sub.subsystem);
                sub.notes = sub.notes || [];
                sub.notes.push(`Execution time degraded by ${sub.diffPercent}% compared to baseline (${baselineMs}ms)`);
            }
            else if (sub.diffPercent < -10) {
                sub.status = 'passed';
                improvedSubsystems.push(sub.subsystem);
                sub.notes = sub.notes || [];
                sub.notes.push(`Execution time improved by ${Math.abs(sub.diffPercent)}%`);
            }
            else {
                sub.status = 'passed';
            }
            // Update baseline moving average
            const updatedBaseline = Math.round((baselineMs * 0.7) + (sub.metrics.executionTimeMs * 0.3));
            store.baselines[sub.subsystem] = updatedBaseline;
        }
        const runRecord = {
            runId,
            timestamp,
            projectName,
            subsystems,
            overallScore
        };
        store.history.push(runRecord);
        // Keep last 50 runs
        if (store.history.length > 50) {
            store.history = store.history.slice(-50);
        }
        this.save(store);
        return {
            data: store,
            degradedSubsystems,
            improvedSubsystems,
            previousRunTimestamp: previousRun?.timestamp
        };
    }
}
exports.BenchmarkHistoryStore = BenchmarkHistoryStore;
//# sourceMappingURL=history.js.map