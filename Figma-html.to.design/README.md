# Figma html.to.design

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> HTML到设计的转换工具

## 概述

Figma html.to.design是一个强大的Figma插件，用于将HTML代码转换为Figma设计。它帮助设计师和开发者将网页设计快速导入Figma，支持完整的HTML解析和样式转换。

## 功能特性

### HTML解析
- 完整的HTML解析
- CSS样式转换
- JavaScript处理
- 响应式设计支持

### 元素映射
- HTML元素到Figma元素映射
- 样式属性转换
- 文本内容提取
- 图片资源处理

### 样式转换
- CSS到Figma样式转换
- 内联样式处理
- 外部样式表处理
- CSS变量支持

### 响应式支持
- 媒体查询处理
- 断点管理
- 响应式预览
- 多设备预览

### 导入选项
- 从URL导入
- 从文件导入
- 从剪贴板导入
- 批量导入

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 从URL导入

1. 打开Figma html.to.design插件
2. 选择"从URL导入"选项
3. 输入网页URL
4. 点击"导入"按钮
5. 网页将自动转换为Figma设计

### 从文件导入

1. 在插件中选择"从文件导入"选项
2. 选择HTML文件
3. 点击"导入"按钮
4. HTML文件将自动转换为Figma设计

### 从剪贴板导入

1. 复制HTML代码到剪贴板
2. 打开插件并选择"从剪贴板导入"
3. 点击"导入"按钮
4. HTML代码将自动转换为Figma设计

### 预览响应式设计

1. 导入HTML后，在插件中启用"响应式预览"
2. 选择要预览的断点（移动端、平板端、桌面端）
3. 查看不同设备下的设计效果

## 支持的HTML元素

### 基础元素
- div, span, p, h1-h6
- a, img, ul, ol, li
- table, tr, td, th

### 表单元素
- input, textarea, select
- button, label, form
- checkbox, radio

### 语义元素
- header, nav, main
- section, article, aside
- footer, figure, figcaption

## 支持的CSS属性

### 布局属性
- display, position, float
- width, height, margin, padding
- flexbox, grid

### 文本属性
- font-family, font-size, font-weight
- color, text-align, line-height
- text-decoration, text-transform

### 背景属性
- background-color, background-image
- background-position, background-size
- background-repeat

### 边框属性
- border, border-radius
- box-shadow, outline

## 开发

### 项目结构

```
Figma-html.to.design/
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

- **默认导入方式**：选择默认导入方式
- **样式转换模式**：选择样式转换模式
- **响应式断点**：设置响应式断点
- **自动优化**：启用自动设计优化

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `import-from-url`: 从URL导入
- `import-from-file`: 从文件导入
- `import-from-clipboard`: 从剪贴板导入
- `parse-html`: 解析HTML
- `convert-styles`: 转换样式
- `preview-responsive`: 预览响应式设计
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
