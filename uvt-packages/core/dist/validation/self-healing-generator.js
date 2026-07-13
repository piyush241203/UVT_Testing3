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
exports.SelfHealingGenerator = void 0;
/**
 * Self-Healing Generator (SHG) — RC-04 URAE
 *
 * When the Artifact Validation Engine reports failures, the SHG attempts
 * to repair the artifact in-place and re-validate. Max 3 healing cycles
 * per artifact before escalating as a fatal error.
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const shared_1 = require("@uvt/shared");
const artifact_validator_js_1 = require("./artifact-validator.js");
const generator_planner_js_1 = require("../generator/generator-planner.js");
const MAX_HEAL_CYCLES = 3;
class SelfHealingGenerator {
    /**
     * Attempt to heal a failed artifact. Returns a HealingReport.
     * Healing is verbose — every repair action is logged.
     */
    static async heal(artifactPath, errors, graph) {
        let cycles = 0;
        let currentErrors = errors;
        shared_1.logger.warn(`SHG: Starting self-healing for ${path.basename(artifactPath)} (${errors.length} error(s))...`);
        while (cycles < MAX_HEAL_CYCLES && currentErrors.length > 0) {
            cycles++;
            shared_1.logger.info(`SHG: Healing cycle ${cycles}/${MAX_HEAL_CYCLES} for ${path.basename(artifactPath)}`);
            const ext = path.extname(artifactPath).toLowerCase();
            const basename = path.basename(artifactPath).toLowerCase();
            let repaired = false;
            if (ext === '.yml' || ext === '.yaml') {
                repaired = SelfHealingGenerator.healYAML(artifactPath, currentErrors, graph);
            }
            else if (basename === 'package.json' || ext === '.json') {
                repaired = SelfHealingGenerator.healJSON(artifactPath, currentErrors);
            }
            else {
                repaired = SelfHealingGenerator.healGeneric(artifactPath, currentErrors, graph);
            }
            if (!repaired) {
                shared_1.logger.warn(`SHG: No repair strategy matched for cycle ${cycles}. Stopping.`);
                break;
            }
            // Re-validate after heal
            const revalidation = await artifact_validator_js_1.ArtifactValidator.validate(artifactPath);
            currentErrors = revalidation.errors;
            if (revalidation.valid) {
                shared_1.logger.info(`SHG: ✔ ${path.basename(artifactPath)} healed successfully after ${cycles} cycle(s).`);
                return { artifact: artifactPath, cycles, healed: true, finalErrors: [] };
            }
        }
        shared_1.logger.error(`SHG: Failed to heal ${path.basename(artifactPath)} after ${cycles} cycle(s). Manual intervention required.`);
        return { artifact: artifactPath, cycles, healed: false, finalErrors: currentErrors };
    }
    // ----------------------------------------------------------
    // YAML healing strategies
    // ----------------------------------------------------------
    static healYAML(artifactPath, errors, graph) {
        const isGHA = artifactPath.includes('.github/workflows');
        const isPercy = path.basename(artifactPath) === '.percy.yml';
        let repaired = false;
        // Strategy 1: Regenerate from scratch using the Generator Planner
        if (isGHA) {
            const freshContent = generator_planner_js_1.GeneratorPlanner.generateGHAWorkflow(graph);
            // Replace tab indentation with spaces in generated content
            const sanitized = SelfHealingGenerator.sanitizeYAML(freshContent);
            fs.writeFileSync(artifactPath, sanitized, 'utf-8');
            shared_1.logger.info(`SHG: Regenerated GHA workflow from CapabilityGraph.`);
            repaired = true;
        }
        else if (isPercy) {
            const freshContent = generator_planner_js_1.GeneratorPlanner.generatePercyConfig(graph);
            const sanitized = SelfHealingGenerator.sanitizeYAML(freshContent);
            fs.writeFileSync(artifactPath, sanitized, 'utf-8');
            shared_1.logger.info(`SHG: Regenerated Percy config from CapabilityGraph.`);
            repaired = true;
        }
        else {
            // Strategy 2: Line-level sanitation
            const content = fs.readFileSync(artifactPath, 'utf-8');
            const sanitized = SelfHealingGenerator.sanitizeYAML(content);
            if (sanitized !== content) {
                fs.writeFileSync(artifactPath, sanitized, 'utf-8');
                shared_1.logger.info(`SHG: Sanitized YAML (tabs → spaces, trailing whitespace).`);
                repaired = true;
            }
        }
        return repaired;
    }
    static sanitizeYAML(content) {
        return content
            .split('\n')
            .map(line => line.replace(/\t/g, '  ')) // tabs → 2 spaces
            .map(line => line.trimEnd()) // trailing whitespace
            .join('\n');
    }
    // ----------------------------------------------------------
    // JSON healing strategies
    // ----------------------------------------------------------
    static healJSON(artifactPath, errors) {
        let content = fs.readFileSync(artifactPath, 'utf-8');
        let repaired = false;
        // Strategy 1: Remove trailing commas (common JSON error)
        const withoutTrailingCommas = content.replace(/,(\s*[}\]])/g, '$1');
        if (withoutTrailingCommas !== content) {
            content = withoutTrailingCommas;
            repaired = true;
            shared_1.logger.info(`SHG: Removed trailing commas from JSON.`);
        }
        // Strategy 2: Try to parse and re-serialize (normalizes formatting)
        try {
            const parsed = JSON.parse(content);
            const normalized = JSON.stringify(parsed, null, 2);
            if (normalized !== content) {
                content = normalized;
                repaired = true;
                shared_1.logger.info(`SHG: Re-serialized JSON to normalize formatting.`);
            }
        }
        catch {
            // Can't parse — leave as-is for next cycle
        }
        if (repaired) {
            fs.writeFileSync(artifactPath, content, 'utf-8');
        }
        return repaired;
    }
    // ----------------------------------------------------------
    // Generic healing (TypeScript, plain text)
    // ----------------------------------------------------------
    static healGeneric(artifactPath, errors, graph) {
        // For uvt.config.ts or playwright.config.ts — regenerate from graph
        const basename = path.basename(artifactPath);
        if (basename === 'uvt.config.ts') {
            fs.writeFileSync(artifactPath, generator_planner_js_1.GeneratorPlanner.generateUVTConfig(graph), 'utf-8');
            shared_1.logger.info(`SHG: Regenerated uvt.config.ts from CapabilityGraph.`);
            return true;
        }
        if (basename === 'playwright.config.ts') {
            fs.writeFileSync(artifactPath, generator_planner_js_1.GeneratorPlanner.generatePlaywrightConfig(graph), 'utf-8');
            shared_1.logger.info(`SHG: Regenerated playwright.config.ts from CapabilityGraph.`);
            return true;
        }
        return false;
    }
    /**
     * Validate → heal loop for a batch of artifacts.
     * Returns summary of healing operations.
     */
    static async validateAndHeal(artifactPaths, graph) {
        const reports = [];
        for (const artifactPath of artifactPaths) {
            const result = await artifact_validator_js_1.ArtifactValidator.validate(artifactPath);
            if (!result.valid) {
                const report = await SelfHealingGenerator.heal(artifactPath, result.errors, graph);
                reports.push(report);
            }
            else {
                reports.push({ artifact: artifactPath, cycles: 0, healed: true, finalErrors: [] });
            }
        }
        return reports;
    }
}
exports.SelfHealingGenerator = SelfHealingGenerator;
//# sourceMappingURL=self-healing-generator.js.map