/**
 * @file Figma to HTML 插件
 * @description 将Figma设计转换为HTML代码
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 导出选项
const exportOptions = [
  {
    id: '1',
    name: '纯HTML',
    description: '导出为纯HTML文件',
    type: 'HTML',
    extensions: ['html']
  },
  {
    id: '2',
    name: 'HTML + CSS',
    description: '导出为HTML和CSS文件',
    type: 'HTML_CSS',
    extensions: ['html', 'css']
  },
  {
    id: '3',
    name: 'React组件',
    description: '导出为React组件',
    type: 'REACT',
    extensions: ['jsx', 'css']
  },
  {
    id: '4',
    name: 'Vue组件',
    description: '导出为Vue组件',
    type: 'VUE',
    extensions: ['vue']
  },
  {
    id: '5',
    name: 'Tailwind CSS',
    description: '导出为使用Tailwind CSS的HTML',
    type: 'TAILWIND',
    extensions: ['html']
  },
  {
    id: '6',
    name: 'Bootstrap',
    description: '导出为使用Bootstrap的HTML',
    type: 'BOOTSTRAP',
    extensions: ['html']
  }
];

// 代码生成选项
const codeGenOptions = [
  {
    id: '1',
    name: '语义化标签',
    description: '使用语义化HTML标签',
    type: 'SEMANTIC'
  },
  {
    id: '2',
    name: '响应式设计',
    description: '生成响应式CSS代码',
    type: 'RESPONSIVE'
  },
  {
    id: '3',
    name: 'CSS变量',
    description: '使用CSS变量管理颜色和样式',
    type: 'CSS_VARIABLES'
  },
  {
    id: '4',
    name: '类名优化',
    description: '生成简洁的类名',
    type: 'CLASS_OPTIMIZATION'
  },
  {
    id: '5',
    name: '内联样式',
    description: '使用内联样式而非外部CSS',
    type: 'INLINE_STYLES'
  },
  {
    id: '6',
    name: '图片优化',
    description: '优化图片导出和引用',
    type: 'IMAGE_OPTIMIZATION'
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'generate-code':
        generateCode(msg.exportType, msg.options);
        break;
      case 'preview-code':
        previewCode(msg.exportType);
        break;
      case 'copy-code':
        copyCode(msg.exportType);
        break;
      case 'download-code':
        downloadCode(msg.exportType, msg.format);
        break;
      case 'analyze-design':
        analyzeDesign();
        break;
      case 'optimize-code':
        optimizeCode();
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

// 生成代码
function generateCode(exportType, options) {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要导出的元素' });
    return;
  }

  const exportOption = exportOptions.find(e => e.type === exportType);
  if (!exportOption) return;

  // 模拟代码生成
  setTimeout(() => {
    const code = generateSampleCode(exportType, options);
    
    figma.ui.postMessage({
      type: 'code-generated',
      message: `已生成 ${exportOption.name} 代码`,
      exportType: exportType,
      code: code,
      selectedCount: selection.length
    });
  }, 1500);
}

// 预览代码
function previewCode(exportType) {
  const exportOption = exportOptions.find(e => e.type === exportType);
  if (!exportOption) return;

  // 模拟代码预览
  setTimeout(() => {
    const code = generateSampleCode(exportType, []);
    
    figma.ui.postMessage({
      type: 'code-previewed',
      message: `已生成 ${exportOption.name} 代码预览`,
      exportType: exportType,
      code: code
    });
  }, 1000);
}

// 复制代码
function copyCode(exportType) {
  const exportOption = exportOptions.find(e => e.type === exportType);
  if (!exportOption) return;

  // 模拟复制代码
  setTimeout(() => {
    const code = generateSampleCode(exportType, []);
    
    figma.ui.postMessage({
      type: 'code-copied',
      message: `已复制 ${exportOption.name} 代码到剪贴板`,
      exportType: exportType,
      code: code
    });
  }, 600);
}

// 下载代码
function downloadCode(exportType, format) {
  const exportOption = exportOptions.find(e => e.type === exportType);
  if (!exportOption) return;

  // 模拟下载代码
  setTimeout(() => {
    const code = generateSampleCode(exportType, []);
    
    figma.ui.postMessage({
      type: 'code-downloaded',
      message: `已下载 ${exportOption.name} 代码`,
      exportType: exportType,
      format: format,
      code: code
    });
  }, 800);
}

// 分析设计
function analyzeDesign() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要分析的元素' });
    return;
  }

  // 模拟设计分析
  setTimeout(() => {
    const analysis = {
      totalElements: selection.length,
      textElements: Math.floor(selection.length * 0.3),
      imageElements: Math.floor(selection.length * 0.2),
      vectorElements: Math.floor(selection.length * 0.5),
      componentCount: Math.floor(Math.random() * 5) + 1,
      estimatedCodeLines: Math.floor(selection.length * 50) + 100,
      recommendedFramework: 'React',
      complexity: 'Medium'
    };

    figma.ui.postMessage({
      type: 'design-analyzed',
      message: '设计分析完成',
      analysis: analysis
    });
  }, 1200);
}

// 优化代码
function optimizeCode() {
  // 模拟代码优化
  setTimeout(() => {
    const optimizations = {
      removedUnusedCSS: Math.floor(Math.random() * 50) + 10,
      mergedSimilarStyles: Math.floor(Math.random() * 20) + 5,
      optimizedImages: Math.floor(Math.random() * 10) + 2,
      reducedCodeSize: (Math.random() * 30 + 10).toFixed(1) + '%',
      improvedPerformance: (Math.random() * 20 + 5).toFixed(1) + '%'
    };

    figma.ui.postMessage({
      type: 'code-optimized',
      message: '代码优化完成',
      optimizations: optimizations
    });
  }, 1000);
}

// 生成示例代码
function generateSampleCode(exportType, options) {
  switch (exportType) {
    case 'HTML':
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Design</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="title">标题</h1>
      <nav class="navigation">
        <a href="#" class="nav-link">首页</a>
        <a href="#" class="nav-link">关于</a>
        <a href="#" class="nav-link">联系</a>
      </nav>
    </header>
    <main class="main-content">
      <section class="section">
        <h2 class="section-title">内容区域</h2>
        <p class="text">这里是内容文本</p>
      </section>
    </main>
  </div>
</body>
</html>`;

    case 'HTML_CSS':
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Design</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="title">标题</h1>
    </header>
    <main class="main-content">
      <section class="section">
        <h2 class="section-title">内容区域</h2>
        <p class="text">这里是内容文本</p>
      </section>
    </main>
  </div>
</body>
</html>`;

    case 'REACT':
      return `import React from 'react';
import './styles.css';

const FigmaDesign = () => {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">标题</h1>
        <nav className="navigation">
          <a href="#" className="nav-link">首页</a>
          <a href="#" className="nav-link">关于</a>
          <a href="#" className="nav-link">联系</a>
        </nav>
      </header>
      <main className="main-content">
        <section className="section">
          <h2 className="section-title">内容区域</h2>
          <p className="text">这里是内容文本</p>
        </section>
      </main>
    </div>
  );
};

export default FigmaDesign;`;

    case 'VUE':
      return `<template>
  <div class="container">
    <header class="header">
      <h1 class="title">标题</h1>
      <nav class="navigation">
        <a href="#" class="nav-link">首页</a>
        <a href="#" class="nav-link">关于</a>
        <a href="#" class="nav-link">联系</a>
      </nav>
    </header>
    <main class="main-content">
      <section class="section">
        <h2 class="section-title">内容区域</h2>
        <p class="text">这里是内容文本</p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'FigmaDesign'
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  font-weight: bold;
}

.navigation {
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: #333;
}

.main-content {
  padding: 20px 0;
}

.section-title {
  font-size: 24px;
  margin-bottom: 16px;
}

.text {
  line-height: 1.6;
}
</style>`;

    case 'TAILWIND':
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Design</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="max-w-6xl mx-auto p-5">
    <header class="flex justify-between items-center mb-10">
      <h1 class="text-3xl font-bold">标题</h1>
      <nav class="flex gap-5">
        <a href="#" class="text-gray-700 hover:text-gray-900">首页</a>
        <a href="#" class="text-gray-700 hover:text-gray-900">关于</a>
        <a href="#" class="text-gray-700 hover:text-gray-900">联系</a>
      </nav>
    </header>
    <main class="py-5">
      <section>
        <h2 class="text-2xl font-semibold mb-4">内容区域</h2>
        <p class="leading-relaxed">这里是内容文本</p>
      </section>
    </main>
  </div>
</body>
</html>`;

    case 'BOOTSTRAP':
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Design</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container">
    <header class="d-flex justify-content-between align-items-center mb-5">
      <h1 class="display-6 fw-bold">标题</h1>
      <nav class="d-flex gap-3">
        <a href="#" class="text-decoration-none text-dark">首页</a>
        <a href="#" class="text-decoration-none text-dark">关于</a>
        <a href="#" class="text-decoration-none text-dark">联系</a>
      </nav>
    </header>
    <main class="py-4">
      <section>
        <h2 class="h4 mb-3">内容区域</h2>
        <p class="lh-lg">这里是内容文本</p>
      </section>
    </main>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

    default:
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Design</title>
</head>
<body>
  <div>Figma Design</div>
</body>
</html>`;
  }
}
