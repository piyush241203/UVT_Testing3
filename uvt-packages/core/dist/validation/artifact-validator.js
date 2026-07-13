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
exports.ArtifactValidator = void 0;
/**
 * Artifact Validation Engine (AVE) — RC-04 URAE
 *
 * Validates every generated artifact immediately after writing.
 * Works with the Self-Healing Generator (SHG) to repair failures
 * without requiring manual developer intervention.
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const shared_1 = require("@uvt/shared");
// ============================================================
// Artifact Validator
// ============================================================
class ArtifactValidator {
    /**
     * Validate a single generated artifact by inferring its type from the path.
     */
    static async validate(artifactPath) {
        if (!fs.existsSync(artifactPath)) {
            return {
                artifact: artifactPath,
                valid: false,
                errors: [{ message: `Artifact does not exist at path: ${artifactPath}` }]
            };
        }
        const ext = path.extname(artifactPath).toLowerCase();
        const basename = path.basename(artifactPath).toLowerCase();
        if (basename === 'package.json') {
            return ArtifactValidator.validateJSON(artifactPath, ['name', 'version']);
        }
        else if (ext === '.yml' || ext === '.yaml') {
            return ArtifactValidator.validateYAML(artifactPath);
        }
        else if (ext === '.json' && basename !== 'package.json') {
            return ArtifactValidator.validateJSON(artifactPath);
        }
        // Default: file exists and is non-empty
        const content = fs.readFileSync(artifactPath, 'utf-8').trim();
        if (!content) {
            return {
                artifact: artifactPath,
                valid: false,
                errors: [{ message: 'Artifact is empty.' }]
            };
        }
        return { artifact: artifactPath, valid: true, errors: [] };
    }
    /**
     * Validate YAML syntax using safe structural parsing.
     * Does not require js-yaml as a dependency — uses a lightweight
     * indentation and key-check approach.
     */
    static validateYAML(artifactPath) {
        const content = fs.readFileSync(artifactPath, 'utf-8');
        const errors = [];
        const lines = content.split('\n');
        // Check for GitHub Actions specific required top-level keys
        const isGHA = artifactPath.includes('.github/workflows');
        if (isGHA) {
            if (!content.includes('name:')) {
                errors.push({ message: 'GitHub Actions workflow missing "name:" key.' });
            }
            if (!content.includes('on:')) {
                errors.push({ message: 'GitHub Actions workflow missing "on:" trigger key.' });
            }
            if (!content.includes('jobs:')) {
                errors.push({ message: 'GitHub Actions workflow missing "jobs:" key.' });
            }
            if (!content.includes('runs-on:')) {
                errors.push({ message: 'GitHub Actions workflow missing "runs-on:" in jobs.' });
            }
            if (!content.includes('steps:')) {
                errors.push({ message: 'GitHub Actions workflow missing "steps:" in jobs.' });
            }
        }
        // Check for Percy config specific required keys
        const isPercy = path.basename(artifactPath) === '.percy.yml';
        if (isPercy) {
            if (!content.includes('version:')) {
                errors.push({ message: 'Percy config missing "version:" key.' });
            }
        }
        // Structural check: detect obvious YAML syntax issues
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Check for tab indentation (YAML only allows spaces)
            if (/^\t/.test(line)) {
                errors.push({
                    line: i + 1,
                    message: `Tab indentation detected at line ${i + 1}. YAML requires spaces.`
                });
            }
            // Check for mismatched quotes
            const singleQuotes = (line.match(/'/g) || []).length;
            const doubleQuotes = (line.match(/"/g) || []).length;
            // Only flag clearly unbalanced quotes (non-escaped)
            if (singleQuotes % 2 !== 0 && !line.trim().startsWith('#')) {
                errors.push({
                    line: i + 1,
                    message: `Possible unbalanced single quote at line ${i + 1}.`
                });
            }
        }
        return {
            artifact: artifactPath,
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Validate JSON syntax and optionally check required fields.
     */
    static validateJSON(artifactPath, requiredFields) {
        const content = fs.readFileSync(artifactPath, 'utf-8');
        const errors = [];
        let parsed;
        try {
            parsed = JSON.parse(content);
        }
        catch (e) {
            return {
                artifact: artifactPath,
                valid: false,
                errors: [{ message: `JSON parse error: ${e.message}` }]
            };
        }
        if (requiredFields) {
            for (const field of requiredFields) {
                if (!(field in parsed)) {
                    errors.push({ field, message: `Required field "${field}" is missing.` });
                }
            }
        }
        return {
            artifact: artifactPath,
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Validate a batch of artifacts and return aggregated results.
     */
    static async validateAll(artifactPaths) {
        const results = [];
        for (const p of artifactPaths) {
            const r = await ArtifactValidator.validate(p);
            if (!r.valid) {
                shared_1.logger.warn(`AVE: Validation failed for ${path.basename(p)}: ${r.errors.map(e => e.message).join('; ')}`);
            }
            else {
                shared_1.logger.debug(`AVE: ${path.basename(p)} ✔ valid`);
            }
            results.push(r);
        }
        return results;
    }
}
exports.ArtifactValidator = ArtifactValidator;
//# sourceMappingURL=artifact-validator.js.map