"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ccrcsTemplate = void 0;
exports.ccrcsTemplate = `
window.renderCcrcsSuite = function(data) {
  const container = document.getElementById('ccrcs-container');
  if(!container) return;

  const ccrcs = data.ccrcsInfo || {
    repositoriesTested: 250,
    overallPassRate: 98.6,
    falsePositiveRate: 0.18,
    missedRegressionRate: 0.05,
    averageRuntimeMs: 17800,
    history: [
      { build: '#101', passRate: 98.2, falsePositive: 0.20, runtimeMs: 18200 },
      { build: '#102', passRate: 98.4, falsePositive: 0.19, runtimeMs: 18000 },
      { build: '#103', passRate: 98.6, falsePositive: 0.18, runtimeMs: 17800 }
    ]
  };

  let html = \`
    <div style="margin-bottom: 2rem;">
      <h3 style="margin: 0; color: var(--accent);">Continuous Certification & Release System</h3>
      <p style="color: var(--text-muted); font-size: 0.875rem;">Total Repositories: <strong>\${ccrcs.repositoriesTested}</strong> | Overall Pass Rate: <strong style="color: #10b981;">\${ccrcs.overallPassRate}%</strong></p>
      <div style="margin-top: 1rem; display: flex; gap: 2rem; font-size: 0.9rem; color: var(--text-muted);">
        <div>False Positive Rate: <strong style="color: var(--text-main);">\${ccrcs.falsePositiveRate}%</strong></div>
        <div>Missed Regression Rate: <strong style="color: var(--text-main);">\${ccrcs.missedRegressionRate}%</strong></div>
        <div>Average Runtime: <strong style="color: var(--text-main);">\${ccrcs.averageRuntimeMs / 1000}s</strong></div>
      </div>
    </div>
    <h4 style="color: var(--text-main); margin-bottom: 1rem;">Release Certification History Trends</h4>
    <div class="pipeline-grid" style="display: grid; gap: 1rem;">
  \`;

  ccrcs.history.forEach(h => {
    html += \`
      <div class="stage-card" style="padding: 1.25rem; background: var(--bg-card); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h5 style="margin: 0; color: var(--text-main);">Build \${h.build}</h5>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Runtime: \${h.runtimeMs / 1000}s</span>
        </div>
        <div style="text-align: right;">
          <div style="color: #10b981; font-weight: 600;">\${h.passRate}% Pass</div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">False Positives: \${h.falsePositive}%</span>
        </div>
      </div>
    \`;
  });

  html += '</div>';
  container.innerHTML = html;
};
`;
//# sourceMappingURL=ccrcs-tab.js.map