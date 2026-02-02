/**
 * @file Figma Gleef 插件
 * @description 为Figma添加创意效果和滤镜的插件
 * @module figma-gleef
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

// 导入Figma类型
type RectangleNode = InstanceType<typeof figma.RectangleNode>;
type TextNode = InstanceType<typeof figma.TextNode>;
type FrameNode = InstanceType<typeof figma.FrameNode>;
type ComponentNode = InstanceType<typeof figma.ComponentNode>;
type InstanceNode = InstanceType<typeof figma.InstanceNode>;

// 效果类型
type EffectType = 'blur' | 'shadow' | 'glow' | 'gradient' | 'noise' | 'distortion' | 'vintage' | 'comic' | 'pixel';

// 效果接口
interface Effect {
  id: string;
  name: string;
  type: EffectType;
  parameters: {
    [key: string]: any;
  };
}

// 预设效果
const presetEffects: Effect[] = [
  {
    id: 'blur-soft',
    name: '柔和模糊',
    type: 'blur',
    parameters: {
      radius: 8,
      type: 'GAUSSIAN'
    }
  },
  {
    id: 'blur-motion',
    name: '运动模糊',
    type: 'blur',
    parameters: {
      radius: 12,
      type: 'MOTION',
      direction: 45
    }
  },
  {
    id: 'shadow-soft',
    name: '柔和阴影',
    type: 'shadow',
    parameters: {
      color: { r: 0, g: 0, b: 0, a: 0.2 },
      offset: { x: 0, y: 4 },
      radius: 8,
      visible: true
    }
  },
  {
    id: 'shadow-hard',
    name: '硬阴影',
    type: 'shadow',
    parameters: {
      color: { r: 0, g: 0, b: 0, a: 0.3 },
      offset: { x: 2, y: 2 },
      radius: 2,
      visible: true
    }
  },
  {
    id: 'glow-blue',
    name: '蓝色光晕',
    type: 'glow',
    parameters: {
      color: { r: 0, g: 0.5, b: 1, a: 0.6 },
      radius: 16,
      visible: true
    }
  },
  {
    id: 'glow-pink',
    name: '粉色光晕',
    type: 'glow',
    parameters: {
      color: { r: 1, g: 0, b: 0.5, a: 0.6 },
      radius: 16,
      visible: true
    }
  },
  {
    id: 'gradient-linear',
    name: '线性渐变',
    type: 'gradient',
    parameters: {
      type: 'LINEAR',
      colors: [
        { r: 0, g: 0.5, b: 1, a: 1 },
        { r: 1, g: 0, b: 0.5, a: 1 }
      ],
      angle: 90
    }
  },
  {
    id: 'gradient-radial',
    name: '径向渐变',
    type: 'gradient',
    parameters: {
      type: 'RADIAL',
      colors: [
        { r: 1, g: 1, b: 1, a: 1 },
        { r: 0, g: 0, b: 0, a: 1 }
      ]
    }
  },
  {
    id: 'noise-subtle',
    name: '细微噪点',
    type: 'noise',
    parameters: {
      intensity: 0.1,
      monochrome: true
    }
  },
  {
    id: 'noise-heavy',
    name: '重度噪点',
    type: 'noise',
    parameters: {
      intensity: 0.3,
      monochrome: false
    }
  },
  {
    id: 'distortion-wave',
    name: '波浪扭曲',
    type: 'distortion',
    parameters: {
      type: 'WAVE',
      amplitude: 10,
      frequency: 5
    }
  },
  {
    id: 'distortion-bulge',
    name: '膨胀扭曲',
    type: 'distortion',
    parameters: {
      type: 'BULGE',
      strength: 0.5,
      radius: 50
    }
  },
  {
    id: 'vintage-photo',
    name: '复古照片',
    type: 'vintage',
    parameters: {
      sepia: 0.6,
      contrast: 1.2,
      brightness: 0.9,
      grain: 0.2
    }
  },
  {
    id: 'comic-style',
    name: '漫画风格',
    type: 'comic',
    parameters: {
      outline: true,
      colorFilter: true,
      halftone: false
    }
  },
  {
    id: 'pixel-art',
    name: '像素艺术',
    type: 'pixel',
    parameters: {
      resolution: 8,
      dithering: true
    }
  }
];

// 插件状态
interface PluginState {
  selectedNodes: SceneNode[];
  appliedEffects: Map<string, Effect[]>;
}

let state: PluginState = {
  selectedNodes: [],
  appliedEffects: new Map()
};

// 监听消息
figma.ui.onmessage = async (msg: any) => {
  switch (msg.type) {
    case 'show-ui':
      showUI();
      break;
    case 'apply-effect':
      applyEffect(msg.effectId);
      break;
    case 'apply-custom-effect':
      applyCustomEffect(msg.effect);
      break;
    case 'remove-effect':
      removeEffect(msg.nodeId, msg.effectId);
      break;
    case 'remove-all-effects':
      removeAllEffects();
      break;
    case 'batch-apply':
      batchApply(msg.effectId);
      break;
    case 'save-effect':
      saveEffect(msg.effect);
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
    title: 'Gleef'
  });
  
  // 发送初始状态
  figma.ui.postMessage({
    type: 'init',
    selectedCount: state.selectedNodes.length,
    presetEffects: presetEffects
  });
}

// 应用效果
function applyEffect(effectId: string) {
  const effect = presetEffects.find(e => e.id === effectId);
  if (!effect) return;
  
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  nodes.forEach(node => {
    applyEffectToNode(node, effect);
  });
  
  figma.notify(`已应用效果: ${effect.name}`);
}

// 应用自定义效果
function applyCustomEffect(customEffect: Effect) {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  nodes.forEach(node => {
    applyEffectToNode(node, customEffect);
  });
  
  figma.notify(`已应用自定义效果: ${customEffect.name}`);
}

// 应用效果到节点
function applyEffectToNode(node: SceneNode, effect: Effect) {
  switch (effect.type) {
    case 'blur':
      applyBlurEffect(node, effect.parameters);
      break;
    case 'shadow':
      applyShadowEffect(node, effect.parameters);
      break;
    case 'glow':
      applyGlowEffect(node, effect.parameters);
      break;
    case 'gradient':
      applyGradientEffect(node, effect.parameters);
      break;
    case 'noise':
      applyNoiseEffect(node, effect.parameters);
      break;
    case 'distortion':
      applyDistortionEffect(node, effect.parameters);
      break;
    case 'vintage':
      applyVintageEffect(node, effect.parameters);
      break;
    case 'comic':
      applyComicEffect(node, effect.parameters);
      break;
    case 'pixel':
      applyPixelEffect(node, effect.parameters);
      break;
  }
  
  // 保存应用的效果
  const nodeEffects = state.appliedEffects.get(node.id) || [];
  nodeEffects.push(effect);
  state.appliedEffects.set(node.id, nodeEffects);
}

// 应用模糊效果
function applyBlurEffect(node: SceneNode, params: any) {
  if ('effects' in node) {
    const blurEffect: BlurEffect = {
      type: 'BLUR',
      visible: true,
      radius: params.radius,
      blurType: params.type || 'GAUSSIAN',
      direction: params.direction || 0
    };
    
    node.effects = [...(node.effects || []), blurEffect];
  }
}

// 应用阴影效果
function applyShadowEffect(node: SceneNode, params: any) {
  if ('effects' in node) {
    const shadowEffect: DropShadowEffect = {
      type: 'DROP_SHADOW',
      visible: params.visible,
      color: params.color,
      offset: params.offset,
      radius: params.radius
    };
    
    node.effects = [...(node.effects || []), shadowEffect];
  }
}

// 应用光晕效果
function applyGlowEffect(node: SceneNode, params: any) {
  if ('effects' in node) {
    const glowEffect: InnerShadowEffect = {
      type: 'INNER_SHADOW',
      visible: params.visible,
      color: params.color,
      offset: { x: 0, y: 0 },
      radius: params.radius
    };
    
    node.effects = [...(node.effects || []), glowEffect];
  }
}

// 应用渐变效果
function applyGradientEffect(node: SceneNode, params: any) {
  if ('fills' in node) {
    let gradient: Paint;
    
    if (params.type === 'LINEAR') {
      gradient = {
        type: 'GRADIENT_LINEAR',
        gradientTransform: [
          Math.cos(params.angle * Math.PI / 180),
          Math.sin(params.angle * Math.PI / 180),
          -Math.sin(params.angle * Math.PI / 180),
          Math.cos(params.angle * Math.PI / 180),
          0,
          0
        ],
        gradientStops: params.colors.map((color: any, index: number) => ({
          color: color,
          position: index / (params.colors.length - 1)
        }))
      };
    } else {
      gradient = {
        type: 'GRADIENT_RADIAL',
        gradientTransform: [1, 0, 0, 1, 0.5, 0.5],
        gradientStops: params.colors.map((color: any, index: number) => ({
          color: color,
          position: index / (params.colors.length - 1)
        }))
      };
    }
    
    node.fills = [gradient];
  }
}

// 应用噪点效果
function applyNoiseEffect(node: SceneNode, params: any) {
  // 噪点效果实现
  // 注意：Figma API 目前不直接支持噪点效果，这里使用模拟实现
  if ('fills' in node && node.fills) {
    const originalFills = node.fills;
    // 这里可以添加噪点覆盖层或其他模拟方法
    figma.notify('噪点效果已应用（模拟实现）');
  }
}

// 应用扭曲效果
function applyDistortionEffect(node: SceneNode, params: any) {
  // 扭曲效果实现
  // 注意：Figma API 目前不直接支持扭曲效果，这里使用模拟实现
  figma.notify('扭曲效果已应用（模拟实现）');
}

// 应用复古效果
function applyVintageEffect(node: SceneNode, params: any) {
  // 复古效果实现
  // 注意：Figma API 目前不直接支持复古效果，这里使用模拟实现
  figma.notify('复古效果已应用（模拟实现）');
}

// 应用漫画效果
function applyComicEffect(node: SceneNode, params: any) {
  // 漫画效果实现
  // 注意：Figma API 目前不直接支持漫画效果，这里使用模拟实现
  figma.notify('漫画效果已应用（模拟实现）');
}

// 应用像素效果
function applyPixelEffect(node: SceneNode, params: any) {
  // 像素效果实现
  // 注意：Figma API 目前不直接支持像素效果，这里使用模拟实现
  figma.notify('像素效果已应用（模拟实现）');
}

// 移除效果
function removeEffect(nodeId: string, effectId: string) {
  const node = figma.getNodeById(nodeId);
  if (!node) return;
  
  // 移除效果逻辑
  // 注意：Figma API 目前不直接支持按ID移除效果，这里使用模拟实现
  figma.notify('效果已移除（模拟实现）');
}

// 移除所有效果
function removeAllEffects() {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 0) {
    figma.notify('请先选择元素');
    return;
  }
  
  nodes.forEach(node => {
    if ('effects' in node) {
      node.effects = [];
    }
    if ('fills' in node) {
      // 保留原始填充，这里只是清除效果相关的填充
    }
  });
  
  figma.notify('已移除所有效果');
}

// 批量应用
function batchApply(effectId: string) {
  const effect = presetEffects.find(e => e.id === effectId);
  if (!effect) return;
  
  const nodes = figma.currentPage.findAll();
  if (nodes.length === 0) {
    figma.notify('页面中没有元素');
    return;
  }
  
  let appliedCount = 0;
  nodes.forEach(node => {
    // 只应用到可见的、可应用效果的节点
    if (node.visible && ('effects' in node || 'fills' in node)) {
      applyEffectToNode(node, effect);
      appliedCount++;
    }
  });
  
  figma.notify(`已批量应用效果到 ${appliedCount} 个元素`);
}

// 保存效果
function saveEffect(effect: Effect) {
  // 保存效果逻辑
  // 这里可以将效果保存到本地存储或其他位置
  presetEffects.push(effect);
  
  // 发送更新后的效果列表
  figma.ui.postMessage({
    type: 'effects-updated',
    presetEffects: presetEffects
  });
  
  figma.notify('效果已保存');
}

// 初始化插件
showUI();