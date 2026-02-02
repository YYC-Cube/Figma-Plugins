// Figma EX Plugin
// 增强Figma功能的扩展插件

// 插件状态
let state = {
  selectedNodes: [],
  isRunning: false
};

// 监听消息
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'show-ui':
      showUI();
      break;
    case 'align-center':
      alignCenter();
      break;
    case 'distribute-evenly':
      distributeEvenly(msg.axis);
      break;
    case 'resize-to-fit':
      resizeToFit();
      break;
    case 'convert-to-components':
      convertToComponents();
      break;
    case 'batch-rename':
      batchRename(msg.pattern, msg.startIndex);
      break;
    case 'duplicate-grid':
      duplicateGrid(msg.rows, msg.columns, msg.xSpacing, msg.ySpacing);
      break;
    case 'generate-placeholders':
      generatePlaceholders(msg.count, msg.type);
      break;
    case 'extract-styles':
      extractStyles();
      break;
    case 'clean-up':
      cleanUp();
      break;
    case 'close':
      figma.closePlugin();
      break;
  }
};

// 显示UI
function showUI() {
  state.selectedNodes = figma.currentPage.selection;
  
  figma.showUI(__html__, {
    width: 400,
    height: 500,
    title: 'Figma EX'
  });
  
  // 发送初始状态
  figma.ui.postMessage({
    type: 'init',
    selectedCount: state.selectedNodes.length
  });
}

// 居中对齐
function alignCenter() {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  // 计算选择框的边界
  const bounds = getBoundingBox(nodes);
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  
  // 对齐到画布中心
  const viewportCenter = {
    x: figma.viewport.bounds.x + figma.viewport.bounds.width / 2,
    y: figma.viewport.bounds.y + figma.viewport.bounds.height / 2
  };
  
  // 计算偏移量
  const offsetX = viewportCenter.x - centerX;
  const offsetY = viewportCenter.y - centerY;
  
  // 应用偏移
  nodes.forEach(node => {
    node.x += offsetX;
    node.y += offsetY;
  });
  
  figma.notify('已居中对齐');
}

// 均匀分布
function distributeEvenly(axis) {
  const nodes = figma.currentPage.selection;
  if (nodes.length < 3) {
    figma.notify('请至少选择3个元素');
    return;
  }
  
  // 按位置排序
  const sortedNodes = [...nodes].sort((a, b) => {
    return axis === 'horizontal' ? a.x - b.x : a.y - b.y;
  });
  
  // 获取第一个和最后一个元素的位置
  const firstNode = sortedNodes[0];
  const lastNode = sortedNodes[sortedNodes.length - 1];
  
  const start = axis === 'horizontal' ? firstNode.x + firstNode.width : firstNode.y + firstNode.height;
  const end = axis === 'horizontal' ? lastNode.x : lastNode.y;
  const distance = end - start;
  const spacing = distance / (sortedNodes.length - 1);
  
  // 分布中间的元素
  for (let i = 1; i < sortedNodes.length - 1; i++) {
    const node = sortedNodes[i];
    if (axis === 'horizontal') {
      node.x = start + (i * spacing) - node.width / 2;
    } else {
      node.y = start + (i * spacing) - node.height / 2;
    }
  }
  
  figma.notify(`已${axis === 'horizontal' ? '水平' : '垂直'}均匀分布`);
}

// 调整大小以适应内容
function resizeToFit() {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  nodes.forEach(node => {
    if (node.type === 'TEXT') {
      node.resizeToFitText();
    } else if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      // 计算内容边界
      const contentBounds = getBoundingBox(node.children);
      
      // 调整容器大小
      node.resize(contentBounds.width, contentBounds.height);
      
      // 调整子元素位置
      node.children.forEach(child => {
        child.x -= contentBounds.x;
        child.y -= contentBounds.y;
      });
    }
  });
  
  figma.notify('已调整大小以适应内容');
}

// 转换为组件
function convertToComponents() {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  const components = [];
  
  nodes.forEach(node => {
    const component = figma.createComponent();
    component.name = node.name;
    component.x = node.x;
    component.y = node.y;
    
    // 复制内容到组件
    const clone = node.clone();
    component.appendChild(clone);
    clone.x = 0;
    clone.y = 0;
    
    // 调整组件大小
    component.resize(node.width, node.height);
    
    // 隐藏原始节点
    node.visible = false;
    
    components.push(component);
  });
  
  // 选择创建的组件
  figma.currentPage.selection = components;
  
  figma.notify(`已创建 ${components.length} 个组件`);
}

// 批量重命名
function batchRename(pattern, startIndex) {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  nodes.forEach((node, index) => {
    const currentIndex = startIndex + index;
    node.name = pattern.replace('{index}', currentIndex.toString());
  });
  
  figma.notify(`已重命名 ${nodes.length} 个元素`);
}

// 网格复制
function duplicateGrid(rows, columns, xSpacing, ySpacing) {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  const duplicates = [];
  
  // 计算原始选择的边界
  const bounds = getBoundingBox(nodes);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // 跳过第一个位置（原始元素）
      if (row === 0 && col === 0) continue;
      
      nodes.forEach(node => {
        const clone = node.clone();
        clone.x = node.x + (col * (bounds.width + xSpacing));
        clone.y = node.y + (row * (bounds.height + ySpacing));
        duplicates.push(clone);
      });
    }
  }
  
  // 选择所有元素
  figma.currentPage.selection = [...nodes, ...duplicates];
  
  figma.notify(`已创建 ${duplicates.length} 个副本`);
}

// 生成占位符
function generatePlaceholders(count, type) {
  const placeholders = [];
  
  for (let i = 0; i < count; i++) {
    let placeholder;
    
    switch (type) {
      case 'text':
        placeholder = figma.createText();
        placeholder.characters = `Placeholder ${i + 1}`;
        placeholder.resize(200, 30);
        break;
      case 'image':
        placeholder = figma.createRectangle();
        placeholder.resize(200, 150);
        placeholder.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9, a: 1 } }];
        break;
      case 'rectangle':
        placeholder = figma.createRectangle();
        placeholder.resize(100, 100);
        placeholder.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 1, a: 1 } }];
        break;
    }
    
    placeholder.x = 50 + (i % 4) * 250;
    placeholder.y = 50 + Math.floor(i / 4) * 200;
    placeholder.name = `${type}-placeholder-${i + 1}`;
    
    placeholders.push(placeholder);
  }
  
  // 选择创建的占位符
  figma.currentPage.selection = placeholders;
  
  figma.notify(`已创建 ${count} 个${type === 'text' ? '文本' : type === 'image' ? '图片' : '矩形'}占位符`);
}

// 提取样式
function extractStyles() {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  let stylesCreated = 0;
  
  nodes.forEach(node => {
    // 提取填充样式
    if ('fills' in node && node.fills) {
      node.fills.forEach(fill => {
        if (fill.type === 'SOLID') {
          const style = figma.createPaintStyle();
          style.name = `Fill-${node.name}`;
          style.paints = [fill];
          stylesCreated++;
        }
      });
    }
    
    // 提取描边样式
    if ('strokes' in node && node.strokes) {
      node.strokes.forEach(stroke => {
        if (stroke.type === 'SOLID') {
          const style = figma.createPaintStyle();
          style.name = `Stroke-${node.name}`;
          style.paints = [stroke];
          stylesCreated++;
        }
      });
    }
    
    // 提取文本样式
    if (node.type === 'TEXT') {
      const style = figma.createTextStyle();
      style.name = `Text-${node.name}`;
      style.fontName = node.fontName;
      style.fontSize = node.fontSize;
      style.lineHeight = node.lineHeight;
      style.letterSpacing = node.letterSpacing;
      style.textCase = node.textCase;
      style.textDecoration = node.textDecoration;
      stylesCreated++;
    }
  });
  
  figma.notify(`已创建 ${stylesCreated} 个样式`);
}

// 清理文件
function cleanUp() {
  let cleanedItems = 0;
  
  // 遍历所有页面
  figma.root.children.forEach(page => {
    // 查找隐藏的节点
    const hiddenNodes = page.findAll(node => !node.visible);
    hiddenNodes.forEach(node => {
      node.remove();
      cleanedItems++;
    });
    
    // 查找空容器
    const emptyContainers = page.findAll(node => {
      return (node.type === 'FRAME' || node.type === 'GROUP') && 
             node.children.length === 0;
    });
    emptyContainers.forEach(node => {
      node.remove();
      cleanedItems++;
    });
  });
  
  figma.notify(`已清理 ${cleanedItems} 个项目`);
}

// 辅助函数：获取边界框
function getBoundingBox(nodes) {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  nodes.forEach(node => {
    const bounds = node.absoluteBoundingBox;
    if (bounds) {
      minX = Math.min(minX, bounds.x);
      minY = Math.min(minY, bounds.y);
      maxX = Math.max(maxX, bounds.x + bounds.width);
      maxY = Math.max(maxY, bounds.y + bounds.height);
    }
  });
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

// 初始化插件
showUI();