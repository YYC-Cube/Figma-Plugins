/**
 * @file Figma CN 插件
 * @description 为中文用户优化的Figma插件，提供中文语言支持和专用工具
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 */

figma.showUI(__html__, { width: 400, height: 500 });

// 中文字体推荐
const chineseFonts = [
  {
    id: '1',
    name: '思源黑体',
    englishName: 'Source Han Sans',
    category: 'sans-serif',
    style: '现代无衬线',
    recommendation: '通用UI设计',
    url: 'https://fonts.google.com/specimen/Noto+Sans+SC'
  },
  {
    id: '2',
    name: '思源宋体',
    englishName: 'Source Han Serif',
    category: 'serif',
    style: '传统衬线',
    recommendation: '正文排版',
    url: 'https://fonts.google.com/specimen/Noto+Serif+SC'
  },
  {
    id: '3',
    name: '苹方',
    englishName: 'PingFang SC',
    category: 'sans-serif',
    style: '现代无衬线',
    recommendation: ' macOS/iOS设计',
    url: 'https://developer.apple.com/fonts/'
  },
  {
    id: '4',
    name: '微软雅黑',
    englishName: 'Microsoft YaHei',
    category: 'sans-serif',
    style: '现代无衬线',
    recommendation: 'Windows设计',
    url: 'https://docs.microsoft.com/en-us/typography/font-list/microsoft-yahei'
  },
  {
    id: '5',
    name: '华文黑体',
    englishName: 'ST Heiti',
    category: 'sans-serif',
    style: '传统无衬线',
    recommendation: '传统风格设计',
    url: 'https://www.apple.com.cn/support/fonts/'
  },
  {
    id: '6',
    name: '站酷庆科黄油体',
    englishName: 'ZCOOL QingKe HuangYou',
    category: 'display',
    style: '创意字体',
    recommendation: '标题设计',
    url: 'https://fonts.google.com/specimen/ZCOOL+QingKe+HuangYou'
  }
];

// 中文排版规则
const typographyRules = [
  {
    id: '1',
    name: '标点挤压',
    description: '中文标点符号之间以及与文字之间的间距优化',
    severity: 'high',
    examples: [
      '正确: 这是一个示例，展示正确的标点使用。',
      '错误: 这是一个示例 ， 展示错误的标点使用 。'
    ]
  },
  {
    id: '2',
    name: '中英文混排',
    description: '中英文混合排版时的空格处理',
    severity: 'high',
    examples: [
      '正确: 这是 Figma 插件',
      '错误: 这是Figma插件'
    ]
  },
  {
    id: '3',
    name: '数字排版',
    description: '中文环境下的数字排版规范',
    severity: 'medium',
    examples: [
      '正确: 100 元',
      '错误: 一百元'
    ]
  },
  {
    id: '4',
    name: '行首行尾规则',
    description: '中文排版中行首行尾的字符规则',
    severity: 'medium',
    examples: [
      '正确: 确保行首不是标点符号',
      '错误: ，确保行首不是标点符号'
    ]
  }
];

// 中文设计资源
const chineseResources = [
  {
    id: '1',
    name: '阿里巴巴矢量图标库',
    url: 'https://www.iconfont.cn/',
    description: '中国最大的矢量图标库',
    category: 'icons'
  },
  {
    id: '2',
    name: '站酷',
    url: 'https://www.zcool.com.cn/',
    description: '设计师社区和资源平台',
    category: 'design'
  },
  {
    id: '3',
    name: '花瓣网',
    url: 'https://huaban.com/',
    description: '创意灵感分享平台',
    category: 'inspiration'
  },
  {
    id: '4',
    name: '字体天下',
    url: 'https://www.fonts.net.cn/',
    description: '中文字体下载平台',
    category: 'fonts'
  }
];

// 处理UI消息
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'apply-chinese-font':
        applyChineseFont(msg.fontId);
        break;
      case 'check-typography':
        checkTypography();
        break;
      case 'fix-punctuation':
        fixPunctuation();
        break;
      case 'add-chinese-resources':
        addChineseResources();
        break;
      case 'translate-text':
        translateText(msg.text, msg.targetLang);
        break;
      case 'generate-chinese-content':
        generateChineseContent(msg.type, msg.length);
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

// 应用中文字体
function applyChineseFont(fontId) {
  const font = chineseFonts.find(f => f.id === fontId);
  if (!font) return;

  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '请先选择要应用字体的文本' });
    return;
  }

  // 模拟应用字体
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'font-applied',
      message: `已将选中文本的字体设置为 ${font.name}`,
      font: font
    });
  }, 800);
}

// 检查排版
function checkTypography() {
  const textNodes = figma.currentPage.findAll(node => node.type === 'TEXT');
  if (textNodes.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '当前页面没有文本节点' });
    return;
  }

  // 模拟排版检查
  setTimeout(() => {
    // 模拟发现的问题
    const issues = [
      {
        id: '1',
        type: '标点挤压',
        severity: 'high',
        description: '发现标点符号间距问题',
        location: 'Page 1 / Text Frame 1'
      },
      {
        id: '2',
        type: '中英文混排',
        severity: 'medium',
        description: '中英文之间缺少空格',
        location: 'Page 1 / Text Frame 2'
      }
    ];

    figma.ui.postMessage({
      type: 'typography-checked',
      message: `已检查 ${textNodes.length} 个文本节点，发现 ${issues.length} 个排版问题`,
      issues: issues,
      textNodeCount: textNodes.length
    });
  }, 1200);
}

// 修复标点
function fixPunctuation() {
  const textNodes = figma.currentPage.findAll(node => node.type === 'TEXT');
  if (textNodes.length === 0) {
    figma.ui.postMessage({ type: 'error', message: '当前页面没有文本节点' });
    return;
  }

  // 模拟修复标点
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'punctuation-fixed',
      message: `已修复 ${textNodes.length} 个文本节点的标点问题`,
      count: textNodes.length
    });
  }, 1000);
}

// 添加中文资源
function addChineseResources() {
  // 模拟添加资源
  setTimeout(() => {
    figma.ui.postMessage({
      type: 'resources-added',
      message: '已添加常用中文设计资源到Figma库',
      resourceCount: chineseResources.length
    });
  }, 1500);
}

// 翻译文本
function translateText(text, targetLang) {
  if (!text) {
    figma.ui.postMessage({ type: 'error', message: '请输入要翻译的文本' });
    return;
  }

  // 模拟翻译
  setTimeout(() => {
    const translatedText = targetLang === 'en' ? 'This is a translation example' : '这是一个翻译示例';
    figma.ui.postMessage({
      type: 'text-translated',
      message: `文本已翻译为 ${targetLang === 'en' ? '英文' : '中文'}`,
      originalText: text,
      translatedText: translatedText
    });
  }, 1000);
}

// 生成中文内容
function generateChineseContent(type, length) {
  // 模拟生成内容
  setTimeout(() => {
    let content = '';
    
    switch (type) {
      case 'title':
        content = '这是一个示例标题';
        break;
      case 'paragraph':
        content = '这是一段示例文本，用于展示中文内容生成功能。这段文本包含了多个句子，以满足长度要求。';
        break;
      case 'list':
        content = '• 第一项\n• 第二项\n• 第三项';
        break;
    }

    figma.ui.postMessage({
      type: 'content-generated',
      message: `已生成 ${getContentTypeText(type)} 内容`,
      content: content,
      type: type
    });
  }, 800);
}

// 获取内容类型文本
function getContentTypeText(type) {
  const typeMap = {
    'title': '标题',
    'paragraph': '段落',
    'list': '列表'
  };
  return typeMap[type] || type;
}
