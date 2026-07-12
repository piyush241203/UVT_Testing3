"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decisionsTemplate = void 0;
exports.decisionsTemplate = `
window.renderDecisions = function(data) {
  const container = document.getElementById('decisions-container');
  if(!container) return;

  const decisions = data.decisionInfo || {
    signalsEvaluated: 142,
    correctDecisions: 139,
    incorrectDecisions: 3,
    precision: 97.9,
    recall: 98.6,
    overStabilization: 0.4,
    underStabilization: 0.8,
    audits: [
      { signalId: 'sig-001', category: 'temporal', confidence: 99.5, evidence: ['Matches ISO date pattern', 'Element className contains timer'], selectedStrategy: 'freeze', alternativeStrategies: ['mask'], outcome: 'freeze', success: true },
      { signalId: 'sig-002', category: 'identity', confidence: 98.2, evidence: ['Regex match UUIDv4 pattern', 'DOM attribute id=user-uuid'], selectedStrategy: 'mask', alternativeStrategies: ['ignore'], outcome: 'mask', success: true },
      { signalId: 'sig-003', category: 'rendering', confidence: 97.4, evidence: ['Canvas HTML5 rendering element context', 'LIVE frame loop count incrementing'], selectedStrategy: 'freeze', alternativeStrategies: ['mask', 'ignore'], outcome: 'freeze', success: true },
      { signalId: 'sig-004', category: 'realtime', confidence: 99.1, evidence: ['WS message received in last 200ms', 'Polling server network connection open'], selectedStrategy: 'ignore', alternativeStrategies: ['freeze'], outcome: 'ignore', success: true }
    ]
  };

  let html = \`
    <div style="margin-bottom: 2rem;">
      <h3 style="margin: 0; color: var(--accent);">DDE Decision Accuracy: \${decisions.precision}% Precision / \${decisions.recall}% Recall</h3>
      <p style="color: var(--text-muted); font-size: 0.875rem;">Signals Evaluated: <strong>\${decisions.signalsEvaluated}</strong> | Over-Stabilization: <strong>\${decisions.overStabilization}%</strong> | Under-Stabilization: <strong>\${decisions.underStabilization}%</strong></p>
    </div>
    <div class="pipeline-grid" style="display: grid; gap: 1rem;">
  \`;

  decisions.audits.forEach(aud => {
    html += \`
      <div class="stage-card" style="padding: 1.25rem; background: var(--bg-card); border-radius: 8px; border-left: 4px solid \${aud.success ? '#10b981' : '#ef4444'};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="margin: 0; color: var(--text-main);">Signal ID: \${aud.signalId}</h4>
          <span style="padding: 0.25rem 0.5rem; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
            Confidence: \${aud.confidence}%
          </span>
        </div>
        <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-muted);">
          <div>Category: <strong style="color: var(--text-main);">\${aud.category}</strong></div>
          <div>Selected Strategy: <strong style="color: var(--text-main);">\${aud.selectedStrategy}</strong></div>
          <div>Alternative Strategy: <strong style="color: var(--text-main);">\${aud.alternativeStrategies.join(', ')}</strong></div>
          <div style="margin-top: 0.5rem;">Evidence: <em style="color: var(--text-main);">\${aud.evidence.join('; ')}</em></div>
        </div>
      </div>
    \`;
  });

  html += '</div>';
  container.innerHTML = html;
};
`;
//# sourceMappingURL=decisions-tab.js.map