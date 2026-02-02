/**
 * @file Figma Plugins Manager 插件
 * @description Figma插件集合和管理工具
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 插件分类
const pluginCategories = [
  {
    id: '1',
    name: '设计工具',
    description: '设计和创作相关的工具',
    type: 'DESIGN'
  },
  {
    id: '2',
    name: '开发工具',
    description: '开发和代码生成相关的工具',
    type: 'DEVELOPMENT'
  },
  {
    id: '3',
    name: '效率工具',
    description: '提高工作效率的工具',
    type: 'PRODUCTIVITY'
  },
  {
    id: '4',
    name: '协作工具',
    description: '团队协作和沟通相关的工具',
    type: 'COLLABORATION'
  },
  {
    id: '5',
    name: '数据分析',
    description: '数据分析和可视化工具',
    type: 'ANALYTICS'
  },
  {
    id: '6',
    name: '自动化',
    description: '自动化和批量处理工具',
    type: 'AUTOMATION'
  }
];

// 插件列表
const pluginList = [
  {
    id: '1',
    name: 'Figma Content Reel',
    description: '内容填充和占位符生成工具',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.8,
    downloads: 15000,
    installed: true,
    featured: true
  },
  {
    id: '2',
    name: 'Figma Design Lint',
    description: '设计规范检查和质量保证工具',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.7,
    downloads: 12000,
    installed: true,
    featured: true
  },
  {
    id: '3',
    name: 'Figma EX',
    description: '扩展工具集，提供额外功能',
    category: 'PRODUCTIVITY',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.6,
    downloads: 10000,
    installed: false,
    featured: false
  },
  {
    id: '4',
    name: 'Figma Figmotion',
    description: '动画创建和编辑工具',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.9,
    downloads: 18000,
    installed: false,
    featured: true
  },
  {
    id: '5',
    name: 'Figma Gleef',
    description: '创意效果和滤镜工具',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.5,
    downloads: 8000,
    installed: false,
    featured: false
  },
  {
    id: '6',
    name: 'Figma Grid Guide',
    description: '网格和辅助线创建工具',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.4,
    downloads: 7000,
    installed: false,
    featured: false
  },
  {
    id: '7',
    name: 'Figma html.to.design',
    description: 'HTML到设计的转换工具',
    category: 'DEVELOPMENT',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.6,
    downloads: 11000,
    installed: false,
    featured: false
  },
  {
    id: '8',
    name: 'Figma Magician',
    description: 'AI辅助设计工具',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.8,
    downloads: 20000,
    installed: false,
    featured: true
  },
  {
    id: '9',
    name: 'Figma Able',
    description: '可访问性检查和改进工具',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.7,
    downloads: 9000,
    installed: false,
    featured: false
  },
  {
    id: '10',
    name: 'Figma Auto Layout Pro',
    description: '高级自动布局工具',
    category: 'PRODUCTIVITY',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.5,
    downloads: 8500,
    installed: false,
    featured: false
  },
  {
    id: '11',
    name: 'Figma Autoflow',
    description: '流程图和连接器创建工具',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.6,
    downloads: 9500,
    installed: false,
    featured: false
  },
  {
    id: '12',
    name: 'Figma CN',
    description: '中文语言支持和本地化工具',
    category: 'PRODUCTIVITY',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.4,
    downloads: 6000,
    installed: false,
    featured: false
  },
  {
    id: '13',
    name: 'Figma Parrot',
    description: '元素复制和重复工具',
    category: 'PRODUCTIVITY',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.5,
    downloads: 7500,
    installed: false,
    featured: false
  },
  {
    id: '14',
    name: 'Figma Image Palette',
    description: '从图片提取颜色和创建调色板',
    category: 'DESIGN',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.7,
    downloads: 13000,
    installed: false,
    featured: false
  },
  {
    id: '15',
    name: 'Figma PureRef',
    description: '纯净引用和重构工具',
    category: 'PRODUCTIVITY',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.6,
    downloads: 8000,
    installed: false,
    featured: false
  },
  {
    id: '16',
    name: 'Figma Redlines',
    description: '红线标注和设计审查工具',
    category: 'COLLABORATION',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.8,
    downloads: 14000,
    installed: false,
    featured: true
  },
  {
    id: '17',
    name: 'Figma to HTML',
    description: '将Figma设计转换为HTML代码',
    category: 'DEVELOPMENT',
    version: '1.0.0',
    author: 'YYC³ Team',
    rating: 4.9,
    downloads: 22000,
    installed: false,
    featured: true
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'search-plugins':
        searchPlugins(msg.query);
        break;
      case 'filter-by-category':
        filterByCategory(msg.category);
        break;
      case 'install-plugin':
        installPlugin(msg.pluginId);
        break;
      case 'uninstall-plugin':
        uninstallPlugin(msg.pluginId);
        break;
      case 'check-updates':
        checkUpdates();
        break;
      case 'get-plugin-info':
        getPluginInfo(msg.pluginId);
        break;
      case 'get-recommendations':
        getRecommendations();
        break;
      case 'get-statistics':
        getStatistics();
        break;
      case 'exit':
        figma.closePlugin();
        break;
      default:
        console.error('未知消息类型:', msg.type);
    }
  } catch (error) {
    console.error('处理消息时出错:', error);
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
};

// 搜索插件
function searchPlugins(query) {
  const filteredPlugins = pluginList.filter(plugin => 
    plugin.name.toLowerCase().includes(query.toLowerCase()) ||
    plugin.description.toLowerCase().includes(query.toLowerCase())
  );

  figma.ui.postMessage({
    type: 'plugins-searched',
    message: `找到 ${filteredPlugins.length} 个匹配的插件`,
    plugins: filteredPlugins
  });
}

// 按分类过滤
function filterByCategory(category) {
  const filteredPlugins = category === 'ALL' 
    ? pluginList 
    : pluginList.filter(plugin => plugin.category === category);

  figma.ui.postMessage({
    type: 'plugins-filtered',
    message: `显示 ${filteredPlugins.length} 个插件`,
    plugins: filteredPlugins
  });
}

// 安装插件
function installPlugin(pluginId) {
  const plugin = pluginList.find(p => p.id === pluginId);
  if (!plugin) return;

  // 模拟安装
  setTimeout(() => {
    plugin.installed = true;
    figma.ui.postMessage({
      type: 'plugin-installed',
      message: `已安装 ${plugin.name}`,
      plugin: plugin
    });
  }, 1500);
}

// 卸载插件
function uninstallPlugin(pluginId) {
  const plugin = pluginList.find(p => p.id === pluginId);
  if (!plugin) return;

  // 模拟卸载
  setTimeout(() => {
    plugin.installed = false;
    figma.ui.postMessage({
      type: 'plugin-uninstalled',
      message: `已卸载 ${plugin.name}`,
      plugin: plugin
    });
  }, 1000);
}

// 检查更新
function checkUpdates() {
  // 模拟检查更新
  setTimeout(() => {
    const updates = pluginList.filter(plugin => plugin.installed && Math.random() > 0.7);
    
    figma.ui.postMessage({
      type: 'updates-checked',
      message: `发现 ${updates.length} 个插件有更新`,
      updates: updates
    });
  }, 2000);
}

// 获取插件信息
function getPluginInfo(pluginId) {
  const plugin = pluginList.find(p => p.id === pluginId);
  if (!plugin) return;

  figma.ui.postMessage({
    type: 'plugin-info',
    message: `获取 ${plugin.name} 的详细信息`,
    plugin: plugin
  });
}

// 获取推荐
function getRecommendations() {
  // 模拟获取推荐
  setTimeout(() => {
    const recommendations = pluginList
      .filter(plugin => !plugin.installed)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    figma.ui.postMessage({
      type: 'recommendations-retrieved',
      message: `为您推荐 ${recommendations.length} 个插件`,
      recommendations: recommendations
    });
  }, 1000);
}

// 获取统计信息
function getStatistics() {
  const installedPlugins = pluginList.filter(p => p.installed);
  const totalDownloads = pluginList.reduce((sum, p) => sum + p.downloads, 0);
  const avgRating = pluginList.reduce((sum, p) => sum + p.rating, 0) / pluginList.length;

  const statistics = {
    totalPlugins: pluginList.length,
    installedPlugins: installedPlugins.length,
    featuredPlugins: pluginList.filter(p => p.featured).length,
    totalDownloads: totalDownloads,
    averageRating: avgRating.toFixed(1),
    topCategories: [
      { name: '设计工具', count: pluginList.filter(p => p.category === 'DESIGN').length },
      { name: '开发工具', count: pluginList.filter(p => p.category === 'DEVELOPMENT').length },
      { name: '效率工具', count: pluginList.filter(p => p.category === 'PRODUCTIVITY').length }
    ]
  };

  figma.ui.postMessage({
    type: 'statistics-retrieved',
    message: '统计信息获取完成',
    statistics: statistics
  });
}
