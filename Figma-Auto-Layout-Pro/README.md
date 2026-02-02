# Figma Auto Layout Pro

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 高级自动布局工具

## 概述

Figma Auto Layout Pro是一个功能强大的Figma插件，提供高级自动布局功能，帮助设计师快速创建响应式和自适应的设计。它扩展了Figma原生自动布局功能，提供更多灵活性和控制选项。

## 功能特性

### 布局预设
- 常用布局模板（卡片、列表、网格等）
- 一键应用布局预设
- 自定义布局模板
- 布局模板导入/导出

### 智能布局规则
- 自动间距计算
- 智能对齐建议
- 响应式断点设置
- 布局约束管理

### 响应式布局
- 多断点支持
- 自适应容器
- 流式布局
- 弹性间距

### 布局模板
- 卡片布局
- 列表布局
- 网格布局
- 导航布局
- 表单布局

### 高级功能
- 嵌套布局管理
- 布局继承
- 布局变体
- 布局动画

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 应用布局预设

1. 在Figma中选择要应用布局的元素
2. 打开Figma Auto Layout Pro插件
3. 从预设列表中选择布局
4. 点击"应用布局"按钮
5. 调整布局参数

### 创建自定义布局

1. 选择元素并打开插件
2. 点击"创建自定义布局"
3. 设置布局参数（方向、间距、对齐等）
4. 保存为自定义模板
5. 可以重复使用

### 设置响应式布局

1. 选择容器元素
2. 在插件中启用"响应式布局"
3. 添加断点和布局规则
4. 预览不同屏幕尺寸的效果
5. 调整布局参数

### 管理嵌套布局

1. 选择包含嵌套布局的元素
2. 在插件中查看布局层级
3. 调整嵌套布局的参数
4. 应用布局继承规则
5. 预览整体效果

## 布局类型

### 卡片布局
适合展示内容卡片，支持自动调整卡片大小和间距。

### 列表布局
适合创建垂直或水平列表，支持动态添加和删除项目。

### 网格布局
适合创建多列网格，支持响应式列数和间距。

### 导航布局
适合创建导航栏，支持自动对齐和间距。

### 表单布局
适合创建表单，支持自动对齐标签和输入框。

## 响应式断点

### 移动端
- 宽度：< 768px
- 单列布局
- 紧凑间距

### 平板端
- 宽度：768px - 1024px
- 双列布局
- 标准间距

### 桌面端
- 宽度：> 1024px
- 多列布局
- 宽松间距

## 开发

### 项目结构

```
Figma-Auto-Layout-Pro/
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

- **默认布局方向**：选择水平或垂直布局
- **默认间距**：设置默认间距值
- **默认对齐**：选择默认对齐方式
- **自动响应式**：启用自动响应式布局

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `apply-layout-preset`: 应用布局预设
- `create-custom-layout`: 创建自定义布局
- `set-responsive-layout`: 设置响应式布局
- `manage-nested-layouts`: 管理嵌套布局
- `add-breakpoint`: 添加断点
- `remove-breakpoint`: 移除断点
- `save-layout-template`: 保存布局模板
- `load-layout-template`: 加载布局模板
- `export-layout-templates`: 导出布局模板
- `import-layout-templates`: 导入布局模板
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
