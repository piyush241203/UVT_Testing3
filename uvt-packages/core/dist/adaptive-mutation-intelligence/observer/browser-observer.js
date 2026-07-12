"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROWSER_OBSERVER_SCRIPT = void 0;
exports.BROWSER_OBSERVER_SCRIPT = `
  (async (maxDurationMs = 2000, stabilityWindowMs = 300) => {
    return new Promise((resolve) => {
      const events = [];
      const startTime = performance.now();
      let lastMutationTime = startTime;
      let stabilityTimer = null;
      let forceEndTimer = null;

      function generateSelector(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return '';
        if (el.id) return '#' + el.id;
        let path = el.tagName.toLowerCase();
        if (el.className && typeof el.className === 'string') {
          path += '.' + el.className.trim().split(/\s+/).join('.');
        }
        return path;
      }

      function finish() {
        if (stabilityTimer) clearTimeout(stabilityTimer);
        if (forceEndTimer) clearTimeout(forceEndTimer);
        observer.disconnect();
        
        resolve(JSON.stringify({
          startTime,
          endTime: performance.now(),
          totalMutations: events.length,
          events
        }));
      }

      function resetStabilityTimer() {
        if (stabilityTimer) clearTimeout(stabilityTimer);
        stabilityTimer = setTimeout(finish, stabilityWindowMs);
      }

      const observer = new MutationObserver((mutations) => {
        const now = performance.now();
        lastMutationTime = now;

        for (const mut of mutations) {
          let target = mut.target;
          // If text node, get parent element for selector
          if (target.nodeType === Node.TEXT_NODE) {
            target = target.parentElement;
          }

          if (!target || target.nodeType !== Node.ELEMENT_NODE) continue;

          events.push({
            timestamp: now,
            type: mut.type,
            targetSelector: generateSelector(target),
            targetTag: target.tagName ? target.tagName.toLowerCase() : '',
            attributeName: mut.attributeName
          });
        }
        
        resetStabilityTimer();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'src', 'href', 'value', 'aria-live', 'disabled']
      });

      resetStabilityTimer();
      forceEndTimer = setTimeout(finish, maxDurationMs);
    });
  })
`;
//# sourceMappingURL=browser-observer.js.map