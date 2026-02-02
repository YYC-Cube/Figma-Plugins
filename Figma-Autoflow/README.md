# Figma Autoflow

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 流程图和连接器创建工具

## 概述

Figma Autoflow是一个智能的Figma插件，用于快速创建流程图和连接器。它帮助设计师轻松创建复杂的流程图、用户流程图和系统架构图，支持自动布局和智能连接。

## 功能特性

### 流程图创建
- 快速创建流程图节点
- 智能节点对齐
- 自动布局优化
- 多种节点样式

### 智能连接器
- 自动创建连接线
- 智能路径优化
- 多种连接器样式
- 连接器标签支持

### 流程图模板
- 用户流程图模板
- 系统架构图模板
- 数据流程图模板
- 决策流程图模板

### 布局优化
- 自动布局算法
- 层级结构优化
- 间距自动调整
- 对齐和分布

### 导出功能
- 导出为图片
- 导出为SVG
- 导出为代码
- 多种格式支持

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 创建流程图

1. 打开Figma Autoflow插件
2. 选择流程图类型（用户流程、系统架构等）
3. 点击"创建流程图"按钮
4. 添加节点和连接器
5. 调整布局和样式

### 添加节点

1. 在插件中选择节点类型
2. 点击"添加节点"按钮
3. 节点将自动添加到画布
4. 可以拖动节点调整位置

### 创建连接器

1. 选择两个要连接的节点
2. 在插件中选择连接器类型
3. 点击"创建连接器"按钮
4. 连接器将自动连接两个节点

### 应用模板

1. 在插件模板列表中选择模板
2. 点击"应用模板"按钮
3. 模板将自动创建在画布上
4. 根据需要调整内容

### 优化布局

1. 选择要优化的流程图
2. 在插件中点击"优化布局"
3. 选择布局算法（层次、网格、圆形等）
4. 查看优化后的布局

## 节点类型

### 开始/结束节点
表示流程的开始和结束点，通常使用圆形或圆角矩形。

### 处理节点
表示流程中的处理步骤，通常使用矩形。

### 决策节点
表示流程中的决策点，通常使用菱形。

### 数据节点
表示数据的输入和输出，通常使用平行四边形。

### 连接节点
表示流程的连接点，通常使用小圆形。

## 连接器类型

### 直线连接器
最简单的连接器类型，直接连接两个节点。

### 曲线连接器
使用贝塞尔曲线连接节点，适合复杂的流程图。

### 正交连接器
使用水平和垂直线段连接节点，适合技术图表。

### 分支连接器
支持从一个节点连接到多个节点。

## 布局算法

### 层次布局
按照节点的层次关系进行布局，适合组织结构图。

### 网格布局
将节点排列在网格中，适合规则的结构。

### 圆形布局
将节点排列在圆形中，适合循环流程。

### 力导向布局
使用物理模拟优化节点位置，适合复杂网络。

## 开发

### 项目结构

```
Figma-Autoflow/
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

- **默认节点样式**：选择默认节点样式
- **默认连接器样式**：选择默认连接器样式
- **自动布局**：启用自动布局优化
- **智能对齐**：启用智能对齐功能

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `create-flow`: 创建流程图
- `add-node`: 添加节点
- `remove-node`: 移除节点
- `create-connector`: 创建连接器
- `remove-connector`: 移除连接器
- `apply-template`: 应用模板
- `optimize-layout`: 优化布局
- `export-flow`: 导出流程图
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
