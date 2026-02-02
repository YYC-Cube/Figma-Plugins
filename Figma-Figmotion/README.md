# Figma Figmotion

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 动画创建和编辑工具

## 概述

Figma Figmotion是一个强大的Figma插件，用于创建和编辑动画。它帮助设计师在Figma中直接创建流畅的动画效果，支持关键帧动画、缓动函数和动画预览。

## 功能特性

### 关键帧动画
- 创建关键帧
- 编辑关键帧属性
- 关键帧时间轴管理
- 关键帧复制和粘贴

### 缓动函数
- 多种缓动函数选择
- 自定义缓动曲线
- 缓动预设库
- 缓动预览

### 动画属性
- 位置动画
- 旋转动画
- 缩放动画
- 透明度动画
- 颜色动画

### 动画预览
- 实时动画预览
- 播放控制
- 动画速度调整
- 动画循环播放

### 动画导出
- 导出为GIF
- 导出为视频
- 导出为Lottie
- 导出为CSS动画

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 创建关键帧动画

1. 在Figma中选择要动画化的元素
2. 打开Figma Figmotion插件
3. 点击"创建关键帧"按钮
4. 设置关键帧属性（位置、旋转、缩放等）
5. 添加更多关键帧创建动画

### 应用缓动函数

1. 选择要应用缓动的动画
2. 在插件中选择缓动函数
3. 调整缓动参数
4. 预览缓动效果

### 预览动画

1. 完成动画设置后
2. 点击"预览动画"按钮
3. 使用播放控制播放动画
4. 调整动画速度和循环

### 导出动画

1. 预览动画确认效果
2. 点击"导出动画"按钮
3. 选择导出格式（GIF、视频、Lottie、CSS）
4. 动画文件将自动下载

## 缓动函数

### 线性缓动
匀速动画，适合简单的过渡效果。

### 缓入
动画开始时较慢，适合进入效果。

### 缓出
动画结束时较慢，适合退出效果。

### 缓入缓出
动画开始和结束时都较慢，适合平滑过渡。

### 弹跳缓动
动画有弹跳效果，适合吸引注意力的效果。

### 弹性缓动
动画有弹性效果，适合物理模拟。

## 动画属性

### 位置
控制元素在X和Y轴上的移动。

### 旋转
控制元素的旋转角度。

### 缩放
控制元素的大小变化。

### 透明度
控制元素的透明度变化。

### 颜色
控制元素的颜色变化。

## 开发

### 项目结构

```
Figma-Figmotion/
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

- **默认缓动函数**：选择默认缓动函数
- **默认动画时长**：设置默认动画时长
- **自动预览**：启用自动动画预览
- **导出质量**：设置导出质量

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `create-keyframe`: 创建关键帧
- `edit-keyframe`: 编辑关键帧
- `delete-keyframe`: 删除关键帧
- `apply-easing`: 应用缓动函数
- `preview-animation`: 预览动画
- `play-animation`: 播放动画
- `pause-animation`: 暂停动画
- `stop-animation`: 停止动画
- `export-animation`: 导出动画
- `load-animation`: 加载动画
- `save-animation`: 保存动画
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
