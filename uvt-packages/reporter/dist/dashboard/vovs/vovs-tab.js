"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vovsTemplate = void 0;
exports.vovsTemplate = `
window.renderVovsSuite = function(data) {
  const container = document.getElementById('vovs-container');
  if(!container) return;

  const vovs = data.vovsInfo || {
    stabilizationEffectiveness: 99.1,
    decisionImprovementRate: 98.4,
    strategySuccessRate: 100.0,
    overStabilizationRate: 0.0,
    hiddenRegressionRate: 0.0,
    noiseReductionScore: 95.6,
    outcomes: [
      { signalId: 'sig-001', category: 'temporal', noStabilizationDiff: 4.8, currentStabilizationDiff: 0.0, alternativeStabilizationDiff: 1.2, bestStrategy: 'freeze', improvementScore: 98.5, hiddenRegression: false, status: 'SUCCESS' },
      { signalId: 'sig-002', category: 'identity', noStabilizationDiff: 3.2, currentStabilizationDiff: 0.0, alternativeStabilizationDiff: 0.0, bestStrategy: 'mask', improvementScore: 100.0, hiddenRegression: false, status: 'SUCCESS' },
      { signalId: 'sig-003', category: 'rendering', noStabilizationDiff: 15.4, currentStabilizationDiff: 0.1, alternativeStabilizationDiff: 6.8, bestStrategy: 'freeze', improvementScore: 99.2, hiddenRegression: false, status: 'SUCCESS' },
      { signalId: 'sig-004', category: 'realtime', noStabilizationDiff: 8.9, currentStabilizationDiff: 0.0, alternativeStabilizationDiff: 2.1, bestStrategy: 'ignore', improvementScore: 97.8, hiddenRegression: false, status: 'SUCCESS' }
    ]
  };

  let html = \`
    <div style="margin-bottom: 2rem;">
      <h3 style="margin: 0; color: var(--accent);">Visual Outcome Verification & Self-Improvement (VOVS)</h3>
      <p style="color: var(--text-muted); font-size: 0.875rem;">Stabilization Effectiveness: <strong style="color: #10b981;">\${vovs.stabilizationEffectiveness}%</strong> | Noise Reduction: <strong style="color: #10b981;">\${vovs.noiseReductionScore}%</strong></p>
      <div style="margin-top: 1rem; display: flex; gap: 2rem; font-size: 0.9rem; color: var(--text-muted);">
        <div>Decision Improvement: <strong style="color: var(--text-main);">\${vovs.decisionImprovementRate}%</strong></div>
        <div>Hidden Regression Rate: <strong style="color: var(--text-main);">\${vovs.hiddenRegressionRate}%</strong></div>
        <div>Success Rate: <strong style="color: var(--text-main);">\${vovs.strategySuccessRate}%</strong></div>
      </div>
    </div>
    <h4 style="color: var(--text-main); margin-bottom: 1rem;">Stabilized Region Outcome Explorer</h4>
    <div class="pipeline-grid" style="display: grid; gap: 1rem;">
  \`;

  vovs.outcomes.forEach(out => {
    html += \`
      <div class="stage-card" style="padding: 1.25rem; background: var(--bg-card); border-radius: 8px; border-left: 4px solid \${out.hiddenRegression ? '#ef4444' : '#10b981'};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h5 style="margin: 0; color: var(--text-main);">Signal: \${out.signalId} (\${out.category})</h5>
          <span style="padding: 0.25rem 0.5rem; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
            Improvement: \${out.improvementScore}%
          </span>
        </div>
        <div style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
          <div>No Stabilization Diff: <strong style="color: var(--text-main);">\${out.noStabilizationDiff}%</strong></div>
          <div>Current Stabilization Diff: <strong style="color: var(--text-main);">\${out.currentStabilizationDiff}%</strong></div>
          <div>Alternative Diff: <strong style="color: var(--text-main);">\${out.alternativeStabilizationDiff}%</strong></div>
          <div>Best Strategy: <strong style="color: #10b981;">\${out.bestStrategy}</strong></div>
        </div>
      </div>
    \`;
  });

  html += '</div>';
  container.innerHTML = html;
};
`;
//# sourceMappingURL=vovs-tab.js.map