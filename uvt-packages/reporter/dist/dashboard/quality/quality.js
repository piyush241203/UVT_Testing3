"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityTemplate = void 0;
exports.qualityTemplate = `
window.renderQuality = function(data) {
  const container = document.getElementById('quality-container');
  if(!container || !data.qualityReport) {
    if(container) container.innerHTML = '<p>No Quality Report available.</p>';
    return;
  }
  
  const report = data.qualityReport;
  container.innerHTML = \`
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 8px; border-top: 4px solid \${report.score > 80 ? '#4ade80' : '#f87171'};">
        <h2 style="margin-top: 0; font-size: 1.25rem;">Quality Score</h2>
        <div style="font-size: 4rem; font-weight: 800; color: \${report.score > 80 ? '#4ade80' : '#f87171'}">\${report.score}</div>
        <p style="margin-bottom: 0;">False Positive Risk: <strong style="color: \${report.falsePositiveRisk === 'High' ? '#f87171' : '#facc15'}">\${report.falsePositiveRisk}</strong></p>
      </div>
      <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 8px;">
        <h2 style="margin-top: 0; font-size: 1.25rem;">Recommendations & Warnings</h2>
        <ul style="color: var(--text-muted); padding-left: 1.5rem; line-height: 1.6;">
          \${(report.warnings || []).map(r => \`<li style="color: #f87171;">\${r}</li>\`).join('')}
          \${(report.recommendations || []).map(r => \`<li>\${r}</li>\`).join('')}
          \${(!report.warnings?.length && !report.recommendations?.length) ? '<li>All systems nominal. No warnings detected.</li>' : ''}
        </ul>
      </div>
    </div>
  \`;
};
`;
//# sourceMappingURL=quality.js.map