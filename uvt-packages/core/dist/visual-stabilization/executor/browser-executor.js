"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROWSER_EXECUTOR_SCRIPT = void 0;
exports.BROWSER_EXECUTOR_SCRIPT = `
  (actions) => {
    window.__UVT_ROLLBACK__ = window.__UVT_ROLLBACK__ || [];
    let applied = 0;
    let failed = 0;
    const errors = [];

    for (const action of actions) {
      try {
        const elements = document.querySelectorAll(action.selector);
        for (const el of elements) {
          const originalState = {
            element: el,
            style: el.getAttribute('style'),
            textContent: el.textContent,
            html: el.innerHTML
          };

          // Apply strategies
          switch (action.strategy) {
            case 'Mask':
              el.style.backgroundColor = action.value || '#e0e0e0';
              el.style.color = 'transparent';
              break;
            case 'Blur':
              el.style.filter = \`blur(\${action.value || '5px'})\`;
              break;
            case 'Hide':
              el.style.visibility = 'hidden';
              break;
            case 'Replace':
              el.textContent = action.value || '██████';
              break;
            case 'Freeze':
              el.style.animation = 'none';
              el.style.transition = 'none';
              if (el.tagName === 'SVG') {
                el.pauseAnimations?.();
              }
              break;
            case 'PauseMedia':
              if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
                originalState.wasPlaying = !el.paused;
                if (!el.paused) el.pause();
              }
              break;
            case 'ReplaceSrc':
              if (el.tagName === 'IMG' || el.tagName === 'IFRAME') {
                originalState.src = el.src;
                if (el.srcset) {
                  originalState.srcset = el.srcset;
                  el.srcset = '';
                }
                el.src = action.value || '';
              }
              break;
            case 'PauseRenderLoop':
            case 'FreezeCanvas':
              if (el.tagName === 'CANVAS') {
                // To freeze canvas, we can grab a static dataURL and overlay it, or modify WebGL context locally
                const canvas = el as HTMLCanvasElement;
                originalState.canvasDataUrl = canvas.toDataURL();
                // We'll restore it in rollback
              }
              break;
            // Additional strategies Mock, Clone, Skip, Ignore implemented as needed
          }

          window.__UVT_ROLLBACK__.push(originalState);
          applied++;
        }
      } catch (err) {
        failed++;
        errors.push(\`Failed to execute \${action.strategy} on \${action.selector}: \${err.message}\`);
      }
    }

    return { success: failed === 0, actionsApplied: applied, actionsFailed: failed, errors };
  }
`;
//# sourceMappingURL=browser-executor.js.map