# Figma Grid Guide

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 网格和辅助线创建工具

## 概述

Figma Grid Guide是一个实用的Figma插件，用于快速创建网格和辅助线。它帮助设计师建立设计系统，确保设计的一致性和对齐。

## 功能特性

### 列网格
- 创建列网格
- 自定义列数和宽度
- 设置列间距
- 响应式断点支持

### 行网格
- 创建行网格
- 自定义行数和高度
- 设置行间距
- 基线网格支持

### 基线网格
- 创建基线网格
- 设置基线间距
- 字体大小对齐
- 多语言支持

### 网格模板
- 常用网格预设
- 自定义网格模板
- 网格模板导入/导出
- 团队网格库

### 辅助线工具
- 创建水平辅助线
- 创建垂直辅助线
- 创建对角辅助线
- 辅助线管理

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 创建列网格

1. 在Figma中打开页面
2. 打开Figma Grid Guide插件
3. 选择"列网格"选项
4. 设置列数、宽度和间距
5. 点击"创建网格"按钮

### 创建行网格

1. 在Figma中打开页面
2. 打开Figma Grid Guide插件
3. 选择"行网格"选项
4. 设置行数、高度和间距
5. 点击"创建网格"按钮

### 创建基线网格

1. 在Figma中打开页面
2. 打开Figma Grid Guide插件
3. 选择"基线网格"选项
4. 设置基线间距和字体大小
5. 点击"创建网格"按钮

### 应用网格模板

1. 在插件模板列表中选择模板
2. 点击"应用模板"按钮
3. 网格将自动创建在画布上
4. 根据需要调整参数

### 创建辅助线

1. 在插件中选择辅助线类型（水平、垂直、对角）
2. 设置辅助线位置和数量
3. 点击"创建辅助线"按钮
4. 辅助线将添加到画布

## 网格类型

### 12列网格
最常用的网格系统，适合大多数响应式设计。

### 16列网格
适合复杂的设计，提供更多的布局灵活性。

### 24列网格
适合大型项目，支持精细的布局控制。

### 自定义网格
根据项目需求自定义列数和间距。

## 网格参数

### 列宽
每列的宽度，可以是固定值或百分比。

### 列间距
列之间的间距，影响整体布局的紧凑程度。

### 边距
网格两侧的边距，提供视觉呼吸空间。

### 响应式断点
不同屏幕尺寸下的网格调整规则。

## 开发

### 项目结构

```
Figma-Grid-Guide/
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

- **默认网格类型**：选择默认网格类型
- **默认列数**：设置默认列数
- **默认间距**：设置默认间距值
- **自动创建网格**：启用自动网格创建

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `create-column-grid`: 创建列网格
- `create-row-grid`: 创建行网格
- `create-baseline-grid`: 创建基线网格
- `apply-grid-template`: 应用网格模板
- `create-horizontal-guide`: 创建水平辅助线
- `create-vertical-guide`: 创建垂直辅助线
- `create-diagonal-guide`: 创建对角辅助线
- `clear-guides`: 清除辅助线
- `save-grid-template`: 保存网格模板
- `load-grid-template`: 加载网格模板
- `export-grid-templates`: 导出网格模板
- `import-grid-templates`: 导入网格模板
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
