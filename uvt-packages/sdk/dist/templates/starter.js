"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStarterPlugin = generateStarterPlugin;
function generateStarterPlugin(name) {
    return `import { UvtPlugin, PluginContext } from '@uvt/sdk';

export default class ${name.replace(/[^a-zA-Z0-9]/g, '')}Plugin implements UvtPlugin {
  manifest = {
    name: '${name}',
    version: '1.0.0',
    author: 'Your Name',
    description: 'A custom UVT plugin.',
    uvtVersion: '^1.0.0',
    capabilities: ['repository-analysis']
  };

  async initialize(context: PluginContext): Promise<void> {
    context.logger.info('${name} initialized!');
  }

  async beforeSnapshot(): Promise<void> {
    // Custom pre-snapshot logic
  }
}
`;
}
//# sourceMappingURL=starter.js.map