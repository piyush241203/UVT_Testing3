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
    autoStarted = false;
    async prepare(options) {
        shared_1.logger.debug('Percy Provider pre-flight check...');
        if (process.env.PERCY_TOKEN) {
            const token = process.env.PERCY_TOKEN;
            const masked = `${token.slice(0, 4)}****${token.slice(-4)}`;
            shared_1.logger.info(`Percy Provider: PERCY_TOKEN present (${masked}). Provider is configured.`);
        }
        else {
            shared_1.logger.warn('Percy Provider: PERCY_TOKEN not set. Snapshots will be captured locally only (standalone mode).');
            shared_1.logger.warn('To enable Percy uploads: set PERCY_TOKEN in your environment or CI secrets.');
        }
    }
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
        else if (process.env.PERCY_TOKEN) {
            shared_1.logger.info('Percy agent not detected. Starting Percy CLI server in background...');
            const started = await this.startPercyAgent();
            if (started) {
                shared_1.logger.success('Percy CLI server started and connected successfully in background.');
                this.percyRunning = true;
                this.autoStarted = true;
            }
            else {
                shared_1.logger.warn('Failed to start background Percy server. UVT will run in standalone mode.');
            }
        }
        else {
            shared_1.logger.warn('Percy agent not detected and PERCY_TOKEN not set. UVT is running in standalone mode.');
            shared_1.logger.warn('To upload to Percy, either set PERCY_TOKEN or wrap your test command: `npx percy exec -- npx uvt test`');
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
        const percyPromise = (0, playwright_1.default)(page, name);
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error(`Percy snapshot timed out after 15 seconds for ${name}`)), 15000);
        });
        await Promise.race([percyPromise, timeoutPromise]);
    }
    async finalize() {
        if (this.percyRunning) {
            shared_1.logger.success('All snapshots sent to Percy successfully.');
            shared_1.logger.info('Finalizing Percy build and stopping local agent...');
            const stopped = await this.stopPercyAgent();
            if (stopped) {
                shared_1.logger.success('Percy build finalized and local agent stopped successfully.');
            }
            else {
                shared_1.logger.warn('Failed to stop Percy agent via API. Falling back to command line...');
                try {
                    const isWin = process.platform === 'win32';
                    const cmd = isWin ? 'npx.cmd' : 'npx';
                    require('child_process').execSync(`${cmd} percy exec:stop`, { stdio: 'ignore' });
                    shared_1.logger.success('Percy build finalized via command line.');
                }
                catch (e) {
                    shared_1.logger.error('Failed to stop background Percy server.');
                }
            }
        }
    }
    stopPercyAgent() {
        return new Promise((resolve) => {
            const req = http.request({
                host: '127.0.0.1',
                port: 5338,
                path: '/percy/stop',
                method: 'POST',
                timeout: 15000
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
    startPercyAgent() {
        return new Promise((resolve) => {
            const isWin = process.platform === 'win32';
            const cmd = isWin ? 'npx.cmd' : 'npx';
            const fs = require('fs');
            const path = require('path');
            const uvtDir = path.join(process.cwd(), '.uvt');
            if (!fs.existsSync(uvtDir)) {
                fs.mkdirSync(uvtDir, { recursive: true });
            }
            const logFd = fs.openSync(path.join(uvtDir, 'percy.log'), 'a');
            const child = require('child_process').spawn(cmd, ['--yes', 'percy', 'exec:start'], {
                detached: !isWin,
                stdio: ['ignore', logFd, logFd],
                env: process.env,
                shell: isWin
            });
            child.unref();
            let attempts = 0;
            const interval = setInterval(async () => {
                attempts++;
                if (await this.checkPercyAgent()) {
                    clearInterval(interval);
                    resolve(true);
                }
                else if (attempts > 60) {
                    clearInterval(interval);
                    resolve(false);
                }
            }, 500);
        });
    }
    checkPercyAgent() {
        return new Promise((resolve) => {
            const req = http.request({
                host: '127.0.0.1',
                port: 5338,
                path: '/percy/healthcheck',
                method: 'GET',
                timeout: 1000
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve(res.statusCode === 200 && json.success === true);
                    }
                    catch (e) {
                        resolve(false);
                    }
                });
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