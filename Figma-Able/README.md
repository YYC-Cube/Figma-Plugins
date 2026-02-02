# Figma Able

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 可访问性检查和改进工具

## 概述

Figma Able是一个全面的Figma插件，用于检查和改进设计的可访问性。它帮助设计师确保其设计符合WCAG（Web内容可访问性指南）标准，为所有用户提供更好的用户体验。

## 功能特性

### 可访问性检查
- 颜色对比度检查
- 文本可读性检查
- 点击区域大小检查
- 键盘导航检查
- 屏幕阅读器兼容性检查

### 颜色分析
- 实时颜色对比度计算
- WCAG AA和AAA级别验证
- 颜色建议和替代方案
- 色盲模拟
- 对比度改进建议

### 文本分析
- 字体大小检查
- 行高和字间距分析
- 文本对齐检查
- 多语言支持评估
- 文本缩放兼容性

### 交互分析
- 焦点管理检查
- 键盘导航路径
- 交互反馈验证
- 触摸目标大小
- 手势支持评估

### 报告生成
- 详细的可访问性报告
- 问题优先级排序
- 修复建议和示例
- 导出为PDF或HTML
- 团队协作支持

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 运行可访问性检查

1. 在Figma中选择要检查的元素
2. 打开Figma Able插件
3. 选择检查类型（颜色、文本、交互等）
4. 点击"运行检查"按钮
5. 查看检查结果和问题列表

### 检查颜色对比度

1. 选择包含文本和背景的元素
2. 在插件中选择"颜色对比度"检查
3. 查看对比度比率和WCAG合规性
4. 根据建议调整颜色

### 检查文本可读性

1. 选择文本元素
2. 在插件中选择"文本可读性"检查
3. 查看字体大小、行高等指标
4. 根据建议优化文本样式

### 生成可访问性报告

1. 运行所需的检查
2. 点击"生成报告"按钮
3. 选择报告格式（PDF或HTML）
4. 报告将自动下载

### 修复可访问性问题

1. 在问题列表中选择问题
2. 查看详细的修复建议
3. 应用建议的修复方案
4. 重新运行检查验证修复

## WCAG标准

### WCAG 2.1 AA级别
- 最低对比度要求：4.5:1（正常文本）
- 最低对比度要求：3:1（大文本）
- 点击区域最小尺寸：44x44像素

### WCAG 2.1 AAA级别
- 推荐对比度要求：7:1（正常文本）
- 推荐对比度要求：4.5:1（大文本）
- 更严格的交互要求

## 检查类型

### 颜色对比度检查
检查文本和背景颜色之间的对比度是否符合WCAG标准。

### 文本可读性检查
评估字体大小、行高、字间距等文本属性的可读性。

### 交互元素检查
验证按钮、链接等交互元素的可访问性。

### 键盘导航检查
确保所有交互元素都可以通过键盘访问。

### 屏幕阅读器检查
验证设计是否与屏幕阅读器兼容。

## 开发

### 项目结构

```
Figma-Able/
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

- **默认WCAG级别**：选择AA或AAA级别
- **自动检查**：启用自动可访问性检查
- **问题严重性**：设置问题严重性级别
- **报告格式**：选择默认报告格式

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `run-accessibility-check`: 运行可访问性检查
- `check-color-contrast`: 检查颜色对比度
- `check-text-readability`: 检查文本可读性
- `check-interaction-elements`: 检查交互元素
- `check-keyboard-navigation`: 检查键盘导航
- `check-screen-reader`: 检查屏幕阅读器兼容性
- `generate-report`: 生成可访问性报告
- `fix-issue`: 修复可访问性问题
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
