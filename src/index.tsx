import ToolPanel from './ToolPanel';

const { React, ReactDOM } = window as any;

const PluginHeader: React.FC<{ title: string }> = ({ title }) => {
  const handleMinimize = () => {
    (window as any).electron?.plugin?.minimizeWindow();
  };

  const handleMaximize = () => {
    (window as any).electron?.plugin?.maximizeWindow();
  };

  const handleClose = () => {
    (window as any).electron?.plugin?.closeWindow();
  };

  return React.createElement('div', { className: 'plugin-header' },
    React.createElement('div', { className: 'plugin-header-title' }, title),
    React.createElement('div', { className: 'plugin-header-controls' },
      React.createElement('button', { onClick: handleMinimize },
        React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
          React.createElement('path', { d: 'M5 12h14' })
        )
      ),
      React.createElement('button', { onClick: handleMaximize },
        React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
          React.createElement('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2' })
        )
      ),
      React.createElement('button', { onClick: handleClose },
        React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
          React.createElement('path', { d: 'M18 6L6 18M6 6l12 12' })
        )
      )
    )
  );
};

const PluginApp: React.FC = () => {
  const pluginData = (window as any).__PLUGIN_DATA__;
  const title = pluginData?.pluginName || 'ToolBox 插件';

  return React.createElement(React.Fragment, null,
    React.createElement(PluginHeader, { title }),
    React.createElement('div', { className: 'plugin-content' },
      React.createElement(ToolPanel)
    )
  );
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

module.exports = {
  register: registerPlugin,
};