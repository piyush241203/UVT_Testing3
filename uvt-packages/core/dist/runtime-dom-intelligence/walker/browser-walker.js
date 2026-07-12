"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROWSER_WALKER_SCRIPT = void 0;
exports.BROWSER_WALKER_SCRIPT = `
  (() => {
    const nodes = [];
    let shadowRootCount = 0;
    let mediaCount = 0;

    function walk(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

      const tagName = element.tagName.toLowerCase();
      const rect = element.getBoundingClientRect();
      
      // Skip invisible elements to save overhead
      if (rect.width === 0 && rect.height === 0) return;

      const computed = window.getComputedStyle(element);
      
      const sig = {
        id: element.id || '',
        tagName,
        className: element.className && typeof element.className === 'string' ? element.className : '',
        role: element.getAttribute('role'),
        rect: { width: rect.width, height: rect.height, top: rect.top, left: rect.left },
        attributes: {},
        dataset: {},
        isShadowRoot: false,
        computedStyle: {
          position: computed.position,
          display: computed.display,
          overflow: computed.overflow,
          visibility: computed.visibility,
          opacity: computed.opacity,
          backgroundImage: computed.backgroundImage !== 'none' ? computed.backgroundImage : null
        }
      };

      // Collect specific attributes for classification
      ['aria-live', 'aria-modal', 'type', 'src', 'href', 'data-testid'].forEach(attr => {
        if (element.hasAttribute(attr)) {
          sig.attributes[attr] = element.getAttribute(attr);
        }
      });

      // Dataset
      for (const key in element.dataset) {
        sig.dataset[key] = element.dataset[key];
      }

      nodes.push(sig);

      if (['img', 'video', 'audio', 'svg', 'canvas'].includes(tagName)) {
        mediaCount++;
      }

      // Traverse children
      let child = element.firstElementChild;
      while (child) {
        walk(child);
        child = child.nextElementSibling;
      }

      // Shadow DOM traversal
      if (element.shadowRoot) {
        shadowRootCount++;
        sig.isShadowRoot = true;
        let shadowChild = element.shadowRoot.firstElementChild;
        while (shadowChild) {
          walk(shadowChild);
          shadowChild = shadowChild.nextElementSibling;
        }
      }
    }

    walk(document.body);

    return JSON.stringify({
      url: window.location.href,
      nodeCount: nodes.length,
      shadowRootCount,
      mediaCount,
      nodes
    });
  })();
`;
//# sourceMappingURL=browser-walker.js.map