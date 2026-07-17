import React from 'react';
import ReactDOM from 'react-dom/client';
import ToolPanel from './ToolPanel';

const PluginApp: React.FC = () => {
  return React.createElement(ToolPanel);
};

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

  if (ReactDOM.createRoot) {
    ReactDOM.createRoot(root).render(React.createElement(PluginApp));
  } else {
    ReactDOM.render(React.createElement(PluginApp), root);
  }
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