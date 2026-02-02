# Figma Design Lint

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 设计规范检查和质量保证工具

## 概述

Figma Design Lint是一个全面的Figma插件，用于检查设计规范和质量。它帮助设计师和团队保持设计一致性，确保所有设计元素符合团队的设计系统规范。

## 功能特性

### 命名规范检查
- 图层命名规范检查
- 组件命名规范检查
- 样式命名规范检查
- 页面命名规范检查

### 颜色使用检查
- 颜色一致性检查
- 颜色对比度检查
- 颜色使用统计
- 颜色替代建议

### 文本样式检查
- 字体使用一致性
- 字体大小规范
- 文本对齐检查
- 文本行高检查

### 间距一致性检查
- 间距使用统计
- 间距一致性验证
- 间距规范建议
- 间距优化建议

### 组件使用检查
- 组件使用统计
- 组件实例检查
- 组件变体使用
- 组件覆盖检查

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 运行设计规范检查

1. 在Figma中选择要检查的元素
2. 打开Figma Design Lint插件
3. 选择检查类型（命名、颜色、文本、间距、组件）
4. 点击"运行检查"按钮
5. 查看检查结果和问题列表

### 检查命名规范

1. 选择要检查的图层或组件
2. 在插件中选择"命名规范"检查
3. 查看命名问题和建议
4. 根据建议重命名元素

### 检查颜色使用

1. 选择包含颜色的元素
2. 在插件中选择"颜色使用"检查
3. 查看颜色使用统计和问题
4. 根据建议调整颜色

### 检查文本样式

1. 选择文本元素
2. 在插件中选择"文本样式"检查
3. 查看字体使用和样式问题
4. 根据建议调整文本样式

### 检查间距一致性

1. 选择要检查的元素
2. 在插件中选择"间距一致性"检查
3. 查看间距使用统计和问题
4. 根据建议调整间距

## 检查类型

### 命名规范检查
检查图层、组件、样式等的命名是否符合团队规范。

### 颜色使用检查
检查颜色的使用是否一致，是否符合设计系统。

### 文本样式检查
检查文本的字体、大小、对齐等是否一致。

### 间距一致性检查
检查间距的使用是否一致，是否符合规范。

### 组件使用检查
检查组件的使用是否正确，是否有不必要的覆盖。

## 开发

### 项目结构

```
Figma-Design Lint/
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

- **命名规范**：设置命名规范规则
- **颜色规范**：设置颜色规范规则
- **文本规范**：设置文本规范规则
- **间距规范**：设置间距规范规则
- **自动检查**：启用自动设计规范检查

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `run-lint-check`: 运行设计规范检查
- `check-naming`: 检查命名规范
- `check-colors`: 检查颜色使用
- `check-text-styles`: 检查文本样式
- `check-spacing`: 检查间距一致性
- `check-components`: 检查组件使用
- `export-report`: 导出检查报告
- `fix-issue`: 修复设计规范问题
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

> **YanYuCloudCube**
> **言启象限 | 语枢未来**
> **Words Initiate Quadrants, Language Serves as Core for Future**

> **万象归元于云枢 | 深栈智启新纪元**
> **All things converge in cloud pivot; Deep stacks ignite a new era of intelligence**

</div>
