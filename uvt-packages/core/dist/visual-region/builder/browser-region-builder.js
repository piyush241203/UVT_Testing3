"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROWSER_REGION_BUILDER_SCRIPT = void 0;
exports.BROWSER_REGION_BUILDER_SCRIPT = `
  (() => {
    const nodes = {};
    let idCounter = 0;

    function generateId(prefix) {
      return prefix + '-' + (++idCounter);
    }

    function createNode(el, type, name) {
      const id = generateId(type.toLowerCase());
      
      let selector = el.tagName.toLowerCase();
      if (el.id) selector += '#' + el.id;
      else if (el.className && typeof el.className === 'string') selector += '.' + el.className.split(' ').join('.');

      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const isPortal = el.hasAttribute('data-react-portal') || el.id.includes('portal');
      const isOverlay = el.tagName === 'DIALOG' || style.position === 'fixed' || (style.position === 'absolute' && parseInt(style.zIndex || '0') > 0);

      const node = {
        id,
        type,
        name,
        selector,
        childrenIds: [],
        attributes: {},
        isPersistent: ['header', 'footer', 'nav', 'aside'].includes(el.tagName.toLowerCase()),
        isOverlay,
        isPortal,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      };

      nodes[id] = node;
      return id;
    }

    const rootId = createNode(document.body, 'Root', 'Application');

    // Extract semantics
    const semantics = ['header', 'main', 'footer', 'nav', 'aside', 'section', 'article', 'dialog'];
    semantics.forEach(tag => {
      document.querySelectorAll(tag).forEach(el => {
        const id = createNode(el, 'Region', tag);
        nodes[rootId].childrenIds.push(id);
        nodes[id].parentId = rootId;
      });
    });

    // Detect Framework specific boundaries (Next/React)
    const nextRoot = document.getElementById('__next');
    if (nextRoot) {
      const id = createNode(nextRoot, 'Layout', 'Next.js App');
      nodes[rootId].childrenIds.push(id);
      nodes[id].parentId = rootId;
    }

    return { rootId, nodes };
  })
`;
//# sourceMappingURL=browser-region-builder.js.map