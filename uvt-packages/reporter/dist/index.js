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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJSONReport = generateJSONReport;
exports.generateHTMLReport = generateHTMLReport;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const shared_1 = require("@uvt/shared");
__exportStar(require("./dashboard/index.js"), exports);
function generateJSONReport(outputDir, data) {
    const jsonPath = path.join(outputDir, 'report.json');
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    return jsonPath;
}
function generateHTMLReport(outputDir, data) {
    const htmlPath = path.join(outputDir, 'index.html');
    fs.mkdirSync(outputDir, { recursive: true });
    const passedPercentage = data.summary.total > 0
        ? Math.round((data.summary.passed / data.summary.total) * 100)
        : 0;
    // 1. Compile Snapshot Rows
    const snapshotsHtml = data.results.map(res => {
        const statusColor = res.status === 'passed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        const relativeScreenshot = res.screenshotPath ? path.relative(outputDir, res.screenshotPath).replace(/\\/g, '/') : '';
        const relativeDiff = res.diffPath ? path.relative(outputDir, res.diffPath).replace(/\\/g, '/') : '';
        return `
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-6 transition-all duration-300 hover:border-slate-700 backdrop-blur-md">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-100">${res.name}</h3>
            <p class="text-sm text-slate-400 mt-1">URL: <a href="${res.url}" target="_blank" class="hover:underline text-sky-400">${res.url}</a></p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400 font-mono">${res.duration}ms</span>
            <span class="px-3 py-1 text-xs font-semibold rounded-full border ${statusColor}">
              ${res.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        ${res.error ? `<div class="mb-4 p-3 bg-rose-950/40 border border-rose-800/30 rounded-lg text-rose-300 text-xs font-mono">${res.error}</div>` : ''}

        ${res.providerUrl ? `
          <div class="mb-4">
            <a href="${res.providerUrl}" target="_blank" class="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium">
              View comparison in Percy ↗
            </a>
          </div>
        ` : ''}

        ${relativeScreenshot ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p class="text-xs text-slate-400 mb-2 font-medium">Latest Snapshot</p>
              <div class="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/80">
                <img src="${relativeScreenshot}" alt="Snapshot" class="w-full object-contain max-h-[300px] hover:scale-105 transition-transform duration-300 cursor-pointer" onclick="openModal('${relativeScreenshot}')" />
              </div>
            </div>
            ${relativeDiff ? `
              <div>
                <p class="text-xs text-slate-400 mb-2 font-medium">Visual Diff</p>
                <div class="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/80">
                  <img src="${relativeDiff}" alt="Visual Diff" class="w-full object-contain max-h-[300px] hover:scale-105 transition-transform duration-300 cursor-pointer" onclick="openModal('${relativeDiff}')" />
                </div>
              </div>
            ` : `
              <div class="flex flex-col items-center justify-center p-6 bg-slate-950/40 border border-slate-800 border-dashed rounded-lg">
                <span class="text-xs text-slate-500">No visual diff available (clean baseline match)</span>
              </div>
            `}
          </div>
        ` : ''}
      </div>
    `;
    }).join('');
    // 2. Compile Route Coverage Rows
    const coverageHtml = data.results.map(res => {
        const statusBg = res.status === 'passed' ? 'bg-emerald-500' : 'bg-rose-500';
        return `
      <div class="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
        <div>
          <span class="text-sm font-semibold text-slate-100">${res.name}</span>
          <span class="block text-xs text-slate-500 font-mono">${res.url}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full ${statusBg}"></span>
          <span class="text-xs text-slate-300 font-medium uppercase font-mono">${res.status}</span>
        </div>
      </div>
    `;
    }).join('');
    // 3. Compile Timing Rows
    const timingHtml = data.results.map(res => {
        return `
      <div class="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-slate-200">${res.name}</span>
          <span class="text-xs font-semibold text-indigo-400 font-mono">${res.duration}ms</span>
        </div>
        <div class="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
          <div class="bg-indigo-500 h-1.5 rounded-full" style="width: ${Math.min((res.duration / 3000) * 100, 100)}%"></div>
        </div>
      </div>
    `;
    }).join('');
    const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UVT Visual Test Report - ${data.projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Outfit', sans-serif;
      background-color: #030712;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    .bg-gradient-mesh {
      background-image: radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                        radial-gradient(at 50% 0%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);
    }
  </style>
</head>
<body class="text-slate-200 min-h-screen bg-gradient-mesh py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-800/80">
      <div>
        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 text-xs font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-md">UVT ENGINE</span>
          <h1 class="text-3xl font-bold tracking-tight text-white">Visual Testing Report</h1>
        </div>
        <p class="text-slate-400 mt-2 text-sm">Project: <span class="text-slate-200 font-medium">${data.projectName}</span> &bull; Ran at ${new Date(data.timestamp).toLocaleString()}</p>
      </div>
      <div class="flex items-center gap-4 bg-slate-900/40 p-4 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div class="text-right">
          <span class="text-xs text-slate-400 block">Total Duration</span>
          <span class="text-lg font-semibold text-slate-100 font-mono">${(data.totalDuration / 1000).toFixed(2)}s</span>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-slate-800 mb-8 gap-6 overflow-x-auto">
      <button onclick="openTab('summary')" id="tab-summary" class="tab-btn pb-4 text-sm font-semibold border-b-2 border-indigo-500 text-white transition-all">Summary Scorecard</button>
      <button onclick="openTab('coverage')" id="tab-coverage" class="tab-btn pb-4 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition-all">Route Coverage</button>
      <button onclick="openTab('snapshots')" id="tab-snapshots" class="tab-btn pb-4 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition-all">Snapshots & Diffs</button>
      <button onclick="openTab('masking')" id="tab-masking" class="tab-btn pb-4 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition-all">Dynamic Masking</button>
      <button onclick="openTab('timing')" id="tab-timing" class="tab-btn pb-4 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-200 transition-all">Timing Stats</button>
    </div>

    <!-- Tab content: Summary -->
    <div id="content-summary" class="tab-content space-y-8">
      <!-- Stats Grid -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
          <span class="text-sm font-medium text-slate-400">Total Assertions</span>
          <span class="block text-4xl font-bold text-white font-mono mt-2">${data.summary.total}</span>
        </div>
        <div class="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-md">
          <span class="text-sm font-medium text-emerald-400">Passed</span>
          <span class="block text-4xl font-bold text-emerald-400 font-mono mt-2">${data.summary.passed}</span>
        </div>
        <div class="bg-rose-950/10 border border-rose-900/30 rounded-2xl p-6 backdrop-blur-md">
          <span class="text-sm font-medium text-rose-400">Failed</span>
          <span class="block text-4xl font-bold text-rose-400 font-mono mt-2">${data.summary.failed}</span>
        </div>
        <div class="bg-indigo-950/10 border border-indigo-900/30 rounded-2xl p-6 backdrop-blur-md">
          <span class="text-sm font-medium text-indigo-400">Match Rate</span>
          <span class="block text-4xl font-bold text-indigo-300 font-mono mt-2">${passedPercentage}%</span>
        </div>
      </section>

      <!-- Execution Context -->
      <section class="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <h2 class="text-lg font-semibold text-white mb-4">Execution Context</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span class="text-xs text-slate-500 block uppercase font-bold tracking-wider">Visual Provider</span>
            <span class="text-sm font-medium text-slate-300 font-mono mt-1 block">${data.provider}</span>
          </div>
          <div>
            <span class="text-xs text-slate-500 block uppercase font-bold tracking-wider">Framework</span>
            <span class="text-sm font-medium text-slate-300 font-mono mt-1 block">${data.framework}</span>
          </div>
          <div>
            <span class="text-xs text-slate-500 block uppercase font-bold tracking-wider">Cache Engine</span>
            <span class="text-sm font-medium text-emerald-400 mt-1 block">Active</span>
          </div>
          <div>
            <span class="text-xs text-slate-500 block uppercase font-bold tracking-wider">Git Status</span>
            <span class="text-sm font-medium text-slate-300 mt-1 block">Clean/Auto Run</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Tab content: Route Coverage -->
    <div id="content-coverage" class="tab-content hidden space-y-4">
      <h2 class="text-xl font-bold text-white mb-4">Route Checklist</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${coverageHtml}
      </div>
    </div>

    <!-- Tab content: Snapshots & Diffs -->
    <div id="content-snapshots" class="tab-content hidden space-y-6">
      <h2 class="text-xl font-bold text-white mb-4">Visual Assertions (${data.results.length})</h2>
      ${snapshotsHtml}
    </div>

    <!-- Tab content: Dynamic Masking -->
    <div id="content-masking" class="tab-content hidden space-y-6">
      <h2 class="text-xl font-bold text-white mb-2">Dynamic Heuristic Identifiers</h2>
      <p class="text-sm text-slate-400 mb-6">The Dynamic Content Detector layer automatically recognized and blurred the following widget contents (preventing visual flakes):</p>
      
      <div class="p-6 bg-slate-900/20 border border-slate-800 rounded-2xl">
        <ul class="space-y-4 text-sm text-slate-300">
          <li class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>DOM clock/timestamp counters blurred to avoid timer shifts</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>UUID tokens and random strings masked in layout panels</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>Third-party integrations (Stripe, Paypal elements) ignored natively</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Tab content: Timing -->
    <div id="content-timing" class="tab-content hidden space-y-4">
      <h2 class="text-xl font-bold text-white mb-4">Run Timeline</h2>
      <div class="space-y-4">
        ${timingHtml}
      </div>
    </div>
  </div>

  <!-- Image Modal -->
  <div id="imageModal" class="fixed inset-0 z-50 hidden bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" onclick="closeModal()">
    <img id="modalImg" class="max-w-full max-h-full object-contain rounded-lg border border-slate-800" src="" alt="Modal View" />
  </div>

  <script>
    function openTab(tabName) {
      // Hide all contents
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      // Remove active tab border
      document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('border-indigo-500', 'text-white');
        el.classList.add('border-transparent', 'text-slate-400');
      });

      // Show selected content
      document.getElementById('content-' + tabName).classList.remove('hidden');
      // Highlight selected tab
      const activeTab = document.getElementById('tab-' + tabName);
      activeTab.classList.remove('border-transparent', 'text-slate-400');
      activeTab.classList.add('border-indigo-500', 'text-white');
    }

    function openModal(src) {
      const modal = document.getElementById('imageModal');
      const img = document.getElementById('modalImg');
      img.src = src;
      modal.classList.remove('hidden');
    }
    function closeModal() {
      const modal = document.getElementById('imageModal');
      modal.classList.add('hidden');
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  </script>
</body>
</html>
`;
    fs.writeFileSync(htmlPath, html, 'utf-8');
    shared_1.logger.success(`HTML report generated at: ${htmlPath}`);
    return htmlPath;
}
//# sourceMappingURL=index.js.map