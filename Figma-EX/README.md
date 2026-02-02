# Figma EX

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 扩展工具集，提供额外功能

## 概述

Figma EX是一个功能丰富的Figma插件，提供多种扩展工具和功能。它包含对齐工具、组件工具、重复工具、生成工具和清理工具，帮助设计师提高工作效率。

## 功能特性

### 对齐工具
- 智能对齐
- 分布工具
- 间距工具
- 网格对齐

### 组件工具
- 快速创建组件
- 组件变体管理
- 组件实例更新
- 组件库管理

### 重复工具
- 智能重复
- 网格重复
- 径向重复
- 随机重复

### 生成工具
- 形状生成
- 图案生成
- 背景生成
- 纹理生成

### 清理工具
- 清理空图层
- 清理隐藏图层
- 清理未使用样式
- 清理重复元素

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 使用对齐工具

1. 在Figma中选择要对齐的元素
2. 打开Figma EX插件
3. 选择对齐类型（左对齐、居中对齐、右对齐等）
4. 点击"对齐"按钮
5. 元素将自动对齐

### 使用组件工具

1. 选择要转换为组件的元素
2. 在插件中选择"创建组件"
3. 设置组件名称和属性
4. 点击"创建"按钮
5. 组件将自动创建

### 使用重复工具

1. 选择要重复的元素
2. 在插件中选择重复类型（网格、径向、随机）
3. 设置重复参数（数量、间距、角度等）
4. 点击"重复"按钮
5. 元素将自动重复

### 使用生成工具

1. 在插件中选择生成类型（形状、图案、背景等）
2. 设置生成参数
3. 点击"生成"按钮
4. 生成的内容将添加到画布

### 使用清理工具

1. 在插件中选择清理类型（空图层、隐藏图层等）
2. 点击"清理"按钮
3. 插件将扫描并清理选定的元素

## 工具类型

### 对齐工具
帮助快速对齐和分布多个元素。

### 组件工具
帮助快速创建和管理组件。

### 重复工具
帮助快速重复和排列元素。

### 生成工具
帮助快速生成形状、图案和背景。

### 清理工具
帮助清理和优化设计文件。

## 开发

### 项目结构

```
Figma-EX/
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

- **默认对齐方式**：选择默认对齐方式
- **默认重复类型**：选择默认重复类型
- **自动清理**：启用自动清理
- **工具快捷键**：设置工具快捷键

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `align-elements`: 对齐元素
- `distribute-elements`: 分布元素
- `create-component`: 创建组件
- `manage-variants`: 管理组件变体
- `duplicate-elements`: 重复元素
- `generate-shape`: 生成形状
- `generate-pattern`: 生成图案
- `generate-background`: 生成背景
- `clean-empty-layers`: 清理空图层
- `clean-hidden-layers`: 清理隐藏图层
- `clean-unused-styles`: 清理未使用样式
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
