// Figma Design Lint Plugin
// 设计规范检查插件

// 设计规范配置
const designSpecs = {
  naming: {
    componentPrefix: "Component",
    variantSeparator: "__",
    maxLength: 30
  },
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    background: "#FFFFFF",
    text: "#000000",
    error: "#FF3B30",
    warning: "#FF9500",
    success: "#34C759"
  },
  typography: {
    fonts: ["SF Pro Text", "PingFang SC", "Helvetica Neue", "Arial"],
    sizes: [12, 14, 16, 18, 20, 24, 30, 36, 48],
    weights: [400, 500, 600, 700]
  },
  spacing: {
    base: 4,
    increments: [4, 8, 12, 16, 24, 32, 48, 64]
  },
  components: {
    button: {
      minWidth: 44,
      minHeight: 44,
      borderRadius: [4, 8, 12, 22]
    },
    card: {
      borderRadius: [4, 8, 12],
      shadow: "0 2px 4px rgba(0,0,0,0.1)"
    }
  }
};

// 检查结果存储
let lintResults = [];

// 监听消息
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'run-lint') {
    await runLintChecks();
  } else if (msg.type === 'fix-issue') {
    await fixIssue(msg.issueId);
  } else if (msg.type === 'fix-all') {
    await fixAllIssues();
  } else if (msg.type === 'dismiss-issue') {
    dismissIssue(msg.issueId);
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};

// 运行所有检查
async function runLintChecks() {
  lintResults = [];
  
  // 检查命名规范
  checkNamingConventions();
  
  // 检查颜色使用
  checkColorUsage();
  
  // 检查排版
  checkTypography();
  
  // 检查间距
  checkSpacing();
  
  // 检查组件规范
  checkComponentSpecs();
  
  // 发送结果到UI
  figma.ui.postMessage({
    type: 'lint-results',
    results: lintResults
  });
}

// 检查命名规范
function checkNamingConventions() {
  const nodes = figma.currentPage.findAll();
  
  nodes.forEach((node, index) => {
    if (node.name) {
      // 检查组件命名
      if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
        if (!node.name.startsWith(designSpecs.naming.componentPrefix)) {
          lintResults.push({
            id: `naming-${index}-1`,
            type: 'naming',
            severity: 'warning',
            message: `组件名称应以"${designSpecs.naming.componentPrefix}"开头`,
            nodeId: node.id,
            nodeName: node.name,
            fixable: true
          });
        }
      }
      
      // 检查名称长度
      if (node.name.length > designSpecs.naming.maxLength) {
        lintResults.push({
          id: `naming-${index}-2`,
          type: 'naming',
          severity: 'info',
          message: `名称过长（${node.name.length}字符），建议不超过${designSpecs.naming.maxLength}字符`,
          nodeId: node.id,
          nodeName: node.name,
          fixable: false
        });
      }
    }
  });
}

// 检查颜色使用
function checkColorUsage() {
  const nodes = figma.currentPage.findAll();
  
  nodes.forEach((node, index) => {
    // 检查填充色
    if ('fills' in node && node.fills) {
      node.fills.forEach((fill, fillIndex) => {
        if (fill.type === 'SOLID' && fill.color) {
          const colorHex = rgbToHex(fill.color);
          const isInSpec = Object.values(designSpecs.colors).includes(colorHex);
          
          if (!isInSpec) {
            lintResults.push({
              id: `color-${index}-${fillIndex}`,
              type: 'color',
              severity: 'warning',
              message: `使用了非规范颜色: ${colorHex}`,
              nodeId: node.id,
              nodeName: node.name,
              fixable: true
            });
          }
        }
      });
    }
    
    // 检查描边色
    if ('strokes' in node && node.strokes) {
      node.strokes.forEach((stroke, strokeIndex) => {
        if (stroke.type === 'SOLID' && stroke.color) {
          const colorHex = rgbToHex(stroke.color);
          const isInSpec = Object.values(designSpecs.colors).includes(colorHex);
          
          if (!isInSpec) {
            lintResults.push({
              id: `stroke-${index}-${strokeIndex}`,
              type: 'color',
              severity: 'warning',
              message: `使用了非规范描边颜色: ${colorHex}`,
              nodeId: node.id,
              nodeName: node.name,
              fixable: true
            });
          }
        }
      });
    }
  });
}

// 检查排版
function checkTypography() {
  const nodes = figma.currentPage.findAll(node => node.type === 'TEXT');
  
  nodes.forEach((node, index) => {
    // 检查字体
    if (node.fontName) {
      const fontName = node.fontName.family;
      if (!designSpecs.typography.fonts.includes(fontName)) {
        lintResults.push({
          id: `typography-${index}-1`,
          type: 'typography',
          severity: 'warning',
          message: `使用了非规范字体: ${fontName}`,
          nodeId: node.id,
          nodeName: node.name,
          fixable: true
        });
      }
    }
    
    // 检查字号
    if (node.fontSize) {
      if (!designSpecs.typography.sizes.includes(node.fontSize)) {
        lintResults.push({
          id: `typography-${index}-2`,
          type: 'typography',
          severity: 'info',
          message: `使用了非规范字号: ${node.fontSize}px`,
          nodeId: node.id,
          nodeName: node.name,
          fixable: true
        });
      }
    }
  });
}

// 检查间距
function checkSpacing() {
  const nodes = figma.currentPage.findAll();
  
  nodes.forEach((node, index) => {
    // 检查位置
    if ('x' in node && 'y' in node) {
      if (node.x % designSpecs.spacing.base !== 0) {
        lintResults.push({
          id: `spacing-${index}-1`,
          type: 'spacing',
          severity: 'info',
          message: `X位置未对齐到网格: ${node.x}px`,
          nodeId: node.id,
          nodeName: node.name,
          fixable: true
        });
      }
      
      if (node.y % designSpecs.spacing.base !== 0) {
        lintResults.push({
          id: `spacing-${index}-2`,
          type: 'spacing',
          severity: 'info',
          message: `Y位置未对齐到网格: ${node.y}px`,
          nodeId: node.id,
          nodeName: node.name,
          fixable: true
        });
      }
    }
    
    // 检查尺寸
    if ('width' in node && 'height' in node) {
      if (node.width % designSpecs.spacing.base !== 0) {
        lintResults.push({
          id: `spacing-${index}-3`,
          type: 'spacing',
          severity: 'info',
          message: `宽度未对齐到网格: ${node.width}px`,
          nodeId: node.id,
          nodeName: node.name,
          fixable: true
        });
      }
      
      if (node.height % designSpecs.spacing.base !== 0) {
        lintResults.push({
          id: `spacing-${index}-4`,
          type: 'spacing',
          severity: 'info',
          message: `高度未对齐到网格: ${node.height}px`,
          nodeId: node.id,
          nodeName: node.name,
          fixable: true
        });
      }
    }
  });
}

// 检查组件规范
function checkComponentSpecs() {
  const nodes = figma.currentPage.findAll();
  
  nodes.forEach((node, index) => {
    // 检查按钮
    if (node.name.toLowerCase().includes('button')) {
      if ('width' in node && 'height' in node) {
        if (node.width < designSpecs.components.button.minWidth) {
          lintResults.push({
            id: `component-${index}-1`,
            type: 'component',
            severity: 'warning',
            message: `按钮宽度小于最小要求: ${node.width}px (最小 ${designSpecs.components.button.minWidth}px)`,
            nodeId: node.id,
            nodeName: node.name,
            fixable: true
          });
        }
        
        if (node.height < designSpecs.components.button.minHeight) {
          lintResults.push({
            id: `component-${index}-2`,
            type: 'component',
            severity: 'warning',
            message: `按钮高度小于最小要求: ${node.height}px (最小 ${designSpecs.components.button.minHeight}px)`,
            nodeId: node.id,
            nodeName: node.name,
            fixable: true
          });
        }
      }
      
      if ('cornerRadius' in node) {
        if (!designSpecs.components.button.borderRadius.includes(node.cornerRadius)) {
          lintResults.push({
            id: `component-${index}-3`,
            type: 'component',
            severity: 'info',
            message: `按钮圆角使用了非规范值: ${node.cornerRadius}px`,
            nodeId: node.id,
            nodeName: node.name,
            fixable: true
          });
        }
      }
    }
    
    // 检查卡片
    if (node.name.toLowerCase().includes('card')) {
      if ('cornerRadius' in node) {
        if (!designSpecs.components.card.borderRadius.includes(node.cornerRadius)) {
          lintResults.push({
            id: `component-${index}-4`,
            type: 'component',
            severity: 'info',
            message: `卡片圆角使用了非规范值: ${node.cornerRadius}px`,
            nodeId: node.id,
            nodeName: node.name,
            fixable: true
          });
        }
      }
    }
  });
}

// 修复问题
async function fixIssue(issueId) {
  const issue = lintResults.find(result => result.id === issueId);
  if (!issue) return;
  
  const node = figma.getNodeById(issue.nodeId);
  if (!node) return;
  
  try {
    switch (issue.type) {
      case 'naming':
        if (issue.message.includes('组件名称应')) {
          node.name = designSpecs.naming.componentPrefix + node.name;
        }
        break;
        
      case 'color':
        if ('fills' in node && node.fills) {
          node.fills = node.fills.map(fill => {
            if (fill.type === 'SOLID') {
              return {
                ...fill,
                color: hexToRgb(designSpecs.colors.primary)
              };
            }
            return fill;
          });
        }
        if ('strokes' in node && node.strokes) {
          node.strokes = node.strokes.map(stroke => {
            if (stroke.type === 'SOLID') {
              return {
                ...stroke,
                color: hexToRgb(designSpecs.colors.primary)
              };
            }
            return stroke;
          });
        }
        break;
        
      case 'typography':
        if (node.type === 'TEXT') {
          await figma.loadFontAsync({
            family: designSpecs.typography.fonts[0],
            style: 'Regular'
          });
          node.fontName = {
            family: designSpecs.typography.fonts[0],
            style: 'Regular'
          };
          
          // 找到最接近的规范字号
          const closestSize = designSpecs.typography.sizes.reduce((prev, curr) => {
            return (Math.abs(curr - node.fontSize) < Math.abs(prev - node.fontSize) ? curr : prev);
          });
          node.fontSize = closestSize;
        }
        break;
        
      case 'spacing':
        if ('x' in node) {
          node.x = Math.round(node.x / designSpecs.spacing.base) * designSpecs.spacing.base;
        }
        if ('y' in node) {
          node.y = Math.round(node.y / designSpecs.spacing.base) * designSpecs.spacing.base;
        }
        if ('width' in node) {
          node.width = Math.round(node.width / designSpecs.spacing.base) * designSpecs.spacing.base;
        }
        if ('height' in node) {
          node.height = Math.round(node.height / designSpecs.spacing.base) * designSpecs.spacing.base;
        }
        break;
        
      case 'component':
        if (node.name.toLowerCase().includes('button')) {
          if ('width' in node && node.width < designSpecs.components.button.minWidth) {
            node.width = designSpecs.components.button.minWidth;
          }
          if ('height' in node && node.height < designSpecs.components.button.minHeight) {
            node.height = designSpecs.components.button.minHeight;
          }
          if ('cornerRadius' in node) {
            node.cornerRadius = designSpecs.components.button.borderRadius[0];
          }
        }
        if (node.name.toLowerCase().includes('card') && 'cornerRadius' in node) {
          node.cornerRadius = designSpecs.components.card.borderRadius[0];
        }
        break;
    }
    
    // 从结果中移除已修复的问题
    lintResults = lintResults.filter(result => result.id !== issueId);
    
    // 发送更新后的结果
    figma.ui.postMessage({
      type: 'lint-results',
      results: lintResults
    });
    
  } catch (error) {
    console.error('修复问题时出错:', error);
  }
}

// 修复所有问题
async function fixAllIssues() {
  const fixableIssues = lintResults.filter(issue => issue.fixable);
  
  for (const issue of fixableIssues) {
    await fixIssue(issue.id);
  }
}

// 忽略问题
function dismissIssue(issueId) {
  lintResults = lintResults.filter(result => result.id !== issueId);
  
  // 发送更新后的结果
  figma.ui.postMessage({
    type: 'lint-results',
    results: lintResults
  });
}

// RGB转HEX
function rgbToHex(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// HEX转RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: 1
  } : { r: 0, g: 0, b: 0, a: 1 };
}

// 初始化插件
figma.showUI(__html__, {
  width: 400,
  height: 500,
  title: 'Design Lint'
});

// 运行初始检查
runLintChecks();