/**
 * @file Figma Magician 插件
 * @description AI驱动的设计助手，提供智能设计建议和自动化功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 模拟AI建议数据
const aiSuggestions = [
  {
    id: '1',
    type: 'layout',
    title: '优化布局结构',
    description: '建议使用更平衡的布局，增加留白并调整元素间距',
    priority: 'high'
  },
  {
    id: '2',
    type: 'color',
    title: '色彩方案优化',
    description: '当前色彩对比度不足，建议调整为更易读的组合',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'typography',
    title: '字体层次优化',
    description: '建议建立更清晰的字体层次结构，区分标题和正文',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'consistency',
    title: '设计一致性',
    description: '检测到多处设计不一致，建议统一按钮样式和间距',
    priority: 'low'
  }
];

// 模拟设计系统组件
const designSystemComponents = [
  { name: 'Button', category: 'UI Elements', variants: ['Primary', 'Secondary', 'Ghost'] },
  { name: 'Card', category: 'Layout', variants: ['Basic', 'Elevated', 'Outlined'] },
  { name: 'Form Input', category: 'Form Elements', variants: ['Text', 'Email', 'Password'] },
  { name: 'Navigation', category: 'Layout', variants: ['Top Bar', 'Sidebar', 'Footer'] }
];

// 模拟颜色方案
const colorSchemes = [
  { name: 'Default', colors: ['#1a1a1a', '#333333', '#666666', '#999999', '#cccccc', '#f5f5f5'] },
  { name: 'Blue', colors: ['#003366', '#0066cc', '#3399ff', '#66b3ff', '#99ccff', '#cce5ff'] },
  { name: 'Green', colors: ['#006633', '#00994d', '#33cc77', '#66dd99', '#99eecc', '#ccffe6'] },
  { name: 'Purple', colors: ['#330066', '#6600cc', '#9933ff', '#bb66ff', '#dd99ff', '#f2ccff'] }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'analyze-design':
        analyzeDesign();
        break;
      case 'apply-suggestion':
        applySuggestion(msg.suggestionId);
        break;
      case 'generate-components':
        generateComponents(msg.category);
        break;
      case 'apply-color-scheme':
        applyColorScheme(msg.schemeName);
        break;
      case 'auto-layout':
        autoLayoutSelection();
        break;
      case 'generate-alt-text':
        generateAltText();
        break;
      case 'check-accessibility':
        checkAccessibility();
        break;
      case 'get-design-tokens':
        getDesignTokens();
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

// 分析设计并提供AI建议
function analyzeDesign() {
  // 模拟分析过程
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'design-analysis',
      suggestions: aiSuggestions,
      componentCount: figma.currentPage.children.length,
      textNodeCount: figma.currentPage.findAll(node => node.type === 'TEXT').length,
      colorCount: new Set(figma.currentPage.findAll(node => node.type === 'RECTANGLE').map(node => node.fills[0]?.color)).size
    });
  }, 1000);
}

// 应用设计建议
function applySuggestion(suggestionId) {
  const suggestion = aiSuggestions.find(s => s.id === suggestionId);
  if (!suggestion) return;

  // 模拟应用建议
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'suggestion-applied',
      message: `已应用建议: ${suggestion.title}`
    });
  }, 800);
}

// 生成设计组件
function generateComponents(category) {
  const components = designSystemComponents.filter(c => c.category === category);
  
  // 模拟生成组件
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'components-generated',
      components: components,
      message: `已为 ${category} 类别生成 ${components.length} 个组件`
    });
  }, 1200);
}

// 应用颜色方案
function applyColorScheme(schemeName) {
  const scheme = colorSchemes.find(s => s.name === schemeName);
  if (!scheme) return;

  // 模拟应用颜色方案
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'color-scheme-applied',
      message: `已应用 ${schemeName} 颜色方案`
    });
  }, 900);
}

// 自动布局选择的元素
function autoLayoutSelection() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'error',
      message: '请先选择要应用自动布局的元素'
    });
    return;
  }

  // 模拟应用自动布局
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'auto-layout-applied',
      message: `已为 ${selection.length} 个元素应用自动布局`
    });
  }, 700);
}

// 为图片生成替代文本
function generateAltText() {
  const images = figma.currentPage.findAll(node => node.type === 'RECTANGLE' && node.fills[0]?.type === 'IMAGE');
  
  // 模拟生成替代文本
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'alt-text-generated',
      count: images.length,
      message: `已为 ${images.length} 个图片生成替代文本`
    });
  }, 1000);
}

// 检查可访问性
function checkAccessibility() {
  // 模拟可访问性检查
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'accessibility-check',
      issues: [
        { type: 'color-contrast', severity: 'medium', description: '文本与背景对比度不足' },
        { type: 'missing-alt', severity: 'low', description: '部分图片缺少替代文本' },
        { type: 'keyboard-nav', severity: 'high', description: '某些元素无法通过键盘访问' }
      ],
      compliance: 78 // 百分比
    });
  }, 1500);
}

// 获取设计令牌
function getDesignTokens() {
  // 模拟设计令牌
  const tokens = {
    colors: {
      primary: '#0066cc',
      secondary: '#3399ff',
      success: '#00994d',
      warning: '#ff9900',
      error: '#cc3300',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#1a1a1a'
    },
    typography: {
      heading1: { fontSize: 24, fontWeight: 700, lineHeight: 1.2 },
      heading2: { fontSize: 20, fontWeight: 600, lineHeight: 1.3 },
      heading3: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
      body: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
      caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.6 }
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    borderRadius: {
      sm: 2,
      md: 4,
      lg: 8,
      xl: 12,
      full: 9999
    }
  };

  setTimeout(() => {
    figma.ui.postMessage({
      type: 'design-tokens',
      tokens: tokens
    });
  }, 800);
}
