"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timelineTemplate = void 0;
exports.timelineTemplate = `
window.renderTimeline = function(data) {
  const container = document.getElementById('timeline-container');
  if(!container || !data.traceData || !data.traceData.spans) {
    if(container) container.innerHTML = '<p>No Trace data available.</p>';
    return;
  }
  
  const spans = data.traceData.spans;
  let html = '<div class="timeline">';
  spans.forEach(span => {
    html += \`<div class="timeline-span" style="margin-bottom: 1rem; padding: 1rem; background: var(--bg-card); border-radius: 8px; border-left: 4px solid var(--accent);">
      <h4 style="margin: 0; color: var(--text-main);">\${span.name}</h4>
      <p style="margin: 0.5rem 0 0 0; color: var(--text-muted); font-size: 0.875rem;">Duration: <strong>\${span.duration}ms</strong></p>
    </div>\`;
  });
  html += '</div>';
  container.innerHTML = html;
};
`;
//# sourceMappingURL=timeline.js.map