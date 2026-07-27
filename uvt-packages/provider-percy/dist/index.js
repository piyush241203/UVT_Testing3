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
const cp = __importStar(require("child_process"));
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
        // ─── Case 1: Already inside `percy exec` ──────────────────────────────
        // When `percy exec` wraps us, it sets PERCY_SERVER_ADDRESS automatically.
        // In that case the agent is definitely running — just connect to it.
        if (process.env.PERCY_SERVER_ADDRESS) {
            shared_1.logger.success(`Percy exec wrapper detected (PERCY_SERVER_ADDRESS=${process.env.PERCY_SERVER_ADDRESS}). Connecting to Percy agent...`);
            const connected = await this.checkPercyAgent();
            if (connected) {
                shared_1.logger.success('Percy agent connected successfully via percy exec wrapper.');
                this.percyRunning = true;
                this.autoStarted = false;
                return;
            }
            // PERCY_SERVER_ADDRESS set but agent ping failed — still trust it, percy/playwright SDK will handle it
            shared_1.logger.warn('PERCY_SERVER_ADDRESS is set but healthcheck ping timed out. Trusting percy exec — continuing.');
            this.percyRunning = true;
            this.autoStarted = false;
            return;
        }
        // ─── Case 2: Agent already running on default port ────────────────────
        const alreadyRunning = await this.checkPercyAgent();
        if (alreadyRunning) {
            shared_1.logger.success('Percy agent detected and connected successfully.');
            this.percyRunning = true;
            this.autoStarted = false;
            return;
        }
        // ─── Case 3: No agent, PERCY_TOKEN present → relaunch via `percy exec` ─
        // This is the canonical Percy integration: `percy exec -- <command>`.
        // Instead of trying to spawn a background daemon (which is unreliable on
        // Windows), we relaunch the entire current process wrapped inside percy exec.
        if (process.env.PERCY_TOKEN) {
            shared_1.logger.info('Percy agent not detected. Relaunching UVT inside `percy exec` wrapper for reliable Percy integration...');
            this._relaunchInsidePercyExec();
            // _relaunchInsidePercyExec calls process.exit() after spawning child — this line never runs
            return;
        }
        // ─── Case 4: No token — standalone mode ───────────────────────────────
        shared_1.logger.warn('Percy agent not detected and PERCY_TOKEN not set. UVT is running in standalone mode.');
        shared_1.logger.warn('To upload to Percy, set PERCY_TOKEN: `$env:PERCY_TOKEN="web_..."` then run `uvt test`');
    }
    /**
     * Relaunch the current UVT process inside `percy exec -- <same command>`.
     *
     * This is the correct Percy integration pattern:
     *   npx percy exec -- node bin.js test --port 3000
     *
     * Percy exec starts the Percy agent, sets PERCY_SERVER_ADDRESS, then runs the
     * child command. The child process inherits PERCY_SERVER_ADDRESS and will hit
     * Case 1 on re-entry to initialize(), connecting to the running agent.
     *
     * NOTE: On Windows, node.exe may live in a path with spaces (e.g. C:\Program Files\nodejs).
     * We must quote the node executable path to prevent the shell from splitting it.
     */
    _relaunchInsidePercyExec() {
        const isWin = process.platform === 'win32';
        // Build the percy exec relaunch command:
        //   npx percy exec -- node <current entry point> <original args>
        const nodeExe = process.execPath;
        const originalArgv = process.argv.slice(1); // [scriptPath, ...args]
        // On Windows, node.exe may be in "C:\Program Files\nodejs" — a path with spaces.
        // We must use shell:true with a quoted command string so the shell doesn't split on spaces.
        // spawnSync with shell:true accepts a command string where we can embed quotes.
        const quoted = (s) => (s.includes(' ') ? `"${s}"` : s);
        const quotedNode = quoted(nodeExe);
        const quotedArgs = originalArgv.map(quoted).join(' ');
        if (isWin) {
            // Windows: use shell=true + quoted command string to handle paths with spaces
            const cmd = `npx.cmd --yes percy exec -- ${quotedNode} ${quotedArgs}`;
            shared_1.logger.info(`Executing (Windows shell): ${cmd}`);
            cp.spawnSync(cmd, [], {
                stdio: 'inherit',
                env: { ...process.env },
                shell: true,
                cwd: process.cwd()
            });
        }
        else {
            // Unix: spawnSync is safe — no path-with-spaces issues on node paths
            const percyArgs = ['--yes', 'percy', 'exec', '--', nodeExe, ...originalArgv];
            shared_1.logger.info(`Executing: npx ${percyArgs.join(' ')}`);
            cp.spawnSync('npx', percyArgs, {
                stdio: 'inherit',
                env: { ...process.env },
                shell: false,
                cwd: process.cwd()
            });
        }
        process.exit(0);
    }
    async snapshot(page, opts) {
        if (!page) {
            throw new Error('Playwright page instance is required for Percy snapshots.');
        }
        const { name, url, route } = opts;
        if (!this.percyRunning) {
            shared_1.logger.warn(`Skipping upload to Percy for "${name}" (Percy agent is not running).`);
            // Capture a local screenshot as fallback so the report still shows latest images
            const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
            const screenshotDir = require('path').join(process.cwd(), '.uvt', 'screenshots', 'latest');
            require('fs').mkdirSync(screenshotDir, { recursive: true });
            const fallbackPath = require('path').join(screenshotDir, `${safeName}.png`);
            await page.screenshot({ path: fallbackPath, fullPage: true });
            if (route) {
                route.metadata = route.metadata || {};
                route.metadata.screenshotPath = fallbackPath;
            }
            return;
        }
        shared_1.logger.info(`Sending DOM snapshot "${name}" to Percy...`);
        // Small stabilization wait to ensure page JS has settled before Percy serializes the DOM
        await new Promise(resolve => setTimeout(resolve, 500));
        // Verify page is still open before attempting snapshot
        try {
            await page.evaluate(() => true); // lightweight check
        }
        catch (e) {
            shared_1.logger.warn(`Page appears closed before Percy snapshot for "${name}". Skipping.`);
            return;
        }
        const percyPromise = (0, playwright_1.default)(page, name);
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error(`Percy snapshot timed out after 90 seconds for ${name}`)), 90000);
        });
        await Promise.race([percyPromise, timeoutPromise]);
    }
    async finalize() {
        if (this.percyRunning) {
            shared_1.logger.success('All snapshots sent to Percy successfully.');
            if (this.autoStarted) {
                // We started Percy ourselves, so we need to stop it
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
                        require('child_process').execSync(`${cmd} percy stop`, { stdio: 'ignore' });
                        shared_1.logger.success('Percy build finalized via command line.');
                    }
                    catch (e) {
                        shared_1.logger.error('Failed to stop background Percy server.');
                    }
                }
            }
            else {
                // Percy was started externally (e.g. by `percy exec`), don't stop it
                shared_1.logger.info('Percy agent managed externally (e.g. via percy exec). Skipping stop.');
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
    async checkPercyAgent() {
        const addressesToTry = [];
        if (process.env.PERCY_SERVER_ADDRESS) {
            addressesToTry.push(process.env.PERCY_SERVER_ADDRESS);
        }
        addressesToTry.push('http://127.0.0.1:5338');
        addressesToTry.push('http://localhost:5338');
        for (const addr of addressesToTry) {
            try {
                const url = new URL('/percy/healthcheck', addr);
                const ok = await this.pingHealthcheck(url.hostname, url.port ? parseInt(url.port, 10) : 5338);
                if (ok)
                    return true;
            }
            catch (e) { }
        }
        return false;
    }
    pingHealthcheck(host, port) {
        return new Promise((resolve) => {
            const req = http.request({
                host,
                port,
                path: '/percy/healthcheck',
                method: 'GET',
                timeout: 1000
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
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
            req.on('error', () => resolve(false));
            req.on('timeout', () => { req.destroy(); resolve(false); });
            req.end();
        });
    }
}
exports.PercyProvider = PercyProvider;
//# sourceMappingURL=index.js.map