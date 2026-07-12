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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
class PercyProvider {
    name = 'percy';
    apiVersion = 1;
    percyRunning = false;
    startedPercyProcess = null;
    async initialize(options) {
        shared_1.logger.debug('Percy Provider initializing...');
        if (options.isSelective) {
            process.env.PERCY_PARTIAL_BUILD = '1';
            shared_1.logger.info('Selective run detected. Enabled Percy Partial Build mode (PERCY_PARTIAL_BUILD=1).');
        }
        // Check if Percy agent is running
        this.percyRunning = await this.checkPercyAgent();
        if (!this.percyRunning) {
            // Clear stale lock files before attempting to start
            await this.clearStalePercyLock();
            // Re-check after clearing — a parallel engine instance may have started Percy
            // in the time between our first check and the lock cleanup
            this.percyRunning = await this.checkPercyAgent();
        }
        if (!this.percyRunning) {
            shared_1.logger.info('Percy agent not detected. Starting Percy CLI server in background...');
            try {
                const percyProc = (0, child_process_1.exec)('npx percy exec:start', { cwd: options.cwd, env: process.env });
                // Log child process logs for debugging
                percyProc.stdout?.on('data', (data) => shared_1.logger.info(`[Percy CLI Out]: ${data.toString().trim()}`));
                percyProc.stderr?.on('data', (data) => shared_1.logger.info(`[Percy CLI Err]: ${data.toString().trim()}`));
                // Poll health check every 1000ms up to 60 times (60s max wait time to allow Chromium downloads).
                // Also handles the race where a parallel engine instance won the spawn race —
                // Percy will be reachable even if our spawn got rejected with 'port already in use'.
                let isStarted = false;
                for (let i = 0; i < 60; i++) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    if (await this.checkPercyAgent()) {
                        isStarted = true;
                        break;
                    }
                }
                this.percyRunning = isStarted;
                if (this.percyRunning) {
                    shared_1.logger.success('Percy CLI server started and connected successfully in background.');
                    this.startedPercyProcess = percyProc;
                }
                else {
                    throw new Error('Failed to auto-start Percy agent. Please ensure you run visual tests wrapped with Percy CLI or check your PERCY_TOKEN, e.g.:\n' +
                        '  npx percy exec -- uvt run');
                }
            }
            catch (err) {
                throw new Error(`Error trying to start Percy agent: ${err.message}`);
            }
        }
        else {
            shared_1.logger.success('Percy agent detected and connected successfully.');
        }
    }
    /**
     * Removes stale Percy agent lock files and kills orphan processes on port 5338.
     * This prevents "port already in use" errors between consecutive uvt run invocations.
     */
    async clearStalePercyLock() {
        const percyDir = path.join(os.homedir(), '.percy');
        const lockPattern = /^agent-\d+\.lock$/;
        try {
            if (fs.existsSync(percyDir)) {
                const files = fs.readdirSync(percyDir);
                for (const file of files) {
                    if (lockPattern.test(file)) {
                        const lockPath = path.join(percyDir, file);
                        fs.rmSync(lockPath, { force: true });
                        shared_1.logger.debug(`Removed stale Percy lock file: ${lockPath}`);
                    }
                }
            }
        }
        catch (e) {
            shared_1.logger.debug(`Could not clear Percy lock files: ${e.message}`);
        }
        // On Windows: kill process using port 5338 (if any)
        try {
            if (process.platform === 'win32') {
                (0, child_process_1.execSync)('for /f "tokens=5" %a in (\'netstat -aon ^| findstr :5338\') do taskkill /F /PID %a', {
                    shell: 'cmd.exe',
                    stdio: 'ignore'
                });
            }
            else {
                (0, child_process_1.execSync)('fuser -k 5338/tcp', { stdio: 'ignore' });
            }
            shared_1.logger.debug('Cleared orphan process on Percy port 5338.');
        }
        catch {
            // No process was running — this is expected and fine
        }
        // Brief pause to allow OS to release the port
        await new Promise((resolve) => setTimeout(resolve, 500));
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
        if (this.startedPercyProcess) {
            shared_1.logger.info('Stopping background Percy CLI server...');
            try {
                (0, child_process_1.exec)('npx percy exec:stop', { cwd: process.cwd() });
                await new Promise((resolve) => setTimeout(resolve, 2000));
                this.startedPercyProcess.kill();
            }
            catch { }
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