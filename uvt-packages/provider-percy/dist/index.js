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
exports.PercyProvider = void 0;
const playwright_1 = __importDefault(require("@percy/playwright"));
const shared_1 = require("@uvt/shared");
const http = __importStar(require("http"));
class PercyProvider {
    name = 'percy';
    apiVersion = 1;
    percyRunning = false;
    async initialize(options) {
        shared_1.logger.debug('Percy Provider initializing...');
        if (options.isSelective) {
            shared_1.logger.info('Selective run detected. Percy Partial Build mode temporarily DISABLED for diagnostic audit.');
        }
        // Check if Percy agent is running
        this.percyRunning = !!process.env.PERCY_SERVER_ADDRESS || await this.checkPercyAgent();
        if (this.percyRunning) {
            shared_1.logger.success('Percy agent detected and connected successfully.');
        }
        else {
            shared_1.logger.warn('Percy agent not detected. UVT is running in standalone mode.');
            shared_1.logger.warn('To upload to Percy, wrap your test command: `npx percy exec -- npx uvt test`');
        }
    }
    async snapshot(page, opts) {
        if (!page) {
            throw new Error('Playwright page instance is required for Percy snapshots.');
        }
        const { name, url, route } = opts;
        if (!this.percyRunning) {
            shared_1.logger.warn(`Skipping upload to Percy for "${name}" (Percy agent is not running).`);
            // Capture a local screenshot as fallback so the report still shows latest images!
            const screenshotDir = require('path').join(process.cwd(), '.uvt', 'screenshots', 'latest');
            require('fs').mkdirSync(screenshotDir, { recursive: true });
            const fallbackPath = require('path').join(screenshotDir, `${name}.png`);
            await page.screenshot({ path: fallbackPath, fullPage: true });
            if (route) {
                route.metadata = route.metadata || {};
                route.metadata.screenshotPath = fallbackPath;
            }
            return;
        }
        shared_1.logger.info(`Sending DOM snapshot "${name}" to Percy...`);
        await (0, playwright_1.default)(page, name);
    }
    async finalize() {
        if (this.percyRunning) {
            shared_1.logger.success('All snapshots sent to Percy successfully.');
        }
    }
    checkPercyAgent() {
        return new Promise((resolve) => {
            const req = http.request({
                host: 'localhost',
                port: 5338,
                path: '/percy/healthcheck',
                method: 'GET',
                timeout: 1000
            }, (res) => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => {
                resolve(false);
            });
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });
            req.end();
        });
    }
}
exports.PercyProvider = PercyProvider;
//# sourceMappingURL=index.js.map