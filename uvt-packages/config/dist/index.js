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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.configSchema = void 0;
exports.loadConfig = loadConfig;
const zod_1 = require("zod");
const jiti_1 = __importDefault(require("jiti"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const shared_1 = require("@uvt/shared");
// ==========================================
// Zod Schema Validation
// ==========================================
exports.configSchema = zod_1.z.object({
    provider: zod_1.z.string().default('playwright'),
    framework: zod_1.z.union([
        zod_1.z.literal('auto'),
        zod_1.z.literal('react'),
        zod_1.z.literal('next'),
        zod_1.z.literal('vue'),
        zod_1.z.literal('angular'),
        zod_1.z.literal('svelte')
    ]).default('auto'),
    cache: zod_1.z.boolean().default(true),
    workers: zod_1.z.union([zod_1.z.literal('auto'), zod_1.z.number().int().positive()]).default('auto'),
    report: zod_1.z.object({
        html: zod_1.z.boolean().default(true),
        json: zod_1.z.boolean().default(true)
    }).default({ html: true, json: true }),
    dynamicDetection: zod_1.z.boolean().default(true)
});
// ==========================================
// Default Configuration
// ==========================================
// Visual comparison service provider ("percy" or "playwright")
// Add provider: 'playwright',if needed
exports.DEFAULT_CONFIG = {
    provider: 'percy',
    framework: 'auto',
    cache: true,
    workers: 'auto',
    report: {
        html: true,
        json: true
    },
    dynamicDetection: true
};
// ==========================================
// Loader Function
// ==========================================
async function loadConfig(cwd) {
    const configNames = [
        'uvt.config.ts',
        'uvt.config.js',
        'uvt.config.mjs',
        'uvt.config.cjs'
    ];
    let configPath = null;
    for (const name of configNames) {
        const fullPath = path.join(cwd, name);
        if (fs.existsSync(fullPath)) {
            configPath = fullPath;
            break;
        }
    }
    if (!configPath) {
        shared_1.logger.debug('No configuration file found. Using default config.');
        return exports.configSchema.parse(exports.DEFAULT_CONFIG);
    }
    shared_1.logger.debug(`Found configuration file at: ${configPath}`);
    try {
        // Initialize jiti loader relative to workspace cwd
        const loader = (0, jiti_1.default)(cwd, { cache: false, esmResolve: true, interopDefault: true });
        const importedConfig = loader(configPath);
        // Validate configuration
        const parsed = exports.configSchema.safeParse(importedConfig);
        if (!parsed.success) {
            shared_1.logger.error('Invalid configuration fields detected in config file:');
            parsed.error.errors.forEach(err => {
                shared_1.logger.error(`  - Path: "${err.path.join('.')}" -> ${err.message}`);
            });
            throw new Error('Config validation failed.');
        }
        return parsed.data;
    }
    catch (error) {
        shared_1.logger.warn(`Failed to parse configuration file: ${error.message}. Falling back to default configuration.`);
        return exports.configSchema.parse(exports.DEFAULT_CONFIG);
    }
}
//# sourceMappingURL=index.js.map