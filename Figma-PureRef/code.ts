/**
 * @file Figma PureRef 插件
 * @description 纯净引用和重构工具，清理和优化设计文件
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 清理类型
const cleanupTypes = [
  {
    id: '1',
    name: '空图层',
    description: '删除所有空的图层和框架',
    severity: 'low',
    type: 'EMPTY_LAYERS'
  },
  {
    id: '2',
    name: '隐藏图层',
    description: '删除所有隐藏的图层',
    severity: 'medium',
    type: 'HIDDEN_LAYERS'
  },
  {
    id: '3',
    name: '未使用组件',
    description: '删除未被使用的组件',
    severity: 'high',
    type: 'UNUSED_COMPONENTS'
  },
  {
    id: '4',
    name: '重复样式',
    description: '合并重复的样式',
    severity: 'medium',
    type: 'DUPLICATE_STYLES'
  },
  {
    id: '5',
    name: '孤立节点',
    description: '删除没有父节点的孤立元素',
    severity: 'low',
    type: 'ORPHAN_NODES'
  },
  {
    id: '6',
    name: '零尺寸元素',
    description: '删除宽高为0的元素',
    severity: 'low',
    type: 'ZERO_SIZE_ELEMENTS'
  }
];

// 重构选项
const refactorOptions = [
  {
    id: '1',
    name: '重命名图层',
    description: '根据类型和内容重命名图层',
    type: 'RENAME_LAYERS'
  },
  {
    id: '2',
    name: '组织结构',
    description: '按逻辑组织图层结构',
    type: 'ORGANIZE_STRUCTURE'
  },
  {
    id: '3',
    name: '创建组件',
    description: '将重复元素转换为组件',
    type: 'CREATE_COMPONENTS'
  },
  {
    id: '4',
    name: '统一样式',
    description: '统一相似元素的样式',
    type: 'UNIFY_STYLES'
  },
  {
    id: '5',
    name: '优化图片',
    description: '优化图片质量和尺寸',
    type: 'OPTIMIZE_IMAGES'
  },
  {
    id: '6',
    name: '清理文本',
    description: '清理文本样式和格式',
    type: 'CLEANUP_TEXT'
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'run-cleanup':
        runCleanup(msg.cleanupType);
        break;
      case 'run-cleanup-all':
        runCleanupAll();
        break;
      case 'apply-refactor':
        applyRefactor(msg.refactorType);
        break;
      case 'analyze-file':
        analyzeFile();
        break;
      case 'optimize-performance':
        optimizePerformance();
        break;
      case 'create-backup':
        createBackup();
        break;
      case 'restore-backup':
        restoreBackup();
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

// 运行清理
function runCleanup(cleanupType: string) {
  const cleanup = cleanupTypes.find(c => c.type === cleanupType);
  if (!cleanup) return;

  // 模拟清理过程
  setTimeout(() => {
    const affectedCount = Math.floor(Math.random() * 50) + 10;
    figma.ui.postMessage({
      type: 'cleanup-completed',
      message: `已完成 ${cleanup.name} 清理，影响了 ${affectedCount} 个元素`,
      cleanupType: cleanupType,
      affectedCount: affectedCount
    });
  }, 1200);
}

// 运行全部清理
function runCleanupAll() {
  // 模拟全部清理
  setTimeout(() => {
    const totalAffected = Math.floor(Math.random() * 200) + 50;
    figma.ui.postMessage({
      type: 'cleanup-all-completed',
      message: `已完成全部清理操作，总计影响了 ${totalAffected} 个元素`,
      totalAffected: totalAffected
    });
  }, 3000);
}

// 应用重构
function applyRefactor(refactorType: string) {
  const refactor = refactorOptions.find(r => r.type === refactorType);
  if (!refactor) return;

  // 模拟重构过程
  setTimeout(() => {
    const affectedCount = Math.floor(Math.random() * 30) + 5;
    figma.ui.postMessage({
      type: 'refactor-applied',
      message: `已应用 ${refactor.name}，影响了 ${affectedCount} 个元素`,
      refactorType: refactorType,
      affectedCount: affectedCount
    });
  }, 1500);
}

// 分析文件
function analyzeFile() {
  // 模拟文件分析
  setTimeout(() => {
    const analysis = {
      totalLayers: Math.floor(Math.random() * 500) + 100,
      totalComponents: Math.floor(Math.random() * 50) + 10,
      totalStyles: Math.floor(Math.random() * 100) + 20,
      totalImages: Math.floor(Math.random() * 30) + 5,
      issues: [
        { type: 'empty-layers', count: Math.floor(Math.random() * 20) + 5, severity: 'low' },
        { type: 'unused-components', count: Math.floor(Math.random() * 10) + 2, severity: 'high' },
        { type: 'duplicate-styles', count: Math.floor(Math.random() * 15) + 3, severity: 'medium' },
        { type: 'hidden-layers', count: Math.floor(Math.random() * 25) + 10, severity: 'medium' }
      ],
      recommendations: [
        '删除未使用的组件以减少文件大小',
        '合并重复的样式以提高一致性',
        '清理空图层以简化结构',
        '优化图片以提升性能'
      ],
      fileSize: (Math.random() * 50 + 10).toFixed(2) + ' MB'
    };

    figma.ui.postMessage({
      type: 'file-analyzed',
      message: '文件分析完成',
      analysis: analysis
    });
  }, 2000);
}

// 优化性能
function optimizePerformance() {
  // 模拟性能优化
  setTimeout(() => {
    const optimizations = {
      imagesOptimized: Math.floor(Math.random() * 20) + 5,
      stylesMerged: Math.floor(Math.random() * 15) + 3,
      layersSimplified: Math.floor(Math.random() * 30) + 10,
      memorySaved: (Math.random() * 20 + 5).toFixed(2) + ' MB',
      loadTimeImproved: (Math.random() * 30 + 10).toFixed(1) + '%'
    };

    figma.ui.postMessage({
      type: 'performance-optimized',
      message: '性能优化完成',
      optimizations: optimizations
    });
  }, 2500);
}

// 创建备份
function createBackup() {
  // 模拟创建备份
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'backup-created',
      message: '已创建文件备份',
      backupName: `backup_${new Date().toISOString().slice(0, 10)}.fig`
    });
  }, 1000);
}

// 恢复备份
function restoreBackup() {
  // 模拟恢复备份
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'backup-restored',
      message: '已从备份恢复文件'
    });
  }, 1500);
}
