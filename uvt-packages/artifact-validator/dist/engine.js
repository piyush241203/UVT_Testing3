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
exports.ArtifactValidationEngine2 = void 0;
const path = __importStar(require("path"));
const parsers_js_1 = require("./parsers.js");
const compiler_js_1 = require("./compiler.js");
const executor_js_1 = require("./executor.js");
const dry_run_js_1 = require("./dry-run.js");
class ArtifactValidationEngine2 {
    parser;
    compiler;
    executor;
    dryRunner;
    constructor() {
        this.parser = new parsers_js_1.ArtifactParser();
        this.compiler = new compiler_js_1.ArtifactCompiler();
        this.executor = new executor_js_1.ArtifactExecutor();
        this.dryRunner = new dry_run_js_1.ArtifactDryRunner();
    }
    async validateArtifact(filePath, kind, regenerator) {
        const artifactId = path.basename(filePath);
        const errors = [];
        let autoRegenerated = false;
        let parseResult = this.parser.parse(filePath, kind);
        let compileResult = this.compiler.compile(filePath, kind);
        let executeResult = await this.executor.execute(filePath, kind);
        let dryRunResult = this.dryRunner.dryRun(filePath, kind);
        let isPassed = parseResult.passed && compileResult.passed && executeResult.passed && dryRunResult.passed;
        if (!isPassed && regenerator) {
            // Auto-regeneration trigger
            autoRegenerated = true;
            try {
                regenerator(filePath, kind);
                // Re-run 4-phase validation lifecycle after auto-regeneration
                parseResult = this.parser.parse(filePath, kind);
                compileResult = this.compiler.compile(filePath, kind);
                executeResult = await this.executor.execute(filePath, kind);
                dryRunResult = this.dryRunner.dryRun(filePath, kind);
                isPassed = parseResult.passed && compileResult.passed && executeResult.passed && dryRunResult.passed;
            }
            catch (regErr) {
                errors.push(`Auto-regeneration failed: ${regErr.message}`);
            }
        }
        if (parseResult.error)
            errors.push(parseResult.error);
        if (compileResult.error)
            errors.push(compileResult.error);
        if (executeResult.error)
            errors.push(executeResult.error);
        if (dryRunResult.error)
            errors.push(dryRunResult.error);
        return {
            artifactId,
            artifactPath: filePath,
            kind,
            passed: isPassed,
            autoRegenerated,
            phases: {
                parse: parseResult,
                compile: compileResult,
                execute: executeResult,
                dryRun: dryRunResult
            },
            errors,
            timestamp: Date.now()
        };
    }
    compileSuiteReport(results) {
        const totalValidated = results.length;
        const totalPassed = results.filter(r => r.passed).length;
        const totalFailed = totalValidated - totalPassed;
        const totalAutoRegenerated = results.filter(r => r.autoRegenerated).length;
        return {
            totalValidated,
            totalPassed,
            totalFailed,
            totalAutoRegenerated,
            overallPassed: totalFailed === 0,
            results,
            timestamp: Date.now()
        };
    }
}
exports.ArtifactValidationEngine2 = ArtifactValidationEngine2;
//# sourceMappingURL=engine.js.map