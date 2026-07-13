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
exports.ArtifactWriter = void 0;
/**
 * Artifact Writer — RC-04 URAE
 *
 * Writes an ExecutionPlan to the filesystem, then runs the
 * Artifact Validation Engine + Self-Healing Generator on each artifact.
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const shared_1 = require("@uvt/shared");
const self_healing_generator_js_1 = require("../validation/self-healing-generator.js");
const artifact_validator_js_1 = require("../validation/artifact-validator.js");
class ArtifactWriter {
    /**
     * Write all artifacts in the ExecutionPlan to the filesystem.
     * Validate and heal each marked artifact automatically.
     */
    static async write(cwd, plan, graph) {
        const results = [];
        // 1. Write config files
        for (const artifact of plan.configFiles) {
            const result = await ArtifactWriter.writeArtifact(cwd, artifact, graph);
            results.push(result);
        }
        // 2. Write CI workflow
        const ciResult = await ArtifactWriter.writeArtifact(cwd, plan.ciWorkflow, graph);
        results.push(ciResult);
        // 3. Update .gitignore
        ArtifactWriter.updateGitignore(cwd, plan.ignoreEntries);
        // 4. Write .env.example
        const envPath = path.join(cwd, '.env.example');
        if (!fs.existsSync(envPath)) {
            fs.writeFileSync(envPath, plan.envTemplate, 'utf-8');
            shared_1.logger.success('Created .env.example');
        }
        return results;
    }
    static async writeArtifact(cwd, artifact, graph) {
        const fullPath = path.join(cwd, artifact.relativePath);
        const dir = path.dirname(fullPath);
        const basename = path.basename(fullPath);
        fs.mkdirSync(dir, { recursive: true });
        // Don't overwrite user-edited files (uvt.config.ts, playwright.config.ts)
        const userEditable = ['uvt.config.ts', 'playwright.config.ts'];
        if (userEditable.includes(basename) && fs.existsSync(fullPath)) {
            shared_1.logger.warn(`Skipping ${basename} (already exists — user-editable).`);
            return { path: fullPath, written: false, skipped: true, healed: false, errors: [] };
        }
        // Write
        fs.writeFileSync(fullPath, artifact.content, 'utf-8');
        shared_1.logger.success(`Written: ${artifact.relativePath}`);
        // Validate + heal if required
        if (artifact.validate) {
            const validation = await artifact_validator_js_1.ArtifactValidator.validate(fullPath);
            if (!validation.valid) {
                const report = await self_healing_generator_js_1.SelfHealingGenerator.heal(fullPath, validation.errors, graph);
                return {
                    path: fullPath,
                    written: true,
                    skipped: false,
                    healed: report.healed,
                    errors: report.finalErrors.map(e => e.message)
                };
            }
        }
        return { path: fullPath, written: true, skipped: false, healed: false, errors: [] };
    }
    static updateGitignore(cwd, entries) {
        const gitignorePath = path.join(cwd, '.gitignore');
        let content = fs.existsSync(gitignorePath)
            ? fs.readFileSync(gitignorePath, 'utf-8')
            : '';
        let modified = false;
        for (const entry of entries) {
            if (!content.includes(entry)) {
                content += `\n${entry}`;
                modified = true;
            }
        }
        if (modified) {
            fs.writeFileSync(gitignorePath, content.trim() + '\n', 'utf-8');
            shared_1.logger.success('Updated .gitignore');
        }
    }
}
exports.ArtifactWriter = ArtifactWriter;
//# sourceMappingURL=artifact-writer.js.map