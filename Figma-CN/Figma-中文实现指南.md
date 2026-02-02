# Figma 中文实现指南

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

**更新时间：** 2026-01-31  
**目标：** 帮助开发者理解如何在 Figma 插件中实现中文界面和功能

---

## 目录

1. [实现方式概述](#实现方式概述)
2. [插件中文界面实现](#插件中文界面实现)
3. [文本翻译功能](#文本翻译功能)
4. [技术实现细节](#技术实现细节)
5. [常见问题解决](#常见问题解决)

---

## 实现方式概述

Figma 中文支持主要有以下几种实现方式：

### 方式对比

| 方式 | 难度 | 效果 | 适用场景 | 示例插件 |
|------|--------|------|----------|----------|
| **界面汉化** | ⭐⭐⭐ | 菜单/面板中文 | 降低使用门槛 | FigmaCN、FigmaEX |
| **文本翻译** | ⭐⭐⭐⭐⭐ | 图层内容转中文 | 多语言原型 | Gleef、Parrot |
| **双语支持** | ⭐⭐⭐ | 中英文切换 | 国际化需求 | 自定义插件 |

### 推荐方案

**初学者：** 使用 FigmaCN（界面汉化）  
**开发者：** 实现文本翻译功能  
**进阶：** 双语切换 + 翻译功能

---

## 插件中文界面实现

### 1.1 UI 界面汉化

#### HTML 界面中文

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
      padding: 20px;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    h1 {
      color: #333;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .button {
      padding: 12px 24px;
      background: #2261EF;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    .button:hover {
      background: #1a4bd6;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>PostgreSQL 数据管理器</h1>
    <button class="button" id="parseBtn">解析设计</button>
    <button class="button" id="exportBtn">导出 SQL</button>
  </div>

  <script>
    document.getElementById('parseBtn').addEventListener('click', () => {
      parent.postMessage({ pluginMessage: { type: 'parse-design' } }, '*');
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
      parent.postMessage({ pluginMessage: { type: 'export-sql' } }, '*');
    });
  </script>
</body>
</html>
```

#### TypeScript 代码中文

```typescript
figma.showUI(__html__, { width: 640, height: 800 });

figma.ui.onmessage = async (msg: any) => {
  switch (msg.type) {
    case 'parse-design':
      const schema = await parseDesign();
      figma.notify('解析成功！');
      break;
    case 'export-sql':
      const sql = await generateSQL();
      figma.notify('导出成功！');
      break;
  }
};

async function parseDesign() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.notify('请先选择一些元素');
    return null;
  }
  
  figma.notify(`已选中 ${selection.length} 个元素`);
  return selection;
}
```

### 1.2 Figma 节点中文

#### 创建中文文本节点

```typescript
function createChineseText(text: string, x: number, y: number): TextNode {
  const textNode = figma.createText();
  textNode.characters = text;
  textNode.x = x;
  textNode.y = y;
  textNode.fontSize = 16;
  textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  return textNode;
}

// 使用示例
const title = createChineseText('数据库设计', 100, 100);
const subtitle = createChineseText('表结构可视化', 100, 130);
figma.currentPage.appendChild(title);
figma.currentPage.appendChild(subtitle);
```

#### 批量创建中文标签

```typescript
function createTableLabel(tableName: string, x: number, y: number): FrameNode {
  const frame = figma.createFrame();
  frame.name = tableName;
  frame.resize(200, 40);
  frame.x = x;
  frame.y = y;
  frame.fills = [{ type: 'SOLID', color: { r: 0.13, g: 0.37, b: 0.63 } }];
  
  const text = figma.createText();
  text.characters = `表名: ${tableName}`;
  text.fontSize = 14;
  text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  text.x = 10;
  text.y = 12;
  frame.appendChild(text);
  
  return frame;
}

// 批量创建
const tables = ['用户表', '订单表', '产品表'];
tables.forEach((name, index) => {
  const label = createTableLabel(name, 50, 50 + index * 60);
  figma.currentPage.appendChild(label);
});
```

---

## 文本翻译功能

### 2.1 翻译接口集成

#### 使用在线翻译 API

```typescript
interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

async function translateText(text: string, targetLang: string = 'zh-CN'): Promise<TranslationResult> {
  try {
    const response = await fetch('https://api.example.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        text: text,
        source: 'auto',
        target: targetLang
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('翻译失败:', error);
    return {
      originalText: text,
      translatedText: text,
      sourceLang: 'auto',
      targetLang: targetLang
    };
  }
}
```

#### 批量翻译选中的文本

```typescript
async function translateSelection() {
  const selection = figma.currentPage.selection;
  const textNodes = selection.filter(node => node.type === 'TEXT') as TextNode[];
  
  if (textNodes.length === 0) {
    figma.notify('请选择文本图层');
    return;
  }
  
  figma.notify(`正在翻译 ${textNodes.length} 个文本...`);
  
  const results = await Promise.all(
    textNodes.map(node => translateText(node.characters))
  );
  
  results.forEach((result, index) => {
    textNodes[index].characters = result.translatedText;
  });
  
  figma.notify('翻译完成！');
}
```

### 2.2 本地翻译字典

#### 创建翻译映射

```typescript
const translationDict: Record<string, string> = {
  // 英文 → 中文
  'User': '用户',
  'Order': '订单',
  'Product': '产品',
  'Database': '数据库',
  'Table': '表',
  'Column': '列',
  'Primary Key': '主键',
  'Foreign Key': '外键',
  'Index': '索引',
  'Create': '创建',
  'Update': '更新',
  'Delete': '删除',
  'Export': '导出',
  'Import': '导入',
  'Settings': '设置',
  'Help': '帮助'
};

function translateWithDict(text: string): string {
  return translationDict[text] || text;
}
```

#### 使用字典翻译

```typescript
function createLocalizedButton(label: string): FrameNode {
  const button = figma.createFrame();
  button.resize(120, 40);
  button.fills = [{ type: 'SOLID', color: { r: 0.22, g: 0.38, b: 0.63 } }];
  
  const text = figma.createText();
  text.characters = translateWithDict(label);
  text.fontSize = 14;
  text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  button.appendChild(text);
  
  return button;
}

// 创建中文按钮
const createBtn = createLocalizedButton('Create');
const updateBtn = createLocalizedButton('Update');
const deleteBtn = createLocalizedButton('Delete');
```

---

## 技术实现细节

### 3.1 字符编码处理

#### UTF-8 编码设置

```html
<!-- HTML 文件必须声明 UTF-8 -->
<meta charset="UTF-8">
```

```typescript
// TypeScript 文件使用 UTF-8 编码保存
// 确保中文字符正确显示
```

#### 字体设置

```typescript
// 使用支持中文的字体
const chineseFonts = [
  'Microsoft YaHei',      // 微软雅黑
  'SimHei',              // 黑体
  'PingFang SC',         // 苹方
  'STHeiti',             // 华文黑体
];

function setChineseFont(node: TextNode) {
  node.fontName = {
    family: 'Microsoft YaHei',
    style: 'Regular'
  };
}
```

### 3.2 多语言支持

#### 语言切换实现

```typescript
type Language = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR';

let currentLanguage: Language = 'zh-CN';

const i18n: Record<Language, Record<string, string>> = {
  'zh-CN': {
    'title': 'PostgreSQL 数据管理器',
    'parse': '解析设计',
    'export': '导出 SQL',
    'import': '导入',
    'settings': '设置'
  },
  'en-US': {
    'title': 'PostgreSQL Data Manager',
    'parse': 'Parse Design',
    'export': 'Export SQL',
    'import': 'Import',
    'settings': 'Settings'
  }
};

function t(key: string): string {
  return i18n[currentLanguage][key] || key;
}

// 切换语言
function switchLanguage(lang: Language) {
  currentLanguage = lang;
  figma.notify(`语言已切换为: ${lang}`);
  figma.ui.postMessage({
    type: 'language-changed',
    data: { language: lang }
  });
}
```

#### UI 语言切换

```html
<div class="language-selector">
  <button data-lang="zh-CN" class="active">中文</button>
  <button data-lang="en-US">English</button>
</div>

<script>
  const langButtons = document.querySelectorAll('.language-selector button');
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      parent.postMessage({ 
        pluginMessage: { 
          type: 'switch-language',
          language: lang 
        } 
      }, '*');
    });
  });
</script>
```

### 3.3 错误处理

#### 中文错误消息

```typescript
const errorMessages: Record<string, string> = {
  'no-selection': '请先选择一些元素',
  'parse-failed': '解析失败，请重试',
  'export-success': '导出成功！',
  'import-success': '导入成功！',
  'network-error': '网络错误，请检查连接'
};

function showError(key: string, details?: string) {
  const message = errorMessages[key] || key;
  figma.notify(message);
  
  if (details) {
    console.error(`错误详情: ${details}`);
  }
}

// 使用示例
try {
  await parseDesign();
} catch (error) {
  showError('parse-failed', error.message);
}
```

---

## 常见问题解决

### 4.1 中文显示问题

#### 问题：中文显示为乱码

**原因：** 字符编码不正确

**解决方案：**
```html
<!-- 确保 HTML 文件使用 UTF-8 -->
<meta charset="UTF-8">

<!-- 确保 TypeScript 文件保存为 UTF-8 -->
```

#### 问题：中文字体不美观

**原因：** 使用了不支持中文的字体

**解决方案：**
```typescript
// 使用中文字体
textNode.fontName = {
  family: 'Microsoft YaHei',
  style: 'Regular'
};

// 或者使用系统默认字体
textNode.fontName = {
  family: 'Inter',
  style: 'Regular'
};
```

### 4.2 翻译功能问题

#### 问题：翻译不准确

**原因：** API 返回结果不准确

**解决方案：**
```typescript
// 1. 提供翻译编辑功能
function editTranslation(node: TextNode, originalText: string) {
  const translated = prompt('请确认翻译:', node.characters);
  
  if (translated !== null) {
    node.characters = translated;
  }
}

// 2. 支持手动修正
figma.ui.postMessage({
  type: 'show-edit-dialog',
  data: {
    nodeId: node.id,
    currentText: node.characters,
    originalText: originalText
  }
});
```

#### 问题：翻译速度慢

**原因：** 逐个翻译效率低

**解决方案：**
```typescript
// 批量翻译
async function batchTranslate(texts: string[]): Promise<string[]> {
  const batchSize = 10;
  const results: string[] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const translated = await translateBatch(batch);
    results.push(...translated);
    
    figma.notify(`进度: ${Math.min(i + batchSize, texts.length)}/${texts.length}`);
  }
  
  return results;
}
```

### 4.3 性能优化

#### 减少中文文本操作

```typescript
// ❌ 不推荐：频繁修改文本
textNodes.forEach(node => {
  node.characters = translateText(node.characters);
});

// ✅ 推荐：批量处理
const texts = textNodes.map(node => node.characters);
const translated = await batchTranslate(texts);
textNodes.forEach((node, i) => {
  node.characters = translated[i];
});
```

#### 缓存翻译结果

```typescript
const translationCache = new Map<string, string>();

async function getCachedTranslation(text: string): Promise<string> {
  if (translationCache.has(text)) {
    return translationCache.get(text)!;
  }
  
  const result = await translateText(text);
  translationCache.set(text, result.translatedText);
  
  return result.translatedText;
}
```

---

## 实现示例

### 完整的中文插件示例

#### manifest.json

```json
{
  "name": "figma-chinese-plugin",
  "id": "12345678901234567",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "capabilities": [],
  "enableProposedApi": false,
  "permissions": [],
  "relaunchButtons": [
    {
      "command": "translate-selection",
      "title": "翻译选中"
    }
  ]
}
```

#### code.ts

```typescript
figma.showUI(__html__, { width: 480, height: 320 });

figma.ui.onmessage = async (msg: any) => {
  switch (msg.type) {
    case 'translate-selection':
      await translateSelection();
      break;
    case 'switch-language':
      switchLanguage(msg.language);
      break;
    case 'close':
      figma.closePlugin();
      break;
  }
};

async function translateSelection() {
  const selection = figma.currentPage.selection;
  const textNodes = selection.filter(node => node.type === 'TEXT') as TextNode[];
  
  if (textNodes.length === 0) {
    figma.notify('请选择文本图层');
    return;
  }
  
  const results = await Promise.all(
    textNodes.map(node => translateText(node.characters))
  );
  
  results.forEach((result, index) => {
    textNodes[index].characters = result.translatedText;
  });
  
  figma.notify(`已翻译 ${textNodes.length} 个文本`);
}

async function translateText(text: string): Promise<{ translatedText: string }> {
  const response = await fetch('https://api.example.com/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text,
      source: 'auto',
      target: 'zh-CN'
    })
  });
  
  const data = await response.json();
  return { translatedText: data.translatedText };
}

function switchLanguage(lang: string) {
  figma.notify(`语言已切换: ${lang}`);
}
```

#### ui.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: "Microsoft YaHei", -apple-system, sans-serif;
      padding: 20px;
      margin: 0;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    h1 {
      color: #333;
      font-size: 20px;
      margin: 0 0 16px 0;
    }
    .button-group {
      display: flex;
      gap: 8px;
    }
    button {
      flex: 1;
      padding: 12px;
      background: #2261EF;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background: #1a4bd6;
    }
    .language-selector {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    .lang-btn {
      padding: 8px 16px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
    .lang-btn.active {
      background: #2261EF;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Figma 中文翻译工具</h1>
    
    <div class="button-group">
      <button id="translateBtn">翻译选中</button>
    </div>
    
    <div class="language-selector">
      <button class="lang-btn active" data-lang="zh-CN">中文</button>
      <button class="lang-btn" data-lang="en-US">English</button>
    </div>
  </div>

  <script>
    document.getElementById('translateBtn').addEventListener('click', () => {
      parent.postMessage({ 
        pluginMessage: { type: 'translate-selection' } 
      }, '*');
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        parent.postMessage({ 
          pluginMessage: { 
            type: 'switch-language',
            language: lang 
          } 
        }, '*');
      });
    });
  </script>
</body>
</html>
```

---

## 总结

### 实现要点

✅ **UTF-8 编码** - 确保 HTML 和 TypeScript 文件使用 UTF-8  
✅ **中文字体** - 使用支持中文的字体（微软雅黑、苹方等）  
✅ **翻译 API** - 集成在线翻译或本地字典  
✅ **批量处理** - 提高翻译效率  
✅ **错误处理** - 提供中文错误提示  
✅ **多语言支持** - 实现语言切换功能  

### 推荐工具

| 工具 | 用途 | 推荐度 |
|------|------|--------|
| FigmaCN | 界面汉化 | ⭐⭐⭐⭐⭐ |
| Gleef | AI 翻译 | ⭐⭐⭐⭐⭐ |
| Parrot | 本地化翻译 | ⭐⭐⭐⭐ |
| FigmaEX | 汉化+功能 | ⭐⭐⭐⭐ |

### 学习资源

- [Figma Plugin API 文档](https://www.figma.com/plugin-docs/)
- [Figma Community](https://www.figma.com/community/plugin/)
- [TypeScript 中文文档](https://www.tslang.cn/docs/home.html)

---

**文档结束**

*最后更新：2026-01-31*

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
