# Figma PureRef

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 纯净引用和重构工具

## 概述

Figma PureRef是一个专业的Figma插件，用于清理和优化设计文件。它提供文件分析、清理工具、重构工具和性能优化功能，帮助设计师保持设计文件的整洁和高效。

## 功能特性

### 文件分析
- 分析文件结构
- 统计元素数量
- 识别问题区域
- 性能评估报告

### 清理工具
- 删除空图层
- 删除隐藏图层
- 删除未使用组件
- 删除重复样式
- 删除孤立节点
- 删除零尺寸元素

### 重构工具
- 重命名图层
- 组织结构
- 创建组件
- 统一样式
- 优化图片
- 清理文本

### 性能优化
- 优化图片质量
- 合并相似样式
- 简化图层
- 节省内存
- 提升加载速度

### 备份与恢复
- 创建文件备份
- 恢复备份文件
- 备份历史管理
- 自动备份设置

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 分析文件

1. 在Figma中打开要分析的文件
2. 打开Figma PureRef插件
3. 点击"分析文件"按钮
4. 查看分析结果和问题列表

### 运行清理

1. 在插件中选择清理类型（空图层、隐藏图层等）
2. 点击"运行清理"按钮
3. 查看清理结果和影响的元素数量

### 运行全部清理

1. 在插件中点击"运行全部清理"
2. 等待所有清理操作完成
3. 查看总清理结果

### 应用重构

1. 在插件中选择重构类型（重命名、组织、创建组件等）
2. 点击"应用重构"按钮
3. 查看重构结果和影响的元素

### 优化性能

1. 在插件中点击"优化性能"
2. 等待优化操作完成
3. 查看优化结果和性能提升

### 创建备份

1. 在插件中点击"创建备份"
2. 备份将自动创建
3. 查看备份名称和创建时间

### 恢复备份

1. 在插件中选择要恢复的备份
2. 点击"恢复备份"按钮
3. 文件将恢复到备份状态

## 清理类型

### 空图层
删除所有不包含任何内容的图层和框架。

### 隐藏图层
删除所有被隐藏的图层。

### 未使用组件
删除所有未被使用的组件和实例。

### 重复样式
合并所有重复的样式定义。

### 孤立节点
删除所有没有父节点的孤立元素。

### 零尺寸元素
删除所有宽高为0的元素。

## 重构类型

### 重命名图层
根据类型和内容重命名图层，提高可读性。

### 组织结构
按逻辑组织图层结构，创建清晰的层次。

### 创建组件
将重复的元素转换为组件，提高复用性。

### 统一样式
统一相似元素的样式，提高一致性。

### 优化图片
优化图片质量和尺寸，提高性能。

### 清理文本
清理文本样式和格式，提高一致性。

## 开发

### 项目结构

```
Figma-PureRef/
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

- **自动分析**：启用自动文件分析
- **自动清理**：启用自动清理操作
- **备份频率**：设置自动备份频率
- **清理级别**：设置清理的严格程度

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `analyze-file`: 分析文件
- `run-cleanup`: 运行清理
- `run-cleanup-all`: 运行全部清理
- `apply-refactor`: 应用重构
- `optimize-performance`: 优化性能
- `create-backup`: 创建备份
- `restore-backup`: 恢复备份
- `load-backup-history`: 加载备份历史
- `delete-backup`: 删除备份
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
