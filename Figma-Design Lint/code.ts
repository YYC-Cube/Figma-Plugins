figma.showUI(__html__, { width: 480, height: 600 });

interface LintIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  description: string;
  nodeId: string;
  nodeName: string;
  location: { x: number; y: number };
}

interface LintResult {
  issues: LintIssue[];
  summary: {
    errors: number;
    warnings: number;
    infos: number;
  };
  stats: {
    totalNodes: number;
    checkedNodes: number;
    fixedIssues: number;
  };
}

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'close':
      figma.closePlugin();
      break;
    
    case 'run-lint':
      await runLint();
      break;
    
    case 'run-lint-selection':
      await runLintOnSelection();
      break;
    
    case 'fix-issue':
      await fixIssue(msg.data.issueId);
      break;
    
    case 'fix-all':
      await fixAllIssues();
      break;
    
    case 'ignore-issue':
      await ignoreIssue(msg.data.issueId);
      break;
    
    case 'clear-issues':
      clearIssues();
      break;
  }
};

let currentIssues: LintIssue[] = [];

async function runLint() {
  const issues: LintIssue[] = [];
  const nodes = figma.currentPage.children;
  const totalNodes = countNodes(nodes);
  
  figma.notify('Running design lint...');
  
  await lintNodes(nodes, issues);
  
  const result = formatLintResult(issues, totalNodes);
  currentIssues = issues;
  
  figma.ui.postMessage({ type: 'lint-complete', data: result });
  figma.notify(`Lint completed with ${result.summary.errors} errors, ${result.summary.warnings} warnings, and ${result.summary.infos} infos`);
}

async function runLintOnSelection() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.notify('Please select some elements first');
    return;
  }
  
  const issues: LintIssue[] = [];
  const totalNodes = countNodes(selection);
  
  figma.notify('Running design lint on selection...');
  
  await lintNodes(selection, issues);
  
  const result = formatLintResult(issues, totalNodes);
  currentIssues = issues;
  
  figma.ui.postMessage({ type: 'lint-complete', data: result });
  figma.notify(`Lint completed with ${result.summary.errors} errors, ${result.summary.warnings} warnings, and ${result.summary.infos} infos`);
}

async function lintNodes(nodes: SceneNode[], issues: LintIssue[]) {
  for (const node of nodes) {
    await lintNode(node, issues);
    
    if ('children' in node) {
      await lintNodes(node.children, issues);
    }
  }
}

async function lintNode(node: SceneNode, issues: LintIssue[]) {
  // 检查命名规范
  if (node.name) {
    await lintNaming(node, issues);
  }
  
  // 检查颜色一致性
  if ('fills' in node && node.fills) {
    await lintColors(node, issues);
  }
  
  // 检查文本样式
  if (node.type === 'TEXT') {
    await lintText(node, issues);
  }
  
  // 检查间距和对齐
  await lintSpacing(node, issues);
  
  // 检查组件使用
  if (node.type === 'INSTANCE' || node.type === 'COMPONENT') {
    await lintComponents(node, issues);
  }
}

async function lintNaming(node: SceneNode, issues: LintIssue[]) {
  const name = node.name || '';
  
  // 检查空名称
  if (!name) {
    issues.push({
      id: `naming-empty-${node.id}`,
      severity: 'warning',
      category: 'naming',
      message: 'Empty layer name',
      description: 'Layer has no name',
      nodeId: node.id,
      nodeName: name,
      location: { x: node.x, y: node.y }
    });
  }
  
  // 检查默认名称
  const defaultNames = ['Rectangle', 'Ellipse', 'Line', 'Text', 'Frame', 'Group'];
  if (defaultNames.includes(name)) {
    issues.push({
      id: `naming-default-${node.id}`,
      severity: 'info',
      category: 'naming',
      message: 'Default layer name',
      description: 'Layer uses default name, consider giving it a meaningful name',
      nodeId: node.id,
      nodeName: name,
      location: { x: node.x, y: node.y }
    });
  }
}

async function lintColors(node: SceneNode & { fills: Paint[] }, issues: LintIssue[]) {
  if (!('fills' in node) || !node.fills) return;
  
  for (const fill of node.fills) {
    if (fill.type === 'SOLID') {
      const color = fill.color;
      // 检查颜色是否接近但不完全匹配
      // 这里简化处理，实际应该与设计系统中的颜色对比
      if (color.r < 0.01 || color.g < 0.01 || color.b < 0.01) {
        issues.push({
          id: `color-black-${node.id}`,
          severity: 'info',
          category: 'color',
          message: 'Near-black color',
          description: 'Color is very close to black, consider using exact black',
          nodeId: node.id,
          nodeName: node.name || '',
          location: { x: node.x, y: node.y }
        });
      }
    }
  }
}

async function lintText(node: TextNode, issues: LintIssue[]) {
  // 检查字体大小
  if (node.fontSize < 10) {
    issues.push({
      id: `text-small-${node.id}`,
      severity: 'warning',
      category: 'text',
      message: 'Small font size',
      description: 'Font size is below 10px, may be hard to read',
      nodeId: node.id,
      nodeName: node.name || '',
      location: { x: node.x, y: node.y }
    });
  }
  
  // 检查文本对齐
  if (node.textAlignHorizontal === 'LEFT' && node.textAlignVertical === 'TOP') {
    // 默认对齐，没问题
  } else {
    issues.push({
      id: `text-alignment-${node.id}`,
      severity: 'info',
      category: 'text',
      message: 'Non-standard text alignment',
      description: 'Text uses non-default alignment',
      nodeId: node.id,
      nodeName: node.name || '',
      location: { x: node.x, y: node.y }
    });
  }
}

async function lintSpacing(node: SceneNode, issues: LintIssue[]) {
  // 检查位置是否对齐到网格
  const gridSize = 8;
  const xAligned = Math.abs(node.x % gridSize) < 0.1;
  const yAligned = Math.abs(node.y % gridSize) < 0.1;
  
  if (!xAligned || !yAligned) {
    issues.push({
      id: `spacing-grid-${node.id}`,
      severity: 'warning',
      category: 'spacing',
      message: 'Not aligned to grid',
      description: 'Element is not aligned to 8px grid',
      nodeId: node.id,
      nodeName: node.name || '',
      location: { x: node.x, y: node.y }
    });
  }
}

async function lintComponents(node: ComponentNode | InstanceNode, issues: LintIssue[]) {
  // 检查组件命名
  if (node.name && !node.name.startsWith('Component/')) {
    issues.push({
      id: `component-naming-${node.id}`,
      severity: 'info',
      category: 'component',
      message: 'Component naming convention',
      description: 'Consider using Component/ prefix for component names',
      nodeId: node.id,
      nodeName: node.name || '',
      location: { x: node.x, y: node.y }
    });
  }
}

async function fixIssue(issueId: string) {
  const issue = currentIssues.find(i => i.id === issueId);
  if (!issue) return;
  
  const node = figma.getNodeById(issue.nodeId);
  if (!node) return;
  
  switch (issue.category) {
    case 'naming':
      if (issue.message === 'Empty layer name') {
        node.name = `Layer ${issue.nodeId.substring(0, 6)}`;
      }
      break;
    
    case 'spacing':
      if (issue.message === 'Not aligned to grid') {
        const gridSize = 8;
        node.x = Math.round(node.x / gridSize) * gridSize;
        node.y = Math.round(node.y / gridSize) * gridSize;
      }
      break;
  }
  
  figma.notify(`Fixed issue: ${issue.message}`);
  figma.ui.postMessage({ type: 'issue-fixed', data: { issueId } });
}

async function fixAllIssues() {
  let fixedCount = 0;
  
  for (const issue of currentIssues) {
    if (issue.severity === 'error' || issue.severity === 'warning') {
      await fixIssue(issue.id);
      fixedCount++;
    }
  }
  
  figma.notify(`Fixed ${fixedCount} issues`);
  figma.ui.postMessage({ type: 'all-issues-fixed', data: { count: fixedCount } });
}

async function ignoreIssue(issueId: string) {
  figma.ui.postMessage({ type: 'issue-ignored', data: { issueId } });
}

function clearIssues() {
  currentIssues = [];
  figma.ui.postMessage({ type: 'issues-cleared' });
}

function countNodes(nodes: SceneNode[]): number {
  let count = 0;
  
  function traverse(node: SceneNode) {
    count++;
    if ('children' in node) {
      node.children.forEach(traverse);
    }
  }
  
  nodes.forEach(traverse);
  return count;
}

function formatLintResult(issues: LintIssue[], totalNodes: number): LintResult {
  const summary = {
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    infos: issues.filter(i => i.severity === 'info').length
  };
  
  return {
    issues,
    summary,
    stats: {
      totalNodes,
      checkedNodes: totalNodes,
      fixedIssues: 0
    }
  };
}

// 监听选择变化
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  figma.ui.postMessage({
    type: 'selection-changed',
    data: {
      count: selection.length
    }
  });
});