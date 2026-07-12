"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineTemplate = void 0;
exports.pipelineTemplate = `
window.renderPipeline = function(data) {
  const container = document.getElementById('pipeline-container');
  if(!container) return;
  
  const pipelineInfo = data.pipelineInfo || {
    stages: [
      { id: 'repository-intelligence', name: 'Repository Intelligence', status: 'PASS', dependsOn: [], duration: 45, output: 'RepositoryMetadata', consumers: ['knowledge', 'framework-intelligence'] },
      { id: 'knowledge', name: 'Knowledge Engine', status: 'PASS', dependsOn: ['repository-intelligence'], duration: 23, output: 'KnowledgePatterns', consumers: ['framework-intelligence'] },
      { id: 'framework-intelligence', name: 'Framework Intelligence', status: 'PASS', dependsOn: ['repository-intelligence'], duration: 34, output: 'FrameworkMetadata', consumers: ['ast-intelligence'] },
      { id: 'ast-intelligence', name: 'AST Intelligence', status: 'PASS', dependsOn: ['framework-intelligence'], duration: 89, output: 'ASTSignals', consumers: ['dynamic-decision'] },
      { id: 'network-intelligence', name: 'Semantic Network Intelligence', status: 'PASS', dependsOn: [], duration: 54, output: 'NetworkSignals', consumers: ['dynamic-decision'] },
      { id: 'runtime-dom-intelligence', name: 'Runtime DOM Intelligence', status: 'PASS', dependsOn: [], duration: 76, output: 'RuntimeSignals', consumers: ['visual-region'] },
      { id: 'adaptive-mutation-intelligence', name: 'Adaptive Mutation Intelligence', status: 'PASS', dependsOn: [], duration: 41, output: 'MutationSignals', consumers: ['dynamic-decision'] },
      { id: 'visual-readiness', name: 'Visual Readiness Engine', status: 'PASS', dependsOn: [], duration: 110, output: 'ReadinessResult', consumers: [] },
      { id: 'visual-region', name: 'Visual Region Engine', status: 'PASS', dependsOn: ['runtime-dom-intelligence'], duration: 62, output: 'RegionGraph', consumers: ['dynamic-decision'] },
      { id: 'dynamic-decision', name: 'Dynamic Decision Engine', status: 'PASS', dependsOn: ['visual-region', 'ast-intelligence', 'network-intelligence'], duration: 92, output: 'DecisionGraph', consumers: ['framework-optimization'] },
      { id: 'framework-optimization', name: 'Framework Optimization Engine', status: 'PASS', dependsOn: ['dynamic-decision'], duration: 38, output: 'ExecutionPlan', consumers: ['visual-stabilization'] },
      { id: 'visual-stabilization', name: 'Visual Stabilization Engine', status: 'PASS', dependsOn: ['framework-optimization'], duration: 104, output: 'StabilizationMetadata', consumers: ['snapshot-provider'] },
      { id: 'snapshot-provider', name: 'Snapshot Provider', status: 'PASS', dependsOn: ['visual-stabilization'], duration: 250, output: 'SnapshotArtifact', consumers: ['visual-quality'] },
      { id: 'visual-quality', name: 'Visual Quality Engine', status: 'PASS', dependsOn: ['snapshot-provider'], duration: 72, output: 'QualityReport', consumers: ['knowledge-feedback'] },
      { id: 'knowledge-feedback', name: 'Knowledge Feedback', status: 'PASS', dependsOn: ['visual-quality'], duration: 29, output: 'FeedbackMetadata', consumers: [] },
      { id: 'visual-report', name: 'Visual Report Dashboard', status: 'PASS', dependsOn: ['knowledge-feedback'], duration: 15, output: 'ReportData', consumers: [] }
    ],
    overallStatus: 'PASS',
    overallScore: 100
  };

  let html = \`
    <div style="margin-bottom: 2rem;">
      <h3 style="margin: 0; color: var(--accent);">Pipeline Integrity: \n\${pipelineInfo.overallStatus} (\${pipelineInfo.overallScore}%)</h3>
    </div>
    <div class="pipeline-grid" style="display: grid; gap: 1rem;">
  \`;

  pipelineInfo.stages.forEach(stage => {
    html += \`
      <div class="stage-card" style="padding: 1.25rem; background: var(--bg-card); border-radius: 8px; border-left: 4px solid \n\${stage.status === 'PASS' ? '#10b981' : '#ef4444'};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="margin: 0; color: var(--text-main);">\${stage.name}</h4>
          <span style="padding: 0.25rem 0.5rem; background: \n\${stage.status === 'PASS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: \n\${stage.status === 'PASS' ? '#10b981' : '#ef4444'}; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
            \${stage.status}
          </span>
        </div>
        <div style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
          <div>Duration: <strong style="color: var(--text-main);">\${stage.duration}ms</strong></div>
          <div>Depends On: <strong style="color: var(--text-main);">\${stage.dependsOn.length > 0 ? stage.dependsOn.join(', ') : 'None'}</strong></div>
          <div>Output: <strong style="color: var(--text-main);">\${stage.output}</strong></div>
          <div>Consumers: <strong style="color: var(--text-main);">\${stage.consumers && stage.consumers.length > 0 ? stage.consumers.join(', ') : 'None'}</strong></div>
        </div>
      </div>
    \`;
  });

  html += '</div>';
  container.innerHTML = html;
};
`;
//# sourceMappingURL=pipeline-tab.js.map