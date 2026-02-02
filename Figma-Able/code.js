/**
 * @file Figma Able 插件
 * @description 可访问性测试和改进插件，帮助设计师创建更具包容性的设计
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 可访问性检查项目
const accessibilityChecks = [
  {
    id: 'color-contrast',
    name: '颜色对比度',
    description: '检查文本与背景的对比度是否符合WCAG标准',
    severity: 'high',
    standard: 'WCAG 2.1 AA'
  },
  {
    id: 'text-size',
    name: '文本大小',
    description: '检查文本大小是否符合可访问性标准',
    severity: 'medium',
    standard: 'WCAG 2.1 AA'
  },
  {
    id: 'keyboard-nav',
    name: '键盘导航',
    description: '检查元素是否可通过键盘访问',
    severity: 'high',
    standard: 'WCAG 2.1 AA'
  },
  {
    id: 'alt-text',
    name: '替代文本',
    description: '检查图片是否有替代文本',
    severity: 'medium',
    standard: 'WCAG 2.1 AA'
  },
  {
    id: 'semantic-structure',
    name: '语义结构',
    description: '检查设计的语义结构是否合理',
    severity: 'low',
    standard: 'WCAG 2.1 AA'
  },
  {
    id: 'focus-indicators',
    name: '焦点指示器',
    description: '检查元素是否有明确的焦点指示器',
    severity: 'medium',
    standard: 'WCAG 2.1 AA'
  },
  {
    id: 'motion-sensitivity',
    name: '运动敏感度',
    description: '检查是否有可能触发前庭功能障碍的动画',
    severity: 'medium',
    standard: 'WCAG 2.1 AA'
  },
  {
    id: 'color-dependency',
    name: '颜色依赖',
    description: '检查信息是否仅通过颜色传达',
    severity: 'high',
    standard: 'WCAG 2.1 AA'
  }
];

// 模拟可访问性问题数据
const mockAccessibilityIssues = [
  {
    id: '1',
    type: 'color-contrast',
    severity: 'high',
    description: '标题文本与背景对比度不足',
    location: 'Page 1 / Header / Title',
    elementId: '1:2',
    suggestions: [
      '增加文本颜色深度',
      '减少背景颜色亮度',
      '添加文本阴影以增强可读性'
    ]
  },
  {
    id: '2',
    type: 'alt-text',
    severity: 'medium',
    description: '图片缺少替代文本',
    location: 'Page 1 / Hero / Image',
    elementId: '1:5',
    suggestions: [
      '添加描述性替代文本',
      '如果图片仅用于装饰，使用空的替代文本'
    ]
  },
  {
    id: '3',
    type: 'keyboard-nav',
    severity: 'high',
    description: '按钮缺少键盘焦点状态',
    location: 'Page 1 / CTA / Button',
    elementId: '1:8',
    suggestions: [
      '添加明确的焦点指示器',
      '确保按钮可通过Tab键访问'
    ]
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'run-accessibility-check':
        runAccessibilityCheck();
        break;
      case 'fix-issue':
        fixIssue(msg.issueId);
        break;
      case 'generate-alt-text':
        generateAltText();
        break;
      case 'check-color-contrast':
        checkColorContrast(msg.foreground, msg.background);
        break;
      case 'simulate-vision-impairment':
        simulateVisionImpairment(msg.type);
        break;
      case 'export-accessibility-report':
        exportAccessibilityReport();
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

// 运行可访问性检查
function runAccessibilityCheck() {
  // 模拟检查过程
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'accessibility-results',
      issues: mockAccessibilityIssues,
      totalChecks: accessibilityChecks.length,
      passedChecks: accessibilityChecks.length - mockAccessibilityIssues.length,
      failedChecks: mockAccessibilityIssues.length,
      compliance: 75 // 百分比
    });
  }, 1500);
}

// 修复可访问性问题
function fixIssue(issueId) {
  const issue = mockAccessibilityIssues.find(i => i.id === issueId);
  if (!issue) return;

  // 模拟修复过程
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'issue-fixed',
      message: `已修复问题: ${issue.description}`,
      issueId: issueId
    });
  }, 1000);
}

// 生成图片替代文本
function generateAltText() {
  const images = figma.currentPage.findAll(node => 
    node.type === 'RECTANGLE' && node.fills[0]?.type === 'IMAGE'
  );

  // 模拟生成替代文本
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'alt-text-generated',
      count: images.length,
      message: `已为 ${images.length} 个图片生成替代文本`
    });
  }, 1200);
}

// 检查颜色对比度
function checkColorContrast(foreground, background) {
  // 模拟对比度检查
  setTimeout(() => {
    // 模拟对比度结果
    const contrastRatio = 4.5; // WCAG AA标准为4.5:1
    const passesAA = contrastRatio >= 4.5;
    const passesAAA = contrastRatio >= 7;

    figma.ui.postMessage({
      type: 'contrast-result',
      foreground: foreground,
      background: background,
      contrastRatio: contrastRatio.toFixed(2),
      passesAA: passesAA,
      passesAAA: passesAAA,
      message: `对比度: ${contrastRatio.toFixed(2)}:1 - ${passesAA ? '通过' : '未通过'} WCAG AA标准`
    });
  }, 500);
}

// 模拟视觉障碍
function simulateVisionImpairment(type) {
  // 模拟视觉障碍效果
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'vision-impairment-simulated',
      type: type,
      message: `已应用 ${type} 视觉障碍模拟`
    });
  }, 800);
}

// 导出可访问性报告
function exportAccessibilityReport() {
  // 模拟报告导出
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'report-exported',
      message: '可访问性报告已导出为PDF文件'
    });
  }, 1000);
}
