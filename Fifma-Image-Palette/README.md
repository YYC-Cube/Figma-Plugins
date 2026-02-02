# Figma Image Palette

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 从图片提取颜色和创建调色板的工具

## 概述

Figma Image Palette是一个强大的Figma插件，可以从选定的图片中提取颜色并创建专业的调色板。它支持多种颜色提取算法和调色板格式，帮助设计师快速建立色彩系统。

## 功能特性

### 颜色提取

- 从选定的图片中提取主色调
- 支持多种提取算法（平均色、主色调、流行色等）
- 智能识别图片中的颜色分布
- 实时预览提取结果

### 调色板创建

- 创建5色、8色、10色调色板
- 支持自定义调色板大小
- 自动生成颜色变体
- 智能颜色排序和分组

### 颜色格式

- 支持HEX、RGB、HSL、CMYK格式
- 颜色代码一键复制
- 支持Tailwind CSS颜色格式
- 支持Material Design颜色规范

### 调色板导出

- 导出为CSS变量
- 导出为JSON格式
- 导出为图片
- 支持多种命名规范

### 颜色分析

- 颜色对比度分析
- 颜色和谐度检查
- 色彩心理学建议
- 无障碍性评估

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 提取颜色

1. 在Figma中选择一张图片
2. 打开Figma Image Palette插件
3. 选择提取算法和调色板大小
4. 点击"提取颜色"按钮
5. 查看提取的调色板

### 创建调色板

1. 提取颜色后，点击"创建调色板"
2. 选择调色板格式和命名规范
3. 调整颜色顺序和分组
4. 点击"创建"生成调色板

### 导出调色板

1. 选择要导出的调色板
2. 选择导出格式（CSS、JSON、图片）
3. 点击"导出"按钮
4. 文件将自动下载

### 复制颜色代码

1. 在调色板中选择颜色
2. 点击颜色卡片
3. 颜色代码将复制到剪贴板
4. 可以直接粘贴到代码中

## 提取算法

### 平均色算法

计算图片中所有像素的平均颜色，适合提取整体色调。

### 主色调算法

使用K-means聚类算法识别图片中的主要颜色，适合提取代表性颜色。

### 流行色算法

基于颜色频率和分布提取最常用的颜色，适合提取品牌色。

### 智能提取

结合多种算法，智能选择最佳颜色组合，适合创建平衡的调色板。

## 颜色格式

### HEX格式

十六进制颜色代码，Web开发中最常用的格式。

### RGB格式

红绿蓝三原色格式，适合CSS和设计软件。

### HSL格式

色相、饱和度、亮度格式，便于颜色调整。

### CMYK格式

印刷行业使用的青、品红、黄、黑格式。

## 开发

### 项目结构

```
Fifma-Image-Palette/
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

- **默认提取算法**：选择颜色提取算法
- **默认调色板大小**：设置调色板的颜色数量
- **默认颜色格式**：选择颜色代码格式
- **自动创建调色板**：启用自动调色板创建

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `extract-colors`: 从选定图片提取颜色
- `create-palette`: 创建调色板
- `export-palette`: 导出调色板
- `copy-color`: 复制颜色代码
- `analyze-colors`: 分析颜色
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
