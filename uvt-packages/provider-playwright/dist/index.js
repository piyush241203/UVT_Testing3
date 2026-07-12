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
exports.PlaywrightProvider = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pixelmatch_1 = __importDefault(require("pixelmatch"));
const pngjs_1 = require("pngjs");
const shared_1 = require("@uvt/shared");
class PlaywrightProvider {
    name = 'playwright';
    apiVersion = 1;
    cwd;
    latestDir;
    baselineDir;
    diffDir;
    async initialize(options) {
        this.cwd = options.cwd;
        const screenshotsDir = path.join(this.cwd, '.uvt', 'screenshots');
        this.latestDir = path.join(screenshotsDir, 'latest');
        this.baselineDir = path.join(screenshotsDir, 'baseline');
        this.diffDir = path.join(screenshotsDir, 'diffs');
        fs.mkdirSync(this.latestDir, { recursive: true });
        fs.mkdirSync(this.baselineDir, { recursive: true });
        fs.mkdirSync(this.diffDir, { recursive: true });
        shared_1.logger.debug('Playwright Native Screenshot Provider initialized.');
    }
    async snapshot(page, opts) {
        if (!page) {
            throw new Error('Playwright page instance is required for native snapshots.');
        }
        const { name, url, route } = opts;
        const filename = `${name}.png`;
        const latestPath = path.join(this.latestDir, filename);
        const baselinePath = path.join(this.baselineDir, filename);
        const diffPath = path.join(this.diffDir, filename);
        // 1. Capture snapshot
        await page.screenshot({ path: latestPath, fullPage: true });
        shared_1.logger.debug(`Captured screenshot for ${name} at ${latestPath}`);
        // Update the route metadata in results
        if (route) {
            // Set relative or absolute paths for the reporter
            route.metadata = route.metadata || {};
            route.metadata.screenshotPath = latestPath;
        }
        // 2. Check baseline existence
        if (!fs.existsSync(baselinePath)) {
            shared_1.logger.info(`No baseline snapshot found for ${name}. Creating new baseline...`);
            fs.copyFileSync(latestPath, baselinePath);
            return;
        }
        // 3. Perform image comparison
        shared_1.logger.debug(`Comparing ${name} against baseline...`);
        const result = this.compareImages(baselinePath, latestPath, diffPath);
        if (result.diffPixels > 0) {
            const percentage = ((result.diffPixels / (result.width * result.height)) * 100).toFixed(2);
            shared_1.logger.warn(`Visual difference detected for "${name}": ${result.diffPixels} pixels (${percentage}%) differ.`);
            if (route) {
                route.metadata.diffPath = diffPath;
            }
            if (result.diffPixels > 100) { // arbitrary small threshold (e.g. 100 pixels) to avoid noise
                throw new Error(`Visual regression detected: ${percentage}% differences.`);
            }
        }
        else {
            shared_1.logger.success(`Visual snapshot matches baseline for "${name}".`);
        }
    }
    async finalize() {
        shared_1.logger.debug('Playwright Provider final check.');
    }
    compareImages(img1Path, img2Path, diffPath) {
        const img1 = pngjs_1.PNG.sync.read(fs.readFileSync(img1Path));
        const img2 = pngjs_1.PNG.sync.read(fs.readFileSync(img2Path));
        const width = Math.max(img1.width, img2.width);
        const height = Math.max(img1.height, img2.height);
        const img1Resized = this.resizeImage(img1, width, height);
        const img2Resized = this.resizeImage(img2, width, height);
        const diff = new pngjs_1.PNG({ width, height });
        const diffPixels = (0, pixelmatch_1.default)(img1Resized.data, img2Resized.data, diff.data, width, height, { threshold: 0.1 });
        if (diffPixels > 0) {
            fs.writeFileSync(diffPath, pngjs_1.PNG.sync.write(diff));
        }
        return { diffPixels, width, height };
    }
    resizeImage(src, width, height) {
        if (src.width === width && src.height === height) {
            return src;
        }
        const dst = new pngjs_1.PNG({ width, height });
        // Fill with empty alpha/transparent
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (width * y + x) << 2;
                if (x < src.width && y < src.height) {
                    const srcIdx = (src.width * y + x) << 2;
                    dst.data[idx] = src.data[srcIdx];
                    dst.data[idx + 1] = src.data[srcIdx + 1];
                    dst.data[idx + 2] = src.data[srcIdx + 2];
                    dst.data[idx + 3] = src.data[srcIdx + 3];
                }
                else {
                    dst.data[idx] = 0;
                    dst.data[idx + 1] = 0;
                    dst.data[idx + 2] = 0;
                    dst.data[idx + 3] = 0;
                }
            }
        }
        return dst;
    }
}
exports.PlaywrightProvider = PlaywrightProvider;
//# sourceMappingURL=index.js.map