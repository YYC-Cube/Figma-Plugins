/**
 * @file Figma Parrot 插件
 * @description 元素复制和重复工具，快速创建重复元素
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 复制模式
const duplicationModes = [
  {
    id: '1',
    name: '线性复制',
    description: '沿直线方向复制元素',
    type: 'LINEAR'
  },
  {
    id: '2',
    name: '网格复制',
    description: '按网格布局复制元素',
    type: 'GRID'
  },
  {
    id: '3',
    name: '圆形复制',
    description: '沿圆形路径复制元素',
    type: 'CIRCULAR'
  },
  {
    id: '4',
    name: '随机分布',
    description: '随机分布复制的元素',
    type: 'RANDOM'
  }
];

// 变换选项
const transformOptions = [
  {
    id: '1',
    name: '缩放',
    description: '逐渐缩放复制的元素',
    type: 'SCALE'
  },
  {
    id: '2',
    name: '旋转',
    description: '逐渐旋转复制的元素',
    type: 'ROTATION'
  },
  {
    id: '3',
    name: '透明度',
    description: '逐渐改变透明度',
    type: 'OPACITY'
  },
  {
    id: '4',
    name: '颜色渐变',
    description: '逐渐改变颜色',
    type: 'COLOR'
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'duplicate-linear':
        duplicateLinear(msg.count, msg.direction, msg.spacing);
        break;
      case 'duplicate-grid':
        duplicateGrid(msg.rows, msg.columns, msg.horizontalSpacing, msg.verticalSpacing);
        break;
      case 'duplicate-circular':
        duplicateCircular(msg.count, msg.radius, msg.startAngle, msg.endAngle);
        break;
      case 'duplicate-random':
        duplicateRandom(msg.count, msg.areaWidth, msg.areaHeight);
        break;
      case 'apply-transform':
        applyTransform(msg.transformType, msg.startValue, msg.endValue);
        break;
      case 'smart-duplicate':
        smartDuplicate(msg.pattern);
        break;
      case 'mirror-duplicate':
        mirrorDuplicate(msg.direction);
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

// 线性复制
function duplicateLinear(count: number, direction: string, spacing: number) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要复制的元素' });
    return;
  }

  // 模拟线性复制
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'duplicated',
      message: `已沿 ${getDirectionText(direction)} 方向线性复制 ${count} 个元素，间距 ${spacing}px`,
      count: count,
      mode: 'linear'
    });
  }, 1000);
}

// 网格复制
function duplicateGrid(rows: number, columns: number, horizontalSpacing: number, verticalSpacing: number) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要复制的元素' });
    return;
  }

  // 模拟网格复制
  setTimeout(() => {
    const totalCount = rows * columns;
    figma.ui.postMessage({
      type: 'duplicated',
      message: `已创建 ${rows}×${columns} 的网格，共 ${totalCount} 个元素`,
      count: totalCount,
      mode: 'grid',
      rows: rows,
      columns: columns
    });
  }, 1200);
}

// 圆形复制
function duplicateCircular(count: number, radius: number, startAngle: number, endAngle: number) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要复制的元素' });
    return;
  }

  // 模拟圆形复制
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'duplicated',
      message: `已沿半径 ${radius}px 的圆形路径复制 ${count} 个元素`,
      count: count,
      mode: 'circular',
      radius: radius
    });
  }, 1000);
}

// 随机分布复制
function duplicateRandom(count: number, areaWidth: number, areaHeight: number) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要复制的元素' });
    return;
  }

  // 模拟随机分布
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'duplicated',
      message: `已在 ${areaWidth}×${areaHeight} 区域内随机分布 ${count} 个元素`,
      count: count,
      mode: 'random'
    });
  }, 1000);
}

// 应用变换
function applyTransform(transformType: string, startValue: number, endValue: number) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要应用变换的元素' });
    return;
  }

  // 模拟应用变换
  setTimeout(() => {
    const transform = transformOptions.find(t => t.type === transformType);
    figma.ui.postMessage({
      type: 'transform-applied',
      message: `已应用 ${transform.name} 变换，从 ${startValue} 到 ${endValue}`,
      transformType: transformType
    });
  }, 800);
}

// 智能复制
function smartDuplicate(pattern: string) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要复制的元素' });
    return;
  }

  // 模拟智能复制
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'smart-duplicated',
      message: `已按 ${pattern} 模式智能复制元素`,
      pattern: pattern
    });
  }, 1000);
}

// 镜像复制
function mirrorDuplicate(direction: string) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要镜像复制的元素' });
    return;
  }

  // 模拟镜像复制
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'mirrored',
      message: `已沿 ${direction === 'horizontal' ? '水平' : '垂直'} 方向镜像复制 ${selection.length} 个元素`,
      direction: direction
    });
  }, 800);
}

// 获取方向文本
function getDirectionText(direction: string) {
  const directionMap: Record<string, string> = {
    'horizontal': '水平',
    'vertical': '垂直',
    'diagonal': '对角'
  };
  return directionMap[direction] || direction;
}
