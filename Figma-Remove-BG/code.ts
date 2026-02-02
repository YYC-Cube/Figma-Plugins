/**
 * @file Figma Remove BG 插件
 * @description 从图片中移除背景
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 背景移除方法
const removalMethods = [
  {
    id: '1',
    name: 'AI智能移除',
    description: '使用AI算法智能识别并移除背景',
    type: 'AI',
    accuracy: 'high'
  },
  {
    id: '2',
    name: '颜色阈值移除',
    description: '基于颜色阈值移除背景',
    type: 'COLOR_THRESHOLD',
    accuracy: 'medium'
  },
  {
    id: '3',
    name: '边缘检测移除',
    description: '使用边缘检测算法移除背景',
    type: 'EDGE_DETECTION',
    accuracy: 'medium'
  },
  {
    id: '4',
    name: '手动选择移除',
    description: '手动选择要移除的背景区域',
    type: 'MANUAL',
    accuracy: 'high'
  }
];

// 背景颜色选项
const bgColorOptions = [
  {
    id: '1',
    name: '透明',
    description: '移除背景后使用透明背景',
    type: 'TRANSPARENT'
  },
  {
    id: '2',
    name: '白色',
    description: '移除背景后使用白色背景',
    type: 'WHITE',
    color: '#FFFFFF'
  },
  {
    id: '3',
    name: '黑色',
    description: '移除背景后使用黑色背景',
    type: 'BLACK',
    color: '#000000'
  },
  {
    id: '4',
    name: '自定义颜色',
    description: '移除背景后使用自定义颜色',
    type: 'CUSTOM'
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'remove-background':
        removeBackground(msg.method, msg.bgColor, msg.customColor);
        break;
      case 'preview-result':
        previewResult();
        break;
      case 'undo-removal':
        undoRemoval();
        break;
      case 'export-image':
        exportImage(msg.format);
        break;
      case 'batch-remove':
        batchRemove(msg.method, msg.bgColor, msg.customColor);
        break;
      case 'load-image':
        loadImage(msg.imageData);
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

// 移除背景
function removeBackground(method: string, bgColor: string, customColor: string) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要处理的图片' });
    return;
  }

  const images = selection.filter(node => node.type === 'IMAGE' || (node.type === 'RECTANGLE' && node.fills.length > 0));
  if (images.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请选择图片或包含图片的元素' });
    return;
  }

  const removalMethod = removalMethods.find(m => m.type === method);
  if (!removalMethod) return;

  // 模拟背景移除
  setTimeout(() => {
    const processedCount = images.length;
    const accuracy = removalMethod.accuracy;
    
    figma.ui.postMessage({
      type: 'background-removed',
      message: `已使用 ${removalMethod.name} 移除 ${processedCount} 张图片的背景`,
      method: method,
      bgColor: bgColor,
      processedCount: processedCount,
      accuracy: accuracy
    });
  }, 2000);
}

// 预览结果
function previewResult() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要预览的图片' });
    return;
  }

  // 模拟预览
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'preview-generated',
      message: '已生成背景移除预览'
    });
  }, 1000);
}

// 撤销移除
function undoRemoval() {
  // 模拟撤销
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'undo-completed',
      message: '已撤销背景移除操作'
    });
  }, 600);
}

// 导出图片
function exportImage(format: string) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要导出的图片' });
    return;
  }

  // 模拟导出
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'image-exported',
      message: `已导出图片为 ${format} 格式`,
      format: format
    });
  }, 800);
}

// 批量移除
function batchRemove(method: string, bgColor: string, customColor: string) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要处理的图片' });
    return;
  }

  const images = selection.filter(node => node.type === 'IMAGE' || (node.type === 'RECTANGLE' && node.fills.length > 0));
  if (images.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请选择图片或包含图片的元素' });
    return;
  }

  // 模拟批量移除
  setTimeout(() => {
    const processedCount = images.length;
    
    figma.ui.postMessage({
      type: 'batch-removed',
      message: `已批量移除 ${processedCount} 张图片的背景`,
      processedCount: processedCount
    });
  }, 3000);
}

// 加载图片
function loadImage(imageData: string) {
  // 模拟加载图片
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'image-loaded',
      message: '已加载图片'
    });
  }, 800);
}
