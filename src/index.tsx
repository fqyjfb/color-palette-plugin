import ToolPanel from './ToolPanel';

const { React, ReactDOM } = window as any;

function renderStandalone() {
  if (!React || !ReactDOM) {
    console.error('React or ReactDOM is not available');
    return;
  }

  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  ReactDOM.render(React.createElement(ToolPanel), root);
}

function registerPlugin(api: any) {
  const { registerTool, registerSidebarButton, openPluginWindow } = api;

  registerTool({
    id: 'plugin-color-palette',
    name: '调色板',
    iconName: 'Palette',
    color: '#f59e0b',
    textColor: '#ffffff',
    path: '/tools/plugin-color-palette',
    component: ToolPanel,
  });

  registerSidebarButton({
    id: 'plugin-color-palette-btn',
    icon: 'Palette',
    label: '调色板',
    onClick: () => {
      openPluginWindow?.('plugin-color-palette');
    },
  });
}

const pluginData = (window as any).__PLUGIN_DATA__;

if (pluginData) {
  renderStandalone();
}

module.exports = {
  register: registerPlugin,
};