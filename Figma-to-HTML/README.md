# Figma to HTML

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 将Figma设计转换为HTML代码

## 概述

Figma to HTML是一个功能强大的Figma插件，用于将Figma设计转换为HTML代码。它支持多种导出格式，包括纯HTML、React组件、Vue组件等，并提供代码生成选项和优化功能。

## 功能特性

### 导出格式
- 纯HTML
- HTML + CSS
- React组件
- Vue组件
- Tailwind CSS
- Bootstrap

### 代码生成选项
- 语义化标签
- 响应式设计
- CSS变量
- 类名优化
- 内联样式
- 图片优化

### 设计分析
- 分析元素数量
- 评估代码复杂度
- 推荐框架
- 估算代码行数

### 代码优化
- 移除未使用的CSS
- 合并相似样式
- 优化图片
- 减少代码大小
- 提升性能

### 代码预览
- 实时代码预览
- 多格式切换
- 代码高亮
- 一键复制

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 生成HTML代码

1. 在Figma中选择要导出的元素
2. 打开Figma to HTML插件
3. 选择导出格式（HTML、React、Vue等）
4. 选择代码生成选项
5. 点击"生成代码"按钮

### 预览代码

1. 选择要导出的元素
2. 在插件中选择导出格式
3. 点击"预览代码"按钮
4. 查看生成的代码预览

### 复制代码

1. 选择要导出的元素
2. 在插件中选择导出格式
3. 点击"复制代码"按钮
4. 代码将复制到剪贴板

### 下载代码

1. 选择要导出的元素
2. 在插件中选择导出格式
3. 选择下载格式（ZIP或文件夹）
4. 点击"下载"按钮
5. 代码文件将自动下载

### 分析设计

1. 在Figma中选择要分析的元素
2. 在插件中点击"分析设计"
3. 查看分析结果和统计信息

### 优化代码

1. 生成代码后，在插件中点击"优化代码"
2. 查看优化结果和改进建议

## 导出格式

### 纯HTML
导出为纯HTML文件，适合简单的静态页面。

### HTML + CSS
导出为HTML和CSS分离的文件，适合维护和复用。

### React组件
导出为React组件，包含JSX和CSS，适合React项目。

### Vue组件
导出为Vue组件，包含模板、脚本和样式，适合Vue项目。

### Tailwind CSS
导出为使用Tailwind CSS的HTML，适合快速开发。

### Bootstrap
导出为使用Bootstrap的HTML，适合快速原型开发。

## 代码生成选项

### 语义化标签
使用语义化HTML标签（header、main、section等）。

### 响应式设计
生成响应式CSS代码，支持不同屏幕尺寸。

### CSS变量
使用CSS变量管理颜色和样式，便于主题切换。

### 类名优化
生成简洁的类名，提高代码可读性。

### 内联样式
使用内联样式而非外部CSS，适合单文件导出。

### 图片优化
优化图片导出和引用，提高加载性能。

## 开发

### 项目结构

```
Figma-to-HTML/
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

- **默认导出格式**：选择默认导出格式
- **默认代码选项**：设置默认代码生成选项
- **自动优化**：启用自动代码优化
- **代码格式化**：设置代码格式化选项

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `generate-code`: 生成代码
- `preview-code`: 预览代码
- `copy-code`: 复制代码
- `download-code`: 下载代码
- `analyze-design`: 分析设计
- `optimize-code`: 优化代码
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
