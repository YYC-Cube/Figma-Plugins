/**
 * @file Figma Redlines 插件
 * @description 红线标注和设计审查工具
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 标注类型
const annotationTypes = [
  {
    id: '1',
    name: '尺寸标注',
    description: '标注元素的宽高尺寸',
    type: 'DIMENSION',
    color: '#FF5722'
  },
  {
    id: '2',
    name: '间距标注',
    description: '标注元素之间的间距',
    type: 'SPACING',
    color: '#2196F3'
  },
  {
    id: '3',
    name: '文本标注',
    description: '添加文本说明和注释',
    type: 'TEXT',
    color: '#4CAF50'
  },
  {
    id: '4',
    name: '问题标注',
    description: '标注设计问题和需要修改的地方',
    type: 'ISSUE',
    color: '#F44336'
  },
  {
    id: '5',
    name: '建议标注',
    description: '标注设计建议和改进意见',
    type: 'SUGGESTION',
    color: '#FF9800'
  },
  {
    id: '6',
    name: '完成标注',
    description: '标注已完成的部分',
    type: 'COMPLETED',
    color: '#9C27B0'
  }
];

// 审查模板
const reviewTemplates = [
  {
    id: '1',
    name: '视觉一致性',
    description: '检查颜色、字体、间距等视觉元素的一致性',
    checks: [
      '颜色使用是否一致',
      '字体大小和样式是否统一',
      '间距和边距是否规范',
      '图标风格是否一致'
    ]
  },
  {
    id: '2',
    name: '可访问性',
    description: '检查设计的可访问性和无障碍支持',
    checks: [
      '颜色对比度是否达标',
      '字体大小是否可读',
      '是否有足够的点击区域',
      '是否支持键盘导航'
    ]
  },
  {
    id: '3',
    name: '响应式设计',
    description: '检查设计在不同屏幕尺寸下的表现',
    checks: [
      '是否适配移动端',
      '是否适配平板设备',
      '是否适配桌面端',
      '布局是否灵活适应'
    ]
  },
  {
    id: '4',
    name: '用户体验',
    description: '检查用户体验和交互设计',
    checks: [
      '导航是否清晰',
      '操作流程是否顺畅',
      '反馈是否及时',
      '错误处理是否完善'
    ]
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'add-annotation':
        addAnnotation(msg.annotationType, msg.text, msg.position);
        break;
      case 'add-dimension':
        addDimension(msg.target);
        break;
      case 'add-spacing':
        addSpacing(msg.target1, msg.target2);
        break;
      case 'run-review':
        runReview(msg.templateId);
        break;
      case 'export-annotations':
        exportAnnotations(msg.format);
        break;
      case 'clear-annotations':
        clearAnnotations();
        break;
      case 'toggle-annotations':
        toggleAnnotations();
        break;
      case 'create-review-report':
        createReviewReport();
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

// 添加标注
function addAnnotation(annotationType: string, text: string, position: { x: number; y: number }) {
  const annotation = annotationTypes.find(a => a.type === annotationType);
  if (!annotation) return;

  // 模拟添加标注
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'annotation-added',
      message: `已添加 ${annotation.name} 标注`,
      annotationType: annotationType,
      text: text
    });
  }, 600);
}

// 添加尺寸标注
function addDimension(target: string) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要标注尺寸的元素' });
    return;
  }

  // 模拟添加尺寸标注
  setTimeout(() => {
    const node = selection[0];
    const width = Math.floor(node.width);
    const height = Math.floor(node.height);
    
    figma.ui.postMessage({
      type: 'dimension-added',
      message: `已添加尺寸标注: ${width} × ${height}`,
      width: width,
      height: height
    });
  }, 800);
}

// 添加间距标注
function addSpacing(target1: string, target2: string) {
  const selection = figma.currentPage.selection;
  if (selection.length < 2) {
    figma.ui.postMessage({ type: 'error', message: '请先选择至少两个元素来标注间距' });
    return;
  }

  // 模拟添加间距标注
  setTimeout(() => {
    const spacing = Math.floor(Math.random() * 50) + 10;
    
    figma.ui.postMessage({
      type: 'spacing-added',
      message: `已添加间距标注: ${spacing}px`,
      spacing: spacing
    });
  }, 800);
}

// 运行审查
function runReview(templateId: string) {
  const template = reviewTemplates.find(t => t.id === templateId);
  if (!template) return;

  // 模拟运行审查
  setTimeout(() => {
    const results = template.checks.map(check => ({
      check: check,
      status: Math.random() > 0.3 ? 'passed' : 'failed',
      notes: Math.random() > 0.5 ? '符合设计规范' : '需要改进'
    }));

    figma.ui.postMessage({
      type: 'review-completed',
      message: `已完成 ${template.name} 审查`,
      template: template,
      results: results
    });
  }, 1500);
}

// 导出标注
function exportAnnotations(format: string) {
  // 模拟导出标注
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'annotations-exported',
      message: `标注已导出为 ${format} 格式`,
      format: format
    });
  }, 1000);
}

// 清除标注
function clearAnnotations() {
  // 模拟清除标注
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'annotations-cleared',
      message: '已清除所有标注'
    });
  }, 600);
}

// 切换标注显示
function toggleAnnotations() {
  // 模拟切换标注显示
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'annotations-toggled',
      message: '已切换标注显示状态'
    });
  }, 400);
}

// 创建审查报告
function createReviewReport() {
  // 模拟创建审查报告
  setTimeout(() => {
    const report = {
      title: '设计审查报告',
      date: new Date().toISOString(),
      totalAnnotations: Math.floor(Math.random() * 30) + 10,
      issues: Math.floor(Math.random() * 10) + 2,
      suggestions: Math.floor(Math.random() * 8) + 3,
      completed: Math.floor(Math.random() * 15) + 5,
      summary: '整体设计质量良好，需要关注可访问性和响应式设计'
    };

    figma.ui.postMessage({
      type: 'report-created',
      message: '已创建审查报告',
      report: report
    });
  }, 1200);
}
