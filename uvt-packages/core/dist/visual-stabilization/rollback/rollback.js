"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollbackManager = exports.BROWSER_ROLLBACK_SCRIPT = void 0;
exports.BROWSER_ROLLBACK_SCRIPT = `
  () => {
    if (!window.__UVT_ROLLBACK__) return { restored: 0 };
    
    let restoredCount = 0;
    // Iterate backwards to restore correctly if there were nested changes
    for (let i = window.__UVT_ROLLBACK__.length - 1; i >= 0; i--) {
      const state = window.__UVT_ROLLBACK__[i];
      if (state.element) {
        if (state.style !== null) {
          state.element.setAttribute('style', state.style);
        } else {
          state.element.removeAttribute('style');
        }
        
        // If we did a Replace strategy, restore HTML
        if (state.html !== state.element.innerHTML) {
          state.element.innerHTML = state.html;
        }
        
        // Restore media src
        if (state.src !== undefined) state.element.src = state.src;
        if (state.srcset !== undefined) state.element.srcset = state.srcset;
        
        // Restore media playback
        if (state.wasPlaying) {
          state.element.play().catch(() => {});
        }
        
        // Restore canvas (this is a simplified rollback for illustration, in reality we'd need more complex webgl redraws)
        if (state.canvasDataUrl && state.element.tagName === 'CANVAS') {
          const img = new Image();
          img.onload = () => {
             const ctx = (state.element as HTMLCanvasElement).getContext('2d');
             if (ctx) ctx.drawImage(img, 0, 0);
          };
          img.src = state.canvasDataUrl;
        }
        
        restoredCount++;
      }
    }

    window.__UVT_ROLLBACK__ = [];
    return { restored: restoredCount };
  }
`;
class RollbackManager {
    static async execute(page) {
        try {
            const result = await page.evaluate(exports.BROWSER_ROLLBACK_SCRIPT);
            return result.restored;
        }
        catch (e) {
            return 0;
        }
    }
}
exports.RollbackManager = RollbackManager;
//# sourceMappingURL=rollback.js.map