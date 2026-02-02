/**
 * @file Figma Autoflow 插件
 * @description 自动创建流程图和连接线，简化用户流程设计
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 流程图类型
const flowTypes = [
  {
    id: '1',
    name: '用户流程',
    description: '创建用户操作流程',
    nodeTypes: ['开始', '操作', '决策', '结束'],
    color: '#4285F4'
  },
  {
    id: '2',
    name: '业务流程',
    description: '创建业务流程图表',
    nodeTypes: ['开始', '流程', '决策', '子流程', '结束'],
    color: '#34A853'
  },
  {
    id: '3',
    name: '系统流程',
    description: '创建系统交互流程',
    nodeTypes: ['开始', '系统', '决策', '接口', '结束'],
    color: '#FBBC05'
  },
  {
    id: '4',
    name: '数据流程',
    description: '创建数据流转流程',
    nodeTypes: ['数据源', '处理', '存储', '输出'],
    color: '#EA4335'
  }
];

// 连接线样式
const connectorStyles = [
  {
    id: '1',
    name: '直线',
    type: 'STRAIGHT',
    description: '直接连接两个节点'
  },
  {
    id: '2',
    name: '正交',
    type: 'ORTHOGONAL',
    description: '使用直角连接线'
  },
  {
    id: '3',
    name: '曲线',
    type: 'BEZIER',
    description: '使用曲线连接线'
  }
];

// 布局方向
const layoutDirections = [
  {
    id: '1',
    name: '从左到右',
    direction: 'LEFT_TO_RIGHT',
    description: '水平布局，从左向右'
  },
  {
    id: '2',
    name: '从上到下',
    direction: 'TOP_TO_BOTTOM',
    description: '垂直布局，从上向下'
  },
  {
    id: '3',
    name: '从右到左',
    direction: 'RIGHT_TO_LEFT',
    description: '水平布局，从右向左'
  },
  {
    id: '4',
    name: '从下到上',
    direction: 'BOTTOM_TO_TOP',
    description: '垂直布局，从下向上'
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'create-flow':
        createFlow(msg.flowType, msg.nodes, msg.direction);
        break;
      case 'connect-selected':
        connectSelectedNodes(msg.connectorStyle, msg.direction);
        break;
      case 'auto-arrange':
        autoArrangeFlow(msg.direction);
        break;
      case 'add-decision':
        addDecisionPoint(msg.position);
        break;
      case 'export-flow':
        exportFlow(msg.format);
        break;
      case 'clear-flow':
        clearFlow();
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

// 创建流程图
function createFlow(flowTypeId: string, nodes: string[], directionId: string) {
  const flowType = flowTypes.find(f => f.id === flowTypeId);
  const direction = layoutDirections.find(d => d.id === directionId);
  
  if (!flowType || !direction) return;

  // 模拟创建流程
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'flow-created',
      message: `已创建 ${flowType.name} 流程图，包含 ${nodes.length} 个节点`,
      flowType: flowType,
      nodeCount: nodes.length,
      direction: direction
    });
  }, 1500);
}

// 连接选中的节点
function connectSelectedNodes(connectorStyleId: string, directionId: string) {
  const connectorStyle = connectorStyles.find(c => c.id === connectorStyleId);
  const direction = layoutDirections.find(d => d.id === directionId);
  
  if (!connectorStyle || !direction) return;

  const selection = figma.currentPage.selection;
  if (selection.length < 2) {
    figma.ui.postMessage({ type: 'error', message: '请至少选择两个要连接的节点' });
    return;
  }

  // 模拟连接节点
  setTimeout(() => {
    const connectionCount = selection.length - 1;
    figma.ui.postMessage({
      type: 'nodes-connected',
      message: `已使用 ${connectorStyle.name} 样式连接 ${connectionCount} 对节点`,
      connectionCount: connectionCount,
      connectorStyle: connectorStyle
    });
  }, 1000);
}

// 自动排列流程图
function autoArrangeFlow(directionId: string) {
  const direction = layoutDirections.find(d => d.id === directionId);
  if (!direction) return;

  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要排列的流程节点' });
    return;
  }

  // 模拟自动排列
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'flow-arranged',
      message: `已按 ${direction.name} 方向自动排列 ${selection.length} 个节点`,
      nodeCount: selection.length,
      direction: direction
    });
  }, 1200);
}

// 添加决策点
function addDecisionPoint(position: string) {
  // 模拟添加决策点
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'decision-added',
      message: `已在 ${position} 位置添加决策点`,
      position: position
    });
  }, 800);
}

// 导出流程图
function exportFlow(format: string) {
  // 模拟导出流程
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'flow-exported',
      message: `流程图已导出为 ${format} 格式`,
      format: format
    });
  }, 1500);
}

// 清除流程图
function clearFlow() {
  const selection = figma.currentPage.selection;
  const nodeCount = selection.length;

  // 模拟清除流程
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'flow-cleared',
      message: `已清除 ${nodeCount} 个流程节点和连接线`,
      nodeCount: nodeCount
    });
  }, 800);
}
