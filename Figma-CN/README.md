# Figma CN

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 中文语言支持和本地化工具

## 概述

Figma CN是一个专为中文用户设计的Figma插件，提供全面的中文语言支持和本地化功能。它帮助中文用户更高效地使用Figma，提供中文字体推荐、中文排版检查、翻译工具等功能。

## 功能特性

### 中文字体推荐

- 推荐适合中文的字体
- 字体预览和比较
- 字体分类和标签
- 字体使用建议

### 中文排版检查

- 中文字间距检查
- 行高和字间距建议
- 中文标点符号检查
- 排版规范验证

### 中文设计资源

- 中文设计模板
- 中文图标资源
- 中文色彩方案
- 中文设计指南

### 翻译工具

- 中英文互译
- 批量翻译功能
- 术语库管理
- 翻译历史记录

### 中文内容生成

- 中文占位符文本
- 中文标题生成
- 中文段落生成
- 中文列表生成

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 应用中文字体

1. 在Figma中选择文本元素
2. 打开Figma CN插件
3. 从字体列表中选择字体
4. 点击"应用字体"按钮
5. 字体将应用到选中的文本

### 检查中文排版

1. 选择要检查的文本
2. 在插件中选择"排版检查"
3. 查看排版问题和建议
4. 根据建议调整文本样式

### 使用翻译工具

1. 选择要翻译的文本
2. 在插件中选择翻译方向（中译英或英译中）
3. 点击"翻译"按钮
4. 翻译结果将显示在插件中

### 生成中文内容

1. 在插件中选择内容类型（标题、段落、列表等）
2. 设置内容参数（长度、风格等）
3. 点击"生成内容"按钮
4. 生成的内容可以复制或直接插入

## 中文字体推荐

### 标题字体

- 思源黑体
- 方正黑体
- 苹方
- 微软雅黑

### 正文字体

- 思源宋体
- 方正书宋
- 楷体
- 仿宋

### 装饰字体

- 站酷快乐体
- 汉仪小麦体
- 站酷庆科黄油体
- 汉仪旗黑

## 中文排版规范

### 字间距

- 中文标题：0.05em - 0.1em
- 中文正文：0.05em - 0.15em
- 中文注释：0.1em - 0.2em

### 行高

- 中文标题：1.2 - 1.5
- 中文正文：1.5 - 1.8
- 中文注释：1.6 - 2.0

### 段落间距

- 中文标题后：1.5 - 2行
- 中文段落后：1 - 1.5行
- 中文列表项后：0.5 - 1行

## 开发

### 项目结构

```
Figma-CN/
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

- **默认中文字体**：选择默认中文字体
- **自动排版检查**：启用自动排版检查
- **翻译服务**：选择翻译服务提供商
- **内容生成风格**：选择内容生成风格

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `apply-chinese-font`: 应用中文字体
- `check-typography`: 检查中文排版
- `translate-text`: 翻译文本
- `generate-chinese-content`: 生成中文内容
- `load-font-library`: 加载字体库
- `save-font-library`: 保存字体库
- `load-translation-history`: 加载翻译历史
- `save-translation-history`: 保存翻译历史
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
