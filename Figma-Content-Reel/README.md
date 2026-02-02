# Figma Content Reel

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 内容填充和占位符生成工具

## 概述

Figma Content Reel是一个功能强大的Figma插件，用于快速填充内容和创建占位符。它支持多种内容类型，包括文本、图片、头像等，帮助设计师快速完成设计原型。

## 功能特性

### 文本生成
- 标题生成（不同长度和风格）
- 段落生成（不同长度和主题）
- 列表生成（有序和无序列表）
- 按钮文本生成
- 表单标签生成

### 图片填充
- 自动插入占位符图片
- 支持多种图片尺寸
- 随机图片选择
- 图片主题分类

### 头像生成
- 用户头像占位符
- 头像尺寸选择
- 头像样式选择
- 批量头像生成

### 批量操作
- 批量填充多个元素
- 智能内容匹配
- 批量样式应用
- 批量内容替换

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 填充文本

1. 在Figma中选择文本元素
2. 打开Figma Content Reel插件
3. 选择文本类型（标题、段落、列表等）
4. 设置文本参数（长度、风格等）
5. 点击"填充文本"按钮

### 插入图片

1. 在Figma中选择要插入图片的框架
2. 在插件中选择"图片填充"
3. 选择图片尺寸和主题
4. 点击"插入图片"按钮

### 生成头像

1. 在Figma中选择要放置头像的框架
2. 在插件中选择"头像生成"
3. 选择头像尺寸和样式
4. 点击"生成头像"按钮

### 批量填充

1. 选择多个要填充的元素
2. 在插件中启用"批量模式"
3. 选择内容类型和参数
4. 点击"批量填充"按钮

## 内容类型

### 标题
- 短标题（2-5个词）
- 中等标题（5-10个词）
- 长标题（10-20个词）
- 不同风格（正式、随意、创意）

### 段落
- 短段落（1-3句话）
- 中等段落（3-5句话）
- 长段落（5-10句话）
- 不同主题（科技、生活、商业）

### 列表
- 无序列表（项目符号）
- 有序列表（数字）
- 不同长度（3-10项）
- 不同层级（1-3级）

### 图片
- 小图片（200x200）
- 中等图片（400x400）
- 大图片（800x600）
- 不同主题（自然、城市、抽象）

## 开发

### 项目结构

```
Figma-Content-Reel/
├── manifest.json          # 插件配置文件
├── package.json            # 依赖和脚本
├── tsconfig.json           # TypeScript配置
├── code.ts                 # 插件主逻辑
├── code.js                 # 编译后的JavaScript
└── ui.html                 # 用户界面
```

### 构建

```bash
# 安装依赖
npm install

# 编译TypeScript
npm run build

# 监听文件变化
npm run watch
```

## 配置

插件支持可配置的设置：

- **默认文本语言**：选择文本语言
- **默认图片尺寸**：设置默认图片尺寸
- **自动填充**：启用自动内容填充
- **内容缓存**：启用内容缓存以提高性能

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `fill-text`: 填充文本内容
- `insert-image`: 插入图片
- `generate-avatar`: 生成头像
- `batch-fill`: 批量填充
- `clear-content`: 清除内容
- `load-content-library`: 加载内容库
- `save-content-library`: 保存内容库
- `load-config`: 加载插件配置
- `save-config`: 保存插件配置
- `close`: 关闭插件

## 贡献

欢迎贡献！请遵循以下准则：

1. Fork本仓库
2. 创建功能分支
3. 进行更改
4. 确保所有测试通过
5. 提交Pull Request

## 许可证

MIT许可证 - 详见LICENSE文件

## 支持

如有问题、疑问或建议，请联系YYC³团队。

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
