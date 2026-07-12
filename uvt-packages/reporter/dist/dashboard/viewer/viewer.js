"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stylesTemplate = exports.viewerTemplate = void 0;
exports.viewerTemplate = `
function renderTabs() {
  const tabs = ['Overview', 'Timeline', 'Quality', 'Pipeline', 'Shared-Runtime', 'Temporal-Suite', 'Identity-Suite', 'Rendering-Suite', 'Realtime-Suite', 'Framework-Suite', 'Components-Suite', 'Browser-Suite', 'Certify-Suite', 'CCRCS-Suite', 'Decisions', 'VOVS-Suite', 'Plugins'];
  const tabContainer = document.getElementById('tabs');
  if(!tabContainer) return;
  tabContainer.innerHTML = tabs.map(t => 
    \`<button class="tab-btn" onclick="switchTab('\${t}')">\${t}</button>\`
  ).join('');
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  const target = document.getElementById('tab-' + tabName.toLowerCase());
  if(target) target.style.display = 'block';
  
  if(tabName === 'Timeline' && window.renderTimeline) window.renderTimeline(window.__UVT_DATA__);
  if(tabName === 'Quality' && window.renderQuality) window.renderQuality(window.__UVT_DATA__);
  if(tabName === 'Pipeline' && window.renderPipeline) window.renderPipeline(window.__UVT_DATA__);
  if(tabName === 'Shared-Runtime' && window.renderSharedRuntime) window.renderSharedRuntime(window.__UVT_DATA__);
  if(tabName === 'Temporal-Suite' && window.renderTemporalSuite) window.renderTemporalSuite(window.__UVT_DATA__);
  if(tabName === 'Identity-Suite' && window.renderIdentitySuite) window.renderIdentitySuite(window.__UVT_DATA__);
  if(tabName === 'Rendering-Suite' && window.renderRenderingSuite) window.renderRenderingSuite(window.__UVT_DATA__);
  if(tabName === 'Realtime-Suite' && window.renderRealtimeSuite) window.renderRealtimeSuite(window.__UVT_DATA__);
  if(tabName === 'Framework-Suite' && window.renderFrameworkSuite) window.renderFrameworkSuite(window.__UVT_DATA__);
  if(tabName === 'Components-Suite' && window.renderComponentsSuite) window.renderComponentsSuite(window.__UVT_DATA__);
  if(tabName === 'Browser-Suite' && window.renderBrowserSuite) window.renderBrowserSuite(window.__UVT_DATA__);
  if(tabName === 'Certify-Suite' && window.renderCertifySuite) window.renderCertifySuite(window.__UVT_DATA__);
  if(tabName === 'CCRCS-Suite' && window.renderCcrcsSuite) window.renderCcrcsSuite(window.__UVT_DATA__);
  if(tabName === 'Decisions' && window.renderDecisions) window.renderDecisions(window.__UVT_DATA__);
  if(tabName === 'VOVS-Suite' && window.renderVovsSuite) window.renderVovsSuite(window.__UVT_DATA__);
}

function initDashboard() {
  const data = window.__UVT_DATA__;
  document.getElementById('repo-name').innerText = data.repository || 'Unknown Repo';
  document.getElementById('framework-name').innerText = data.framework || 'Unknown Framework';
  document.getElementById('execution-time').innerText = data.executionTimeMs + 'ms';
  renderTabs();
  switchTab('Overview');
}

window.addEventListener('DOMContentLoaded', initDashboard);
`;
exports.stylesTemplate = `
:root {
  --bg-dark: #0f172a;
  --bg-card: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent: #38bdf8;
  --border: #334155;
}
body {
  margin: 0; padding: 0;
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.header {
  padding: 1.5rem 2rem;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border);
}
.header h1 { margin: 0; font-size: 1.5rem; color: var(--accent); }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.stat-card {
  background: var(--bg-dark);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.stat-card h3 { margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; }
.stat-card p { margin: 0; font-size: 1.25rem; font-weight: 600; }
#tabs {
  display: flex; gap: 1rem; padding: 1rem 2rem; border-bottom: 1px solid var(--border);
}
.tab-btn {
  background: transparent; border: none; color: var(--text-muted); cursor: pointer;
  font-size: 1rem; padding: 0.5rem 1rem; border-radius: 4px;
}
.tab-btn:hover { background: var(--border); color: var(--text-main); }
.tab-content { padding: 2rem; display: none; }
`;
//# sourceMappingURL=viewer.js.map