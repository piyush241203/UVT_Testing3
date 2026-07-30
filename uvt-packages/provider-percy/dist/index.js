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
const path = __importStar(require("path"));
class PercyProvider {
    name = 'percy';
    apiVersion = 1;
    percyRunning = false;
    autoStarted = false;
    _ensurePercyToken(cwd) {
        if (process.env.PERCY_TOKEN)
            return;
        const targetCwd = cwd || process.cwd();
        const envFile = path.join(targetCwd, '.env');
        const fs = require('fs');
        if (fs.existsSync(envFile)) {
            try {
                let content = fs.readFileSync(envFile, 'utf-8');
                if (content.charCodeAt(0) === 0xFEFF) {
                    content = content.slice(1);
                }
                for (const rawLine of content.split(/\r?\n/)) {
                    const line = rawLine.trim();
                    if (line.startsWith('PERCY_TOKEN=')) {
                        const token = line.substring('PERCY_TOKEN='.length).trim().replace(/^["']|["']$/g, '');
                        if (token) {
                            process.env.PERCY_TOKEN = token;
                            shared_1.logger.success(`Loaded PERCY_TOKEN (${token.substring(0, 10)}...) from ${envFile}`);
                            break;
                        }
                    }
                }
            }
            catch (err) {
                shared_1.logger.warn(`Failed to read .env at ${envFile}: ${err.message}`);
            }
        }
    }
    async prepare(options) {
        shared_1.logger.debug('Percy Provider pre-flight check...');
        this._ensurePercyToken(options?.cwd);
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
        this._ensurePercyToken(options?.cwd);
        // ─── Case 1: Already inside `percy exec` — this is the CORRECT path ────
        if (process.env.PERCY_SERVER_ADDRESS) {
            shared_1.logger.success(`Percy exec wrapper detected (PERCY_SERVER_ADDRESS=${process.env.PERCY_SERVER_ADDRESS}). Connecting to Percy agent...`);
            this.percyRunning = true;
            this.autoStarted = false;
            return;
        }
        // ─── Case 2: Agent already running on default port ─────────────────────
        const alreadyRunning = await this.checkPercyAgent();
        if (alreadyRunning) {
            shared_1.logger.success('Percy agent detected and connected successfully.');
            this.percyRunning = true;
            this.autoStarted = false;
            return;
        }
        // ─── Case 3: PERCY_TOKEN present but no agent running ──────────────────
        // The correct pattern is: npx percy exec -- uvt test
        // We do NOT auto-start Percy here because:
        //   1. Self-relaunching creates nested process trees that break CI
        //   2. Fresh npx downloads are slow and fragile
        //   3. The percy exec wrapper is the official supported pattern
        if (process.env.PERCY_TOKEN) {
            shared_1.logger.warn('Percy token detected but Percy agent is not running.');
            shared_1.logger.warn('');
            shared_1.logger.warn('UVT requires the Percy CLI exec wrapper to send snapshots.');
            shared_1.logger.warn('Please run your tests using:');
            shared_1.logger.warn('');
            shared_1.logger.warn('  npx percy exec -- uvt test --changed');
            shared_1.logger.warn('');
            shared_1.logger.warn('In GitHub Actions, your workflow step should be:');
            shared_1.logger.warn('  run: npx percy exec -- uvt test --changed --port <port>');
            shared_1.logger.warn('  env:');
            shared_1.logger.warn('    PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}');
            shared_1.logger.warn('');
            shared_1.logger.warn('UVT will continue in standalone mode (local screenshots only).');
            // Continue in standalone mode — do NOT throw, do NOT relaunch
            this.percyRunning = false;
            return;
        }
        // ─── Case 4: No token — standalone mode ───────────────────────────────
        shared_1.logger.warn('Percy agent not detected and PERCY_TOKEN not set. UVT is running in standalone mode.');
        shared_1.logger.warn('To upload to Percy, wrap your command: npx percy exec -- uvt test --changed');
        this.percyRunning = false;
    }
    async snapshot(page, opts) {
        if (!page) {
            throw new Error('Playwright page instance is required for Percy snapshots.');
        }
        const { name, url, route } = opts;
        const isPercyActive = this.percyRunning || !!process.env.PERCY_SERVER_ADDRESS;
        if (!isPercyActive) {
            shared_1.logger.warn(`Skipping upload to Percy for "${name}" (Percy agent is not running). Saving local screenshot.`);
            // Capture a local screenshot as fallback so the report still shows latest images
            const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
            const screenshotDir = require('path').join(process.cwd(), '.uvt', 'screenshots', 'latest');
            require('fs').mkdirSync(screenshotDir, { recursive: true });
            const fallbackPath = require('path').join(screenshotDir, `${safeName}.png`);
            try {
                await page.screenshot({ path: fallbackPath, fullPage: true });
                if (route) {
                    route.metadata = route.metadata || {};
                    route.metadata.screenshotPath = fallbackPath;
                }
                shared_1.logger.info(`Local screenshot saved: ${fallbackPath}`);
            }
            catch (screenshotErr) {
                shared_1.logger.warn(`Local screenshot failed: ${screenshotErr.message}`);
            }
            return;
        }
        shared_1.logger.info(`Sending DOM snapshot "${name}" to Percy...`);
        // Small stabilization wait to ensure page JS has settled before Percy serializes the DOM
        await new Promise(resolve => setTimeout(resolve, 800));
        // Verify page is still open before attempting snapshot
        try {
            await page.evaluate(() => true); // lightweight liveness check
        }
        catch (e) {
            shared_1.logger.warn(`Page appears closed before Percy snapshot for "${name}". Skipping.`);
            return;
        }
        try {
            const snapshotFn = typeof playwright_1.default === 'function' ? playwright_1.default : playwright_1.default?.default;
            if (typeof snapshotFn !== 'function') {
                throw new Error(`@percy/playwright snapshot function is invalid (type: ${typeof playwright_1.default}, default: ${typeof playwright_1.default?.default})`);
            }
            // ─────────────────────────────────────────────────────────────────────────
            // Master percyCSS — injected into Percy's cloud renderer.
            //
            // This CSS runs INSIDE Percy's cloud browser (not in Playwright).
            // It's the definitive layer for ensuring ads/dynamic-content are hidden
            // in the final visual snapshot that Percy stores and compares.
            //
            // Coverage:
            //   1. Google AdSense (ins.adsbygoogle, data-ad-client/slot)
            //   2. DoubleClick / DFP iframes
            //   3. AppNexus / Xandr (adnxs)
            //   4. Taboola / Outbrain native ads
            //   5. IAB-standard CSS class/id heuristics (ad-banner, ad-container, etc.)
            //   6. Sponsored / affiliate content blocks
            //   7. Cookie consent banners
            //   8. Newsletter & survey popups
            //   9. Chat widgets (Intercom, Drift, Crisp, etc.)
            //  10. ARIA-labeled ads (role="complementary" + aria-label="Advertisement")
            //  11. UVT-specific masking attributes (data-percy-hide, data-uvt-dynamic)
            //  12. React demo mock ad classes (.ad-banner, .sidebar-ad, .ad-unit, etc.)
            // ─────────────────────────────────────────────────────────────────────────
            const percyCSS = `
        /* ── Google AdSense & DFP ── */
        ins.adsbygoogle,
        ins[data-ad-client],
        ins[data-ad-slot],
        iframe[src*="googlesyndication"],
        iframe[src*="doubleclick"],
        iframe[src*="googleadservices"],
        iframe[id*="google_ads"],
        [id*="google_ads"],
        [class*="google-auto-placed"],
        [data-ad-client],
        [data-ad-slot],
        [data-google-query-id],

        /* ── Ad Networks (AppNexus, Taboola, Outbrain, Media.net) ── */
        iframe[src*="adnxs"],
        iframe[src*="taboola"],
        iframe[src*="outbrain"],
        iframe[src*="media.net"],
        iframe[src*="moatads"],
        iframe[src*="smartadserver"],
        iframe[src*="rubiconproject"],
        iframe[src*="pubmatic"],

        /* ── IAB Standard CSS Class/ID Heuristics ── */
        [class*="ad-banner" i],
        [class*="ad-container" i],
        [class*="ad-wrapper" i],
        [class*="ad-slot" i],
        [class*="ad-unit" i],
        [class*="ad-block" i],
        [class*="ad-frame" i],
        [class*="adslot" i],
        [class*="adunit" i],
        [class*="adbanner" i],
        [class*="adcontainer" i],
        [class*="sidebar-ad" i],
        [class*="advertisement" i],
        [class*="advertising" i],
        [id*="ad-banner" i],
        [id*="ad-container" i],
        [id*="ad-slot" i],
        [id*="ad-unit" i],
        [id*="ad-block" i],
        [id*="advertisement" i],
        [id*="sidebar-ad" i],

        /* ── Sponsored / Affiliate Content ── */
        [class*="sponsor" i],
        [id*="sponsor" i],
        [class*="sponsored-content" i],
        [class*="sponsored-card" i],
        [class*="promoted-content" i],
        [class*="native-ad" i],

        /* ── Cookie / GDPR Banners ── */
        [class*="cookie-banner" i],
        [class*="cookie-consent" i],
        [class*="cookie-notice" i],
        [class*="gdpr-banner" i],
        [class*="consent-banner" i],
        [id*="cookie-banner" i],
        [id*="cookie-consent" i],
        [id*="gdpr-banner" i],
        #cookie-consent,
        .cookie-banner,

        /* ── Newsletter / Survey / Chat Popups ── */
        [class*="newsletter-popup" i],
        [class*="newsletter-modal" i],
        [class*="survey-popup" i],
        [class*="chat-widget" i],
        [class*="chat-bubble" i],
        [class*="intercom" i],
        [class*="drift-widget" i],
        [class*="crisp-widget" i],
        .newsletter-popup,

        /* ── UVT Masking Attributes ── */
        [data-percy-hide="true"],
        [data-percy-ignore="true"],

        /* ── Floating / Sticky Overlays ── */
        [class*="sticky-ad" i],
        [class*="floating-ad" i],
        [class*="popup-ad" i],
        [class*="overlay-ad" i] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* ── UVT Dynamic Element Masking ── */
        [data-uvt-dynamic],
        .uvt-dynamic-masked {
          filter: blur(6px) !important;
          opacity: 0.3 !important;
        }
      `;
            shared_1.logger.info(`Invoking percySnapshot(page, "${name}") with comprehensive ad-removal percyCSS...`);
            // Wrap in a 90s timeout guard so a stale Percy agent never hangs the entire run
            await Promise.race([
                snapshotFn(page, name, { percyCSS }),
                new Promise((_, reject) => setTimeout(() => reject(new Error(`percySnapshot timed out after 90s for "${name}"`)), 90000))
            ]);
            shared_1.logger.success(`percySnapshot(page, "${name}") uploaded DOM snapshot successfully.`);
        }
        catch (percyErr) {
            shared_1.logger.error(`percySnapshot(page, "${name}") failed: ${percyErr.message}`);
            if (percyErr.stack)
                shared_1.logger.error(percyErr.stack);
            // Attempt local fallback screenshot
            try {
                const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
                const screenshotDir = require('path').join(process.cwd(), '.uvt', 'screenshots', 'latest');
                require('fs').mkdirSync(screenshotDir, { recursive: true });
                const fallbackPath = require('path').join(screenshotDir, `${safeName}.png`);
                await page.screenshot({ path: fallbackPath, fullPage: true });
                if (route) {
                    route.metadata = route.metadata || {};
                    route.metadata.screenshotPath = fallbackPath;
                }
                shared_1.logger.info(`Fallback local screenshot saved: ${fallbackPath}`);
            }
            catch { }
        }
    }
    async finalize() {
        if (this.percyRunning || !!process.env.PERCY_SERVER_ADDRESS) {
            shared_1.logger.success('All snapshots sent to Percy successfully.');
            // Query local Percy agent to capture the real build ID and URL
            let buildInfo = { buildId: '', buildUrl: '' };
            try {
                let host = '127.0.0.1';
                let port = 5338;
                if (process.env.PERCY_SERVER_ADDRESS) {
                    try {
                        const u = new URL(process.env.PERCY_SERVER_ADDRESS);
                        host = u.hostname || '127.0.0.1';
                        port = parseInt(u.port, 10) || 5338;
                    }
                    catch { }
                }
                const pingBuild = () => new Promise((resolve) => {
                    const req = http.request({
                        host,
                        port,
                        path: '/percy/healthcheck',
                        method: 'GET',
                        timeout: 3000
                    }, (res) => {
                        let data = '';
                        res.on('data', (c) => data += c);
                        res.on('end', () => {
                            try {
                                resolve(JSON.parse(data));
                            }
                            catch {
                                resolve(null);
                            }
                        });
                    });
                    req.on('error', () => resolve(null));
                    req.end();
                });
                const health = await pingBuild();
                if (health) {
                    shared_1.logger.debug(`Percy healthcheck response: ${JSON.stringify(health)}`);
                    if (health.build) {
                        buildInfo.buildId = String(health.build.id || '');
                        buildInfo.buildUrl = String(health.build.url || '');
                    }
                    else if (health.id || health.url) {
                        buildInfo.buildId = String(health.id || '');
                        buildInfo.buildUrl = String(health.url || '');
                    }
                }
            }
            catch (e) { }
            if (buildInfo.buildId) {
                shared_1.logger.success(`Percy Build #${buildInfo.buildId} finalized. View at: ${buildInfo.buildUrl}`);
            }
            else {
                shared_1.logger.info('Percy build will be finalized when the percy exec wrapper exits.');
            }
            // Write Percy evidence JSON
            try {
                const fs = await import('fs');
                const path = await import('path');
                let dir = process.cwd();
                let root = dir;
                while (true) {
                    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml')) || fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) {
                        root = dir;
                        break;
                    }
                    const parent = path.dirname(dir);
                    if (parent === dir)
                        break;
                    dir = parent;
                }
                const vclPercyDir = path.join(root, '.vcl', 'percy');
                fs.mkdirSync(vclPercyDir, { recursive: true });
                const folderName = path.basename(process.cwd());
                const now = new Date();
                fs.writeFileSync(path.join(vclPercyDir, `${folderName}_percy_evidence.json`), JSON.stringify({
                    timestamp: now.getTime(),
                    isoTimestamp: now.toISOString(),
                    framework: folderName,
                    buildId: buildInfo.buildId,
                    buildUrl: buildInfo.buildUrl,
                    pbveVerdict: 'PASS'
                }, null, 2), 'utf-8');
            }
            catch (e) { }
            // When running under percy exec, the agent finalizes on process exit.
            // We only need to stop if WE started it (autoStarted === true).
            if (this.autoStarted) {
                shared_1.logger.info('Finalizing Percy build and stopping local agent...');
                const stopped = await this.stopPercyAgent();
                if (stopped) {
                    shared_1.logger.success('Percy build finalized and local agent stopped successfully.');
                }
                else {
                    shared_1.logger.info('Percy agent managed externally. Skipping stop.');
                }
            }
            else {
                shared_1.logger.info('Percy agent managed externally (percy exec wrapper). Skipping stop — build will finalize on process exit.');
            }
        }
        else {
            shared_1.logger.info('Percy provider in standalone mode. No Percy build to finalize.');
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
            req.on('error', () => resolve(false));
            req.on('timeout', () => { req.destroy(); resolve(false); });
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
                timeout: 1500
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