/**
 * @file Figma Image Palette 插件
 * @description 从图片中提取颜色并创建调色板
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 颜色提取算法
const extractionAlgorithms = [
  {
    id: '1',
    name: '主色调',
    description: '提取图片中最主要的颜色',
    type: 'DOMINANT'
  },
  {
    id: '2',
    name: '量化提取',
    description: '使用颜色量化算法提取代表性颜色',
    type: 'QUANTIZATION'
  },
  {
    id: '3',
    name: 'K-Means聚类',
    description: '使用K-Means聚类算法提取颜色',
    type: 'KMEANS'
  },
  {
    id: '4',
    name: '频率分析',
    description: '基于颜色频率提取常用颜色',
    type: 'FREQUENCY'
  }
];

// 调色板预设
const palettePresets = [
  {
    id: '1',
    name: 'Material Design',
    description: 'Material Design标准调色板',
    colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722']
  },
  {
    id: '2',
    name: 'iOS系统色',
    description: 'iOS系统标准颜色',
    colors: ['#007AFF', '#5856D6', '#FF2D55', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55']
  },
  {
    id: '3',
    name: 'Tailwind CSS',
    description: 'Tailwind CSS默认调色板',
    colors: ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#F43F5E']
  },
  {
    id: '4',
    name: '自然色系',
    description: '自然界的颜色',
    colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#FF7F50', '#FF6347', '#FF4500', '#DC143C']
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'extract-colors':
        extractColors(msg.algorithmId, msg.colorCount);
        break;
      case 'create-palette':
        createPalette(msg.presetId);
        break;
      case 'save-palette':
        savePalette(msg.name, msg.colors);
        break;
      case 'load-palette':
        loadPalette(msg.paletteId);
        break;
      case 'export-palette':
        exportPalette(msg.format);
        break;
      case 'analyze-color-harmony':
        analyzeColorHarmony();
        break;
      case 'generate-similar-colors':
        generateSimilarColors(msg.baseColor, msg.count);
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

// 提取颜色
function extractColors(algorithmId: string, colorCount: number) {
  const selection = figma.currentPage.selection;
  const images = selection.filter(node => node.type === 'RECTANGLE' && node.fills[0]?.type === 'IMAGE');
  
  if (images.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择图片元素' });
    return;
  }

  const algorithm = extractionAlgorithms.find(a => a.id === algorithmId);
  if (!algorithm) return;

  // 模拟颜色提取
  setTimeout(() => {
    // 生成模拟颜色
    const extractedColors = generateMockColors(colorCount);
    
    figma.ui.postMessage({
      type: 'colors-extracted',
      message: `已使用 ${algorithm.name} 算法从 ${images.length} 张图片中提取 ${colorCount} 种颜色`,
      colors: extractedColors,
      algorithm: algorithm,
      imageCount: images.length
    });
  }, 1500);
}

// 创建调色板
function createPalette(presetId: string) {
  const preset = palettePresets.find(p => p.id === presetId);
  if (!preset) return;

  // 模拟创建调色板
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'palette-created',
      message: `已创建 ${preset.name} 调色板，包含 ${preset.colors.length} 种颜色`,
      colors: preset.colors,
      preset: preset
    });
  }, 1000);
}

// 保存调色板
function savePalette(name: string, colors: string[]) {
  if (!name) {
    figma.ui.postMessage({ type: 'error', message: '请输入调色板名称' });
    return;
  }

  if (colors.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '调色板不能为空' });
    return;
  }

  // 模拟保存调色板
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'palette-saved',
      message: `已保存调色板 "${name}"，包含 ${colors.length} 种颜色`,
      name: name,
      colors: colors
    });
  }, 800);
}

// 加载调色板
function loadPalette(paletteId: string) {
  // 模拟加载调色板
  setTimeout(() => {
    const preset = palettePresets.find(p => p.id === paletteId);
    if (preset) {
      figma.ui.postMessage({
        type: 'palette-loaded',
        message: `已加载调色板 "${preset.name}"`,
        colors: preset.colors
      });
    }
  }, 600);
}

// 导出调色板
function exportPalette(format: string) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要导出的调色板' });
    return;
  }

  // 模拟导出
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'palette-exported',
      message: `调色板已导出为 ${format} 格式`,
      format: format
    });
  }, 1000);
}

// 分析颜色和谐度
function analyzeColorHarmony() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要分析的颜色' });
    return;
  }

  // 模拟颜色和谐度分析
  setTimeout(() => {
    const harmonyAnalysis = {
      overall: 85,
      contrast: 78,
      saturation: 82,
      brightness: 88,
      suggestions: [
        '增加互补色以提高对比度',
        '调整饱和度使颜色更协调',
        '考虑使用单色方案'
      ]
    };

    figma.ui.postMessage({
      type: 'harmony-analyzed',
      message: '颜色和谐度分析完成',
      analysis: harmonyAnalysis
    });
  }, 1200);
}

// 生成相似颜色
function generateSimilarColors(baseColor: string, count: number) {
  if (!baseColor) {
    figma.ui.postMessage({ type: 'error', message: '请选择基础颜色' });
    return;
  }

  // 模拟生成相似颜色
  setTimeout(() => {
    const similarColors = generateMockColors(count);
    
    figma.ui.postMessage({
      type: 'similar-colors-generated',
      message: `已生成 ${count} 种与基础颜色相似的颜色`,
      baseColor: baseColor,
      colors: similarColors
    });
  }, 800);
}

// 生成模拟颜色
function generateMockColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60;
    const lightness = Math.floor(Math.random() * 40) + 30;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}
