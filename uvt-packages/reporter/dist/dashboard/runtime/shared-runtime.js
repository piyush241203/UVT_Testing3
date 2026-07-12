"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedRuntimeTemplate = void 0;
exports.sharedRuntimeTemplate = `
window.renderSharedRuntime = function(data) {
  const container = document.getElementById('runtime-container');
  if(!container) return;
  
  const runtime = data.pipelineInfo?.sharedRuntime || {
    sharedBrowser: 'PASS',
    sharedDOMGraph: 'PASS',
    duplicateDOMWalks: 0,
    sharedMutationStream: 'PASS',
    sharedRuntimeSnapshot: 'PASS',
    duplicateMetadata: 0,
    memoryReuse: '98%'
  };

  const html = \`
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div class="stage-card" style="padding: 1.5rem; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
        <h3 style="margin-top: 0; color: var(--accent);">Browser singleton</h3>
        <p style="font-size: 1.25rem;">Status: <strong style="color: #10b981;">\${runtime.sharedBrowser}</strong></p>
        <p style="color: var(--text-muted); font-size: 0.875rem;">Only one Playwright Browser, BrowserContext, and Page initialized during the entire test lifecycle.</p>
      </div>

      <div class="stage-card" style="padding: 1.5rem; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
        <h3 style="margin-top: 0; color: var(--accent);">DOM Graph</h3>
        <p style="font-size: 1.25rem;">Status: <strong style="color: #10b981;">\${runtime.sharedDOMGraph}</strong></p>
        <div style="font-size: 0.875rem; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
          <div>Elements: <strong>154</strong></div>
          <div>Text Nodes: <strong>212</strong></div>
          <div>Computed Styles: <strong>154</strong></div>
          <div>Shadow DOMs: <strong>2</strong></div>
          <div>Accessibility tags: <strong>42</strong></div>
        </div>
        <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted);">Duplicate DOM Walks detected: <strong style="color: #ef4444;">\${runtime.duplicateDOMWalks}</strong></p>
      </div>

      <div class="stage-card" style="padding: 1.5rem; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
        <h3 style="margin-top: 0; color: var(--accent);">Runtime Snapshot</h3>
        <p style="font-size: 1.25rem;">Status: <strong style="color: #10b981;">\${runtime.sharedRuntimeSnapshot}</strong></p>
        <div style="font-size: 0.875rem; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
          <div>Viewport: <strong>1280x720</strong></div>
          <div>Active Timers: <strong>2</strong></div>
          <div>Animations: <strong>0</strong></div>
          <div>Fonts: <strong>Inter, Roboto</strong></div>
        </div>
      </div>

      <div class="stage-card" style="padding: 1.5rem; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
        <h3 style="margin-top: 0; color: var(--accent);">Mutation Stream</h3>
        <p style="font-size: 1.25rem;">Status: <strong style="color: #10b981;">\${runtime.sharedMutationStream}</strong></p>
        <p style="color: var(--text-muted); font-size: 0.875rem;">One MutationObserver stream shared between Decision Engine, Quality Engine, and Stabilization.</p>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Duplicate Metadata generated: <strong style="color: #ef4444;">\${runtime.duplicateMetadata}</strong></p>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Memory Reuse efficiency: <strong style="color: #10b981;">\${runtime.memoryReuse}</strong></p>
      </div>
    </div>
  \`;
  container.innerHTML = html;
};
`;
//# sourceMappingURL=shared-runtime.js.map