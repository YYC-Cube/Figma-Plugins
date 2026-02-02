// Figma Figmotion Plugin
// 为Figma添加动画效果的插件

// 插件状态
let state = {
  animations: [],
  selectedNode: null,
  isPreviewing: false,
  currentTime: 0
};

// 监听消息
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'show-ui':
      showUI();
      break;
    case 'create-animation':
      createAnimation(msg.animation);
      break;
    case 'update-animation':
      updateAnimation(msg.animationId, msg.animation);
      break;
    case 'delete-animation':
      deleteAnimation(msg.animationId);
      break;
    case 'preview-animation':
      previewAnimation(msg.animationId);
      break;
    case 'stop-preview':
      stopPreview();
      break;
    case 'apply-animation':
      applyAnimation(msg.animationId);
      break;
    case 'batch-apply':
      batchApply(msg.animationTemplate, msg.nodes);
      break;
    case 'export-animation':
      exportAnimation(msg.animationId, msg.format);
      break;
    case 'close':
      figma.closePlugin();
      break;
  }
};

// 显示UI
function showUI() {
  state.selectedNode = figma.currentPage.selection[0] || null;
  
  figma.showUI(__html__, {
    width: 500,
    height: 600,
    title: 'Figmotion'
  });
  
  // 发送初始状态
  figma.ui.postMessage({
    type: 'init',
    selectedNode: state.selectedNode ? {
      id: state.selectedNode.id,
      name: state.selectedNode.name,
      type: state.selectedNode.type
    } : null,
    animations: state.animations
  });
}

// 创建动画
function createAnimation(animationData) {
  const animation = {
    id: `anim-${Date.now()}`,
    name: animationData.name,
    type: animationData.type,
    duration: animationData.duration,
    delay: animationData.delay,
    easing: animationData.easing,
    repeat: animationData.repeat,
    keyframes: animationData.keyframes,
    nodeId: animationData.nodeId
  };
  
  state.animations.push(animation);
  
  // 发送更新后的动画列表
  figma.ui.postMessage({
    type: 'animations-updated',
    animations: state.animations
  });
  
  figma.notify('动画创建成功');
}

// 更新动画
function updateAnimation(animationId, animationData) {
  const index = state.animations.findIndex(anim => anim.id === animationId);
  if (index !== -1) {
    state.animations[index] = {
      ...state.animations[index],
      ...animationData
    };
    
    // 发送更新后的动画列表
    figma.ui.postMessage({
      type: 'animations-updated',
      animations: state.animations
    });
    
    figma.notify('动画更新成功');
  }
}

// 删除动画
function deleteAnimation(animationId) {
  state.animations = state.animations.filter(anim => anim.id !== animationId);
  
  // 发送更新后的动画列表
  figma.ui.postMessage({
    type: 'animations-updated',
    animations: state.animations
  });
  
  figma.notify('动画删除成功');
}

// 预览动画
async function previewAnimation(animationId) {
  const animation = state.animations.find(anim => anim.id === animationId);
  if (!animation) return;
  
  const node = figma.getNodeById(animation.nodeId);
  if (!node) return;
  
  state.isPreviewing = true;
  state.currentTime = 0;
  
  // 保存原始状态
  const originalState = {
    opacity: 'opacity' in node ? node.opacity : 1,
    x: 'x' in node ? node.x : 0,
    y: 'y' in node ? node.y : 0,
    scaleX: 'scaleX' in node ? node.scaleX : 1,
    scaleY: 'scaleY' in node ? node.scaleY : 1,
    rotation: 'rotation' in node ? node.rotation : 0
  };
  
  // 计算总持续时间
  const totalDuration = animation.duration + animation.delay;
  const startTime = Date.now() / 1000;
  
  // 动画循环
  async function animate() {
    if (!state.isPreviewing) {
      // 恢复原始状态
      restoreState(node, originalState);
      return;
    }
    
    const currentTime = (Date.now() / 1000) - startTime;
    
    if (currentTime < animation.delay) {
      // 延迟阶段
      requestAnimationFrame(animate);
      return;
    }
    
    const animationTime = currentTime - animation.delay;
    
    if (animationTime >= animation.duration) {
      // 动画结束
      state.isPreviewing = false;
      restoreState(node, originalState);
      figma.notify('动画预览完成');
      return;
    }
    
    // 计算当前状态
    const progress = animationTime / animation.duration;
    const easedProgress = applyEasing(progress, animation.easing);
    
    // 应用关键帧
    applyKeyframes(node, animation.keyframes, easedProgress);
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// 停止预览
function stopPreview() {
  state.isPreviewing = false;
  figma.notify('动画预览已停止');
}

// 应用动画
function applyAnimation(animationId) {
  const animation = state.animations.find(anim => anim.id === animationId);
  if (!animation) return;
  
  const node = figma.getNodeById(animation.nodeId);
  if (!node) return;
  
  // 这里可以实现将动画导出为CSS、SVG或其他格式
  // 或者为节点添加动画相关的注释或属性
  
  node.setPluginData('figmotion-animation', JSON.stringify(animation));
  
  figma.notify('动画已应用到节点');
}

// 批量应用动画
function batchApply(animationTemplate, nodeIds) {
  nodeIds.forEach((nodeId, index) => {
    const node = figma.getNodeById(nodeId);
    if (node) {
      const animation = {
        id: `anim-${Date.now()}-${index}`,
        name: `${animationTemplate.name}-${index}`,
        type: animationTemplate.type,
        duration: animationTemplate.duration,
        delay: animationTemplate.delay + (index * 0.1), // 添加错开延迟
        easing: animationTemplate.easing,
        repeat: animationTemplate.repeat,
        keyframes: animationTemplate.keyframes,
        nodeId: nodeId
      };
      
      state.animations.push(animation);
      node.setPluginData('figmotion-animation', JSON.stringify(animation));
    }
  });
  
  // 发送更新后的动画列表
  figma.ui.postMessage({
    type: 'animations-updated',
    animations: state.animations
  });
  
  figma.notify(`已批量应用动画到 ${nodeIds.length} 个节点`);
}

// 导出动画
function exportAnimation(animationId, format) {
  const animation = state.animations.find(anim => anim.id === animationId);
  if (!animation) return;
  
  let exportData;
  
  switch (format) {
    case 'css':
      exportData = generateCSSAnimation(animation);
      break;
    case 'json':
      exportData = JSON.stringify(animation, null, 2);
      break;
    case 'svg':
      exportData = generateSVGAnimation(animation);
      break;
    default:
      exportData = JSON.stringify(animation, null, 2);
  }
  
  // 发送导出数据
  figma.ui.postMessage({
    type: 'export-data',
    data: exportData,
    format: format
  });
  
  figma.notify('动画导出成功');
}

// 应用缓动函数
function applyEasing(progress, easing) {
  switch (easing) {
    case 'linear':
      return progress;
    case 'ease-in':
      return progress * progress;
    case 'ease-out':
      return 1 - Math.pow(1 - progress, 2);
    case 'ease-in-out':
      return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    case 'bounce':
      if (progress < 1 / 2.75) {
        return 7.5625 * progress * progress;
      } else if (progress < 2 / 2.75) {
        return 7.5625 * (progress -= 1.5 / 2.75) * progress + 0.75;
      } else if (progress < 2.5 / 2.75) {
        return 7.5625 * (progress -= 2.25 / 2.75) * progress + 0.9375;
      } else {
        return 7.5625 * (progress -= 2.625 / 2.75) * progress + 0.984375;
      }
    case 'elastic':
      return Math.pow(2, -10 * progress) * Math.sin((progress - 0.1) * (2 * Math.PI) / 0.4) + 1;
    default:
      return progress;
  }
}

// 应用关键帧
function applyKeyframes(node, keyframes, progress) {
  // 找到当前进度对应的关键帧范围
  let startKeyframe = null;
  let endKeyframe = null;
  
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].time && progress <= keyframes[i + 1].time) {
      startKeyframe = keyframes[i];
      endKeyframe = keyframes[i + 1];
      break;
    }
  }
  
  if (!startKeyframe || !endKeyframe) {
    // 使用第一个或最后一个关键帧
    const targetKeyframe = progress <= 0.5 ? keyframes[0] : keyframes[keyframes.length - 1];
    applyProperties(node, targetKeyframe.properties);
    return;
  }
  
  // 计算两个关键帧之间的插值进度
  const keyframeProgress = (progress - startKeyframe.time) / (endKeyframe.time - startKeyframe.time);
  
  // 插值计算
  const interpolatedProperties = {};
  
  Object.keys(endKeyframe.properties).forEach(prop => {
    const startValue = startKeyframe.properties[prop] || 0;
    const endValue = endKeyframe.properties[prop] || 0;
    interpolatedProperties[prop] = startValue + (endValue - startValue) * keyframeProgress;
  });
  
  // 应用属性
  applyProperties(node, interpolatedProperties);
}

// 应用属性
function applyProperties(node, properties) {
  if ('opacity' in properties && 'opacity' in node) {
    node.opacity = properties.opacity;
  }
  if ('x' in properties && 'x' in node) {
    node.x = properties.x;
  }
  if ('y' in properties && 'y' in node) {
    node.y = properties.y;
  }
  if ('scaleX' in properties && 'scaleX' in node) {
    node.scaleX = properties.scaleX;
  }
  if ('scaleY' in properties && 'scaleY' in node) {
    node.scaleY = properties.scaleY;
  }
  if ('rotation' in properties && 'rotation' in node) {
    node.rotation = properties.rotation;
  }
}

// 恢复状态
function restoreState(node, originalState) {
  if ('opacity' in originalState && 'opacity' in node) {
    node.opacity = originalState.opacity;
  }
  if ('x' in originalState && 'x' in node) {
    node.x = originalState.x;
  }
  if ('y' in originalState && 'y' in node) {
    node.y = originalState.y;
  }
  if ('scaleX' in originalState && 'scaleX' in node) {
    node.scaleX = originalState.scaleX;
  }
  if ('scaleY' in originalState && 'scaleY' in node) {
    node.scaleY = originalState.scaleY;
  }
  if ('rotation' in originalState && 'rotation' in node) {
    node.rotation = originalState.rotation;
  }
}

// 生成CSS动画
function generateCSSAnimation(animation) {
  // 生成关键帧
  const keyframes = animation.keyframes.map(keyframe => {
    const percentage = Math.round(keyframe.time * 100);
    const properties = Object.entries(keyframe.properties)
      .map(([prop, value]) => {
        switch (prop) {
          case 'opacity':
            return `opacity: ${value};`;
          case 'x':
            return `transform: translateX(${value}px);`;
          case 'y':
            return `transform: translateY(${value}px);`;
          case 'scaleX':
          case 'scaleY':
            return `transform: scale(${value});`;
          case 'rotation':
            return `transform: rotate(${value}deg);`;
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join('\n  ');
    
    return `${percentage}% {\n  ${properties}\n}`;
  }).join('\n');
  
  // 生成动画属性
  const animationProperties = [
    `animation-name: ${animation.name.replace(/\s+/g, '-').toLowerCase()};`,
    `animation-duration: ${animation.duration}s;`,
    `animation-delay: ${animation.delay}s;`,
    `animation-timing-function: ${animation.easing};`,
    `animation-iteration-count: ${animation.repeat === -1 ? 'infinite' : animation.repeat};`,
    `animation-fill-mode: both;`
  ].join('\n');
  
  return `/* CSS Animation: ${animation.name} */\n@-webkit-keyframes ${animation.name.replace(/\s+/g, '-').toLowerCase()} {\n${keyframes}\n}\n\n@keyframes ${animation.name.replace(/\s+/g, '-').toLowerCase()} {\n${keyframes}\n}\n\n.animated-element {\n${animationProperties}\n}`;
}

// 生成SVG动画
function generateSVGAnimation(animation) {
  // 简化的SVG动画生成
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n  <rect width="100" height="100" fill="none" stroke="none"/>\n  <!-- Animation: ${animation.name} -->\n  <!-- Duration: ${animation.duration}s -->\n  <!-- Delay: ${animation.delay}s -->\n  <!-- Easing: ${animation.easing} -->\n  <!-- Repeat: ${animation.repeat === -1 ? 'infinite' : animation.repeat} -->\n</svg>`;
}

// 初始化插件
showUI();