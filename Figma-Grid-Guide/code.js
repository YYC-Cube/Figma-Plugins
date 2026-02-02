// Figma Grid Guide Plugin
// 为Figma添加网格和参考线的插件

let state = {
  grids: [],
  guides: [],
  selectedFrame: null
};

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'show-ui':
      showUI();
      break;
    case 'create-grid':
      createGrid(msg.grid);
      break;
    case 'update-grid':
      updateGrid(msg.gridId, msg.grid);
      break;
    case 'delete-grid':
      deleteGrid(msg.gridId);
      break;
    case 'toggle-grid':
      toggleGrid(msg.gridId);
      break;
    case 'create-guides':
      createGuides(msg.guides);
      break;
    case 'delete-guides':
      deleteGuides(msg.guideIds);
      break;
    case 'clear-all-guides':
      clearAllGuides();
      break;
    case 'align-to-grid':
      alignToGrid(msg.gridId);
      break;
    case 'snap-to-grid':
      snapToGrid(msg.enabled);
      break;
    case 'close':
      figma.closePlugin();
      break;
  }
};

function showUI() {
  state.selectedFrame = figma.currentPage.selection.find(node => node.type === 'FRAME') || null;
  
  figma.showUI(__html__, {
    width: 400,
    height: 500,
    title: 'Grid Guide'
  });
  
  figma.ui.postMessage({
    type: 'init',
    selectedFrame: state.selectedFrame ? {
      id: state.selectedFrame.id,
      name: state.selectedFrame.name,
      width: state.selectedFrame.width,
      height: state.selectedFrame.height
    } : null,
    grids: state.grids,
    guides: state.guides
  });
}

function createGrid(gridConfig) {
  const grid = {
    id: `grid-${Date.now()}`,
    ...gridConfig
  };
  
  state.grids.push(grid);
  
  applyGridToFrame(grid);
  
  figma.ui.postMessage({
    type: 'grids-updated',
    grids: state.grids
  });
  
  figma.notify(`网格 "${grid.name}" 创建成功`);
}

function updateGrid(gridId, gridConfig) {
  const index = state.grids.findIndex(g => g.id === gridId);
  if (index !== -1) {
    state.grids[index] = {
      ...state.grids[index],
      ...gridConfig
    };
    
    applyGridToFrame(state.grids[index]);
    
    figma.ui.postMessage({
      type: 'grids-updated',
      grids: state.grids
    });
    
    figma.notify('网格已更新');
  }
}

function deleteGrid(gridId) {
  state.grids = state.grids.filter(g => g.id !== gridId);
  
  if (state.selectedFrame) {
    clearFrameGrids(state.selectedFrame);
    state.grids.forEach(grid => applyGridToFrame(grid));
  }
  
  figma.ui.postMessage({
    type: 'grids-updated',
    grids: state.grids
  });
  
  figma.notify('网格已删除');
}

function toggleGrid(gridId) {
  const grid = state.grids.find(g => g.id === gridId);
  if (grid) {
    grid.visible = !grid.visible;
    
    if (state.selectedFrame) {
      clearFrameGrids(state.selectedFrame);
      state.grids.forEach(g => applyGridToFrame(g));
    }
    
    figma.ui.postMessage({
      type: 'grids-updated',
      grids: state.grids
    });
    
    figma.notify(`网格已${grid.visible ? '显示' : '隐藏'}`);
  }
}

function applyGridToFrame(grid) {
  if (!state.selectedFrame || !grid.visible) return;
  
  const frame = state.selectedFrame;
  
  switch (grid.type) {
    case 'column':
      frame.gridStyleId = createColumnGridStyle(grid);
      break;
    case 'row':
      frame.gridStyleId = createRowGridStyle(grid);
      break;
    case 'baseline':
      frame.gridStyleId = createBaselineGridStyle(grid);
      break;
  }
}

function createColumnGridStyle(grid) {
  const gridStyle = figma.createGridStyle();
  gridStyle.name = grid.name;
  gridStyle.gridRows = [];
  gridStyle.gridColumns = [{
    count: grid.count,
    sectionSize: grid.spacing,
    gutterSize: grid.gutter,
    offset: grid.margin
  }];
  gridStyle.color = grid.color;
  return gridStyle.id;
}

function createRowGridStyle(grid) {
  const gridStyle = figma.createGridStyle();
  gridStyle.name = grid.name;
  gridStyle.gridColumns = [];
  gridStyle.gridRows = [{
    count: grid.count,
    sectionSize: grid.spacing,
    gutterSize: grid.gutter,
    offset: grid.margin
  }];
  gridStyle.color = grid.color;
  return gridStyle.id;
}

function createBaselineGridStyle(grid) {
  const gridStyle = figma.createGridStyle();
  gridStyle.name = grid.name;
  gridStyle.gridColumns = [];
  gridStyle.gridRows = [{
    count: grid.count,
    sectionSize: grid.spacing,
    gutterSize: 0,
    offset: 0
  }];
  gridStyle.color = grid.color;
  return gridStyle.id;
}

function clearFrameGrids(frame) {
  frame.gridStyleId = '';
}

function createGuides(guides) {
  const newGuides = guides.map(guide => ({
    id: `guide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...guide
  }));
  
  state.guides.push(...newGuides);
  
  applyGuidesToPage(newGuides);
  
  figma.ui.postMessage({
    type: 'guides-updated',
    guides: state.guides
  });
  
  figma.notify(`已创建 ${newGuides.length} 条参考线`);
}

function applyGuidesToPage(guides) {
  const page = figma.currentPage;
  
  guides.forEach(guide => {
    if (guide.type === 'horizontal') {
      const guideLine = figma.createLine();
      guideLine.resize(page.width, 1);
      guideLine.y = guide.position;
      guideLine.strokes = [{ type: 'SOLID', color: guide.color }];
      guideLine.locked = true;
      guideLine.setPluginData('guide-id', guide.id);
    } else {
      const guideLine = figma.createLine();
      guideLine.resize(1, page.height);
      guideLine.x = guide.position;
      guideLine.strokes = [{ type: 'SOLID', color: guide.color }];
      guideLine.locked = true;
      guideLine.setPluginData('guide-id', guide.id);
    }
  });
}

function deleteGuides(guideIds) {
  state.guides = state.guides.filter(g => !guideIds.includes(g.id));
  
  const guideLines = figma.currentPage.findAll(node => 
    node.type === 'LINE' && guideIds.includes(node.getPluginData('guide-id'))
  );
  guideLines.forEach(line => line.remove());
  
  figma.ui.postMessage({
    type: 'guides-updated',
    guides: state.guides
  });
  
  figma.notify(`已删除 ${guideIds.length} 条参考线`);
}

function clearAllGuides() {
  state.guides = [];
  
  const guideLines = figma.currentPage.findAll(node => 
    node.type === 'LINE' && node.getPluginData('guide-id')
  );
  guideLines.forEach(line => line.remove());
  
  figma.ui.postMessage({
    type: 'guides-updated',
    guides: state.guides
  });
  
  figma.notify('所有参考线已清除');
}

function alignToGrid(gridId) {
  const grid = state.grids.find(g => g.id === gridId);
  if (!grid) return;
  
  const selectedNodes = figma.currentPage.selection;
  if (selectedNodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  selectedNodes.forEach(node => {
    if ('x' in node && 'y' in node) {
      if (grid.type === 'column') {
        const columnWidth = grid.spacing + grid.gutter;
        node.x = Math.round(node.x / columnWidth) * columnWidth;
      } else if (grid.type === 'row') {
        const rowHeight = grid.spacing + grid.gutter;
        node.y = Math.round(node.y / rowHeight) * rowHeight;
      }
    }
  });
  
  figma.notify(`已对齐 ${selectedNodes.length} 个元素到网格`);
}

function snapToGrid(enabled) {
  figma.notify(`网格吸附已${enabled ? '开启' : '关闭'}`);
}

showUI();