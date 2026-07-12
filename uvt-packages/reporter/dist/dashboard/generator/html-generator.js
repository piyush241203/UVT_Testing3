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
exports.DashboardGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const viewer_js_1 = require("../viewer/viewer.js");
const timeline_js_1 = require("../timeline/timeline.js");
const quality_js_1 = require("../quality/quality.js");
const pipeline_tab_js_1 = require("../pipeline/pipeline-tab.js");
const shared_runtime_js_1 = require("../runtime/shared-runtime.js");
const temporal_tab_js_1 = require("../temporal/temporal-tab.js");
const identity_tab_js_1 = require("../identity/identity-tab.js");
const rendering_tab_js_1 = require("../rendering/rendering-tab.js");
const realtime_tab_js_1 = require("../realtime/realtime-tab.js");
const framework_tab_js_1 = require("../framework/framework-tab.js");
const components_tab_js_1 = require("../components/components-tab.js");
const browser_tab_js_1 = require("../browser/browser-tab.js");
const certify_tab_js_1 = require("../certify/certify-tab.js");
const ccrcs_tab_js_1 = require("../ccrcs/ccrcs-tab.js");
const decisions_tab_js_1 = require("../decisions/decisions-tab.js");
const vovs_tab_js_1 = require("../vovs/vovs-tab.js");
class DashboardGenerator {
    async generate(payload, outDir) {
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UVT Visual Report & Debug Dashboard</title>
  <style>
    ${viewer_js_1.stylesTemplate}
  </style>
</head>
<body>
  <div class="header">
    <h1>Universal Visual Testing - Debug Dashboard</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Repository</h3>
        <p id="repo-name">-</p>
      </div>
      <div class="stat-card">
        <h3>Framework</h3>
        <p id="framework-name">-</p>
      </div>
      <div class="stat-card">
        <h3>Execution Time</h3>
        <p id="execution-time">-</p>
      </div>
    </div>
  </div>
  
  <div id="tabs"></div>

  <div id="tab-overview" class="tab-content" style="display: block;">
    <h2>Overview</h2>
    <p>Welcome to the Visual Report & Debug Dashboard. Select a tab above to explore execution telemetry, regions, decisions, and quality metrics.</p>
  </div>
  
  <div id="tab-timeline" class="tab-content">
    <h2>Execution Timeline</h2>
    <div id="timeline-container"></div>
  </div>
  
  <div id="tab-quality" class="tab-content">
    <h2>Visual Quality Report</h2>
    <div id="quality-container"></div>
  </div>
  
  <div id="tab-pipeline" class="tab-content">
    <h2>Pipeline Integrity</h2>
    <div id="pipeline-container"></div>
  </div>

  <div id="tab-shared-runtime" class="tab-content">
    <h2>Shared Runtime & Single Browser</h2>
    <div id="runtime-container"></div>
  </div>

  <div id="tab-temporal-suite" class="tab-content">
    <h2>Temporal Stabilization Compatibility Suite</h2>
    <div id="temporal-container"></div>
  </div>

  <div id="tab-identity-suite" class="tab-content">
    <h2>Identity Stabilization Compatibility Suite</h2>
    <div id="identity-container"></div>
  </div>

  <div id="tab-rendering-suite" class="tab-content">
    <h2>Rendering & Media Stabilization Compatibility Suite</h2>
    <div id="rendering-container"></div>
  </div>

  <div id="tab-realtime-suite" class="tab-content">
    <h2>Realtime & Async Data Compatibility Suite</h2>
    <div id="realtime-container"></div>
  </div>

  <div id="tab-framework-suite" class="tab-content">
    <h2>Framework Runtime Compatibility Suite</h2>
    <div id="framework-container"></div>
  </div>

  <div id="tab-components-suite" class="tab-content">
    <h2>Advanced Component & UI Library Compatibility Suite</h2>
    <div id="components-container"></div>
  </div>

  <div id="tab-browser-suite" class="tab-content">
    <h2>Browser, Viewport & Responsive Compatibility Suite</h2>
    <div id="browser-container"></div>
  </div>

  <div id="tab-certify-suite" class="tab-content">
    <h2>Real Repository Certification Suite</h2>
    <div id="certify-container"></div>
  </div>

  <div id="tab-ccrcs-suite" class="tab-content">
    <h2>Continuous Certification & Release System (CCRCS)</h2>
    <div id="ccrcs-container"></div>
  </div>

  <div id="tab-decisions" class="tab-content">
    <h2>Decisions Explorer</h2>
    <div id="decisions-container"></div>
  </div>

  <div id="tab-vovs-suite" class="tab-content">
    <h2>Visual Outcome Verification & Self-Improvement (VOVS)</h2>
    <div id="vovs-container"></div>
  </div>

  <div id="tab-plugins" class="tab-content">
    <h2>Plugin Explorer</h2>
    <p>Plugin execution statistics (Work in Progress)...</p>
  </div>

  <script>
    window.__UVT_DATA__ = ${JSON.stringify(payload)};
    ${viewer_js_1.viewerTemplate}
    ${timeline_js_1.timelineTemplate}
    ${quality_js_1.qualityTemplate}
    ${pipeline_tab_js_1.pipelineTemplate}
    ${shared_runtime_js_1.sharedRuntimeTemplate}
    ${temporal_tab_js_1.temporalTemplate}
    ${identity_tab_js_1.identityTemplate}
    ${rendering_tab_js_1.renderingTemplate}
    ${realtime_tab_js_1.realtimeTemplate}
    ${framework_tab_js_1.frameworkTemplate}
    ${components_tab_js_1.componentsTemplate}
    ${browser_tab_js_1.browserTemplate}
    ${certify_tab_js_1.certifyTemplate}
    ${ccrcs_tab_js_1.ccrcsTemplate}
    ${decisions_tab_js_1.decisionsTemplate}
    ${vovs_tab_js_1.vovsTemplate}
  </script>
</body>
</html>`;
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        const outFile = path.join(outDir, 'index.html');
        fs.writeFileSync(outFile, html, 'utf-8');
        return outFile;
    }
}
exports.DashboardGenerator = DashboardGenerator;
//# sourceMappingURL=html-generator.js.map