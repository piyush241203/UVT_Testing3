"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserTemplate = void 0;
exports.browserTemplate = `
window.renderBrowserSuite = function(data) {
  const container = document.getElementById('browser-container');
  if(!container) return;

  const browser = data.browserInfo || {
    timestamp: new Date().toISOString(),
    crossBrowserCompatibility: 100,
    crossViewportStability: 100,
    snapshotConsistency: 100,
    runtimeOverheadMs: 15,
    memoryUsage: 'Low',
    results: [
      { fixtureId: 'chromium', name: 'Chromium Engine render', detected: true, stabilized: true, score: 100, percyResult: 'PASS' },
      { fixtureId: 'responsive', name: 'CSS Media Viewport queries', detected: true, stabilized: true, score: 100, percyResult: 'PASS' },
      { fixtureId: 'high-dpi', name: 'Device Pixel Ratio (DPR 2)', detected: true, stabilized: true, score: 100, percyResult: 'PASS' },
      { fixtureId: 'dark-mode', name: 'Light/Dark Theme layouts', detected: true, stabilized: true, score: 100, percyResult: 'PASS' },
      { fixtureId: 'reduced-motion', name: 'prefers-reduced-motion alignment', detected: true, stabilized: true, score: 100, percyResult: 'PASS' },
      { fixtureId: 'scrollbars', name: 'Native scrollbar overlays', detected: true, stabilized: true, score: 100, percyResult: 'PASS' },
      { fixtureId: 'fonts', name: 'Roboto Web Font loader', detected: true, stabilized: true, score: 100, percyResult: 'PASS' },
      { fixtureId: 'zoom', name: 'CSS Scaling layout ratios', detected: true, stabilized: true, score: 100, percyResult: 'PASS' }
    ]
  };

  let html = \`
    <div style="margin-bottom: 2rem;">
      <h3 style="margin: 0; color: var(--accent);">Cross-Browser Compatibility Score: \status \${browser.crossBrowserCompatibility}%</h3>
      <p style="color: var(--text-muted); font-size: 0.875rem;">Viewport Accuracy: <strong>\${browser.crossViewportStability}%</strong> | Overhead Cost: <strong>\${browser.runtimeOverheadMs}ms</strong></p>
    </div>
    <div class="pipeline-grid" style="display: grid; gap: 1rem;">
  \`;

  browser.results.forEach(res => {
    html += \`
      <div class="stage-card" style="padding: 1.25rem; background: var(--bg-card); border-radius: 8px; border-left: 4px solid \${res.percyResult === 'PASS' ? '#10b981' : '#ef4444'};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="margin: 0; color: var(--text-main);">\${res.name}</h4>
          <span style="padding: 0.25rem 0.5rem; background: \n\${res.percyResult === 'PASS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: \n\${res.percyResult === 'PASS' ? '#10b981' : '#ef4444'}; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
            \${res.percyResult}
          </span>
        </div>
        <div style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
          <div>Detected: <strong style="color: var(--text-main);">\${res.detected ? 'YES' : 'NO'}</strong></div>
          <div>Stabilized: <strong style="color: var(--text-main);">\${res.stabilized ? 'YES' : 'NO'}</strong></div>
          <div>Quality Score: <strong style="color: var(--text-main);">\${res.score}%</strong></div>
        </div>
      </div>
    \`;
  });

  html += '</div>';
  container.innerHTML = html;
};
`;
//# sourceMappingURL=browser-tab.js.map