import ToolPanel from './ToolPanel';

const { React } = window as any;

module.exports = {
  register: function(api: any) {
    const { registerTool, registerSidebarButton } = api;

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
        api.navigate?.('/tools/plugin-color-palette');
      },
    });
  }
};
