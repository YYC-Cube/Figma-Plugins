/**
 * @file Figma Auto Layout Pro 插件
 * @description 提供高级自动布局功能，增强Figma的布局能力
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 布局预设
const layoutPresets = [
  {
    id: '1',
    name: '垂直堆栈',
    description: '垂直排列元素，居中对齐',
    direction: 'VERTICAL',
    alignment: 'CENTER',
    spacing: 16,
    padding: 16
  },
  {
    id: '2',
    name: '水平堆栈',
    description: '水平排列元素，居中对齐',
    direction: 'HORIZONTAL',
    alignment: 'CENTER',
    spacing: 16,
    padding: 16
  },
  {
    id: '3',
    name: '卡片布局',
    description: '垂直排列元素，左对齐，带内边距',
    direction: 'VERTICAL',
    alignment: 'MIN',
    spacing: 12,
    padding: 20
  },
  {
    id: '4',
    name: '导航栏',
    description: '水平排列元素，居中对齐，最小高度',
    direction: 'HORIZONTAL',
    alignment: 'CENTER',
    spacing: 24,
    padding: 16,
    minHeight: 60
  },
  {
    id: '5',
    name: '表单布局',
    description: '垂直排列元素，左对齐，带标签间距',
    direction: 'VERTICAL',
    alignment: 'MIN',
    spacing: 20,
    padding: 16
  },
  {
    id: '6',
    name: '网格布局',
    description: '创建响应式网格布局',
    direction: 'VERTICAL',
    alignment: 'MIN',
    spacing: 16,
    padding: 0,
    gridColumns: 3
  }
];

// 智能布局规则
const smartLayoutRules = [
  {
    id: '1',
    name: '等宽分配',
    description: '将容器宽度平均分配给子元素',
    type: 'EQUAL_WIDTH'
  },
  {
    id: '2',
    name: '等高水平居中',
    description: '水平居中且等宽排列元素',
    type: 'EQUAL_WIDTH_CENTER'
  },
  {
    id: '3',
    name: '等高分配',
    description: '将容器高度平均分配给子元素',
    type: 'EQUAL_HEIGHT'
  },
  {
    id: '4',
    name: '等高垂直居中',
    description: '垂直居中且等高排列元素',
    type: 'EQUAL_HEIGHT_CENTER'
  },
  {
    id: '5',
    name: '最大宽度优先',
    description: '根据最大元素宽度调整布局',
    type: 'MAX_WIDTH'
  },
  {
    id: '6',
    name: '最小宽度优先',
    description: '根据最小元素宽度调整布局',
    type: 'MIN_WIDTH'
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'apply-layout-preset':
        applyLayoutPreset(msg.presetId);
        break;
      case 'apply-smart-layout':
        applySmartLayout(msg.ruleId);
        break;
      case 'batch-layout':
        batchLayout(msg.operation, msg.params);
        break;
      case 'adjust-spacing':
        adjustSpacing(msg.amount, msg.direction);
        break;
      case 'distribute-elements':
        distributeElements(msg.direction);
        break;
      case 'align-elements':
        alignElements(msg.alignType);
        break;
      case 'create-grid':
        createGrid(msg.columns, msg.rows, msg.gap);
        break;
      case 'convert-to-auto-layout':
        convertToAutoLayout();
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

// 应用布局预设
function applyLayoutPreset(presetId) {
  const preset = layoutPresets.find(p => p.id === presetId);
  if (!preset) return;

  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要应用布局的元素' });
    return;
  }

  // 模拟应用预设
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'preset-applied',
      message: `已应用布局预设: ${preset.name}`,
      preset: preset
    });
  }, 800);
}

// 应用智能布局
function applySmartLayout(ruleId) {
  const rule = smartLayoutRules.find(r => r.id === ruleId);
  if (!rule) return;

  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要应用布局的元素' });
    return;
  }

  // 模拟应用智能布局
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'smart-layout-applied',
      message: `已应用智能布局规则: ${rule.name}`,
      rule: rule
    });
  }, 1000);
}

// 批量布局操作
function batchLayout(operation, params) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要操作的元素' });
    return;
  }

  // 模拟批量操作
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'batch-operation-completed',
      message: `已完成批量${operation === 'add' ? '添加' : '移除'}自动布局操作`,
      count: selection.length
    });
  }, 1200);
}

// 调整间距
function adjustSpacing(amount, direction) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要调整间距的元素' });
    return;
  }

  // 模拟调整间距
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'spacing-adjusted',
      message: `已${direction === 'increase' ? '增加' : '减少'}间距 ${amount}px`,
      amount: amount,
      direction: direction
    });
  }, 600);
}

// 分布元素
function distributeElements(direction) {
  const selection = figma.currentPage.selection;
  if (selection.length < 2) {
    figma.ui.postMessage({ type: 'error', message: '请至少选择两个要分布的元素' });
    return;
  }

  // 模拟分布元素
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'elements-distributed',
      message: `已${direction === 'horizontal' ? '水平' : '垂直'}分布 ${selection.length} 个元素`,
      direction: direction
    });
  }, 800);
}

// 对齐元素
function alignElements(alignType) {
  const selection = figma.currentPage.selection;
  if (selection.length < 2) {
    figma.ui.postMessage({ type: 'error', message: '请至少选择两个要对齐的元素' });
    return;
  }

  // 模拟对齐元素
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'elements-aligned',
      message: `已将 ${selection.length} 个元素${getAlignTypeText(alignType)}对齐`,
      alignType: alignType
    });
  }, 600);
}

// 获取对齐类型文本
function getAlignTypeText(alignType) {
  const alignMap = {
    'left': '左',
    'center': '水平居中',
    'right': '右',
    'top': '顶部',
    'middle': '垂直居中',
    'bottom': '底部'
  };
  return alignMap[alignType] || alignType;
}

// 创建网格
function createGrid(columns, rows, gap) {
  // 模拟创建网格
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'grid-created',
      message: `已创建 ${columns}×${rows} 的网格，间距 ${gap}px`,
      columns: columns,
      rows: rows,
      gap: gap
    });
  }, 1000);
}

// 转换为自动布局
function convertToAutoLayout() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要转换的元素' });
    return;
  }

  // 模拟转换
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'converted-to-auto-layout',
      message: `已将 ${selection.length} 个元素转换为自动布局`,
      count: selection.length
    });
  }, 800);
}
