# Figma Parrot

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 元素复制和重复工具

## 概述

Figma Parrot是一个高效的Figma插件，用于快速复制和重复元素。它支持多种重复模式，包括网格重复、径向重复和随机重复，帮助设计师快速创建复杂的图案和布局。

## 功能特性

### 智能复制
- 智能复制元素
- 保持样式和属性
- 自动调整位置
- 批量复制支持

### 网格重复
- 创建网格布局
- 自定义行数和列数
- 设置水平和垂直间距
- 智能对齐

### 径向重复
- 创建圆形布局
- 自定义重复数量
- 设置半径和角度
- 旋转控制

### 随机重复
- 随机分布元素
- 设置分布范围
- 随机旋转和缩放
- 随机颜色变化

### 重复模板
- 常用重复模式
- 自定义重复模板
- 模板导入/导出
- 团队模板库

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 智能复制元素

1. 在Figma中选择要复制的元素
2. 打开Figma Parrot插件
3. 选择"智能复制"功能
4. 设置复制数量和方向
5. 点击"复制"按钮

### 创建网格重复

1. 选择要重复的元素
2. 在插件中选择"网格重复"
3. 设置行数、列数和间距
4. 点击"创建网格"按钮
5. 元素将按网格排列

### 创建径向重复

1. 选择要重复的元素
2. 在插件中选择"径向重复"
3. 设置重复数量、半径和起始角度
4. 点击"创建径向"按钮
5. 元素将按圆形排列

### 创建随机重复

1. 选择要重复的元素
2. 在插件中选择"随机重复"
3. 设置重复数量、分布范围和随机参数
4. 点击"创建随机"按钮
5. 元素将随机分布

### 应用重复模板

1. 在插件模板列表中选择模板
2. 点击"应用模板"按钮
3. 模板将自动应用到选中的元素
4. 根据需要调整参数

## 重复模式

### 网格重复
将元素排列在规则的网格中，适合创建图案和布局。

### 径向重复
将元素排列在圆形中，适合创建徽章和图标。

### 随机重复
将元素随机分布在指定范围内，适合创建纹理和背景。

### 线性重复
将元素沿直线重复，适合创建边框和分隔线。

## 重复参数

### 重复数量
设置要创建的元素副本数量。

### 间距
设置元素之间的间距，影响重复的紧凑程度。

### 角度
设置重复的角度，影响元素的排列方向。

### 半径
设置径向重复的半径，影响圆形的大小。

## 开发

### 项目结构

```
Figma-Parrot/
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

- **默认重复模式**：选择默认重复模式
- **默认重复数量**：设置默认重复数量
- **默认间距**：设置默认间距值
- **自动对齐**：启用自动对齐功能

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `smart-duplicate`: 智能复制元素
- `grid-duplicate`: 网格重复
- `radial-duplicate`: 径向重复
- `random-duplicate`: 随机重复
- `linear-duplicate`: 线性重复
- `apply-template`: 应用重复模板
- `save-template`: 保存重复模板
- `load-template`: 加载重复模板
- `export-templates`: 导出重复模板
- `import-templates`: 导入重复模板
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
