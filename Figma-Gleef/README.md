# Figma Gleef

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 创意效果和滤镜工具

## 概述

Figma Gleef是一个功能丰富的Figma插件，提供多种创意效果和滤镜。它帮助设计师为设计添加视觉效果，包括模糊、阴影、发光、渐变等效果。

## 功能特性

### 模糊效果
- 高斯模糊
- 动态模糊
- 径向模糊
- 智能模糊

### 阴影效果
- 投影
- 内阴影
- 文字阴影
- 多层阴影

### 发光效果
- 外发光
- 内发光
- 彩色发光
- 动态发光

### 渐变效果
- 线性渐变
- 径向渐变
- 角度渐变
- 多色渐变

### 其他效果
- 噪点效果
- 纹理效果
- 扭曲效果
- 色彩调整

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 应用模糊效果

1. 在Figma中选择要应用效果的元素
2. 打开Figma Gleef插件
3. 选择"模糊效果"类别
4. 选择模糊类型（高斯、动态、径向等）
5. 调整模糊参数（半径、角度等）
6. 点击"应用效果"按钮

### 应用阴影效果

1. 选择要添加阴影的元素
2. 在插件中选择"阴影效果"类别
3. 选择阴影类型（投影、内阴影等）
4. 调整阴影参数（颜色、偏移、模糊等）
5. 点击"应用效果"按钮

### 应用发光效果

1. 选择要添加发光的元素
2. 在插件中选择"发光效果"类别
3. 选择发光类型（外发光、内发光等）
4. 调整发光参数（颜色、大小、模糊等）
5. 点击"应用效果"按钮

### 应用渐变效果

1. 选择要应用渐变的元素
2. 在插件中选择"渐变效果"类别
3. 选择渐变类型（线性、径向等）
4. 设置渐变颜色和角度
5. 点击"应用效果"按钮

## 效果类型

### 模糊效果
为元素添加模糊效果，创造柔和的视觉效果。

### 阴影效果
为元素添加阴影，增加深度和层次感。

### 发光效果
为元素添加发光效果，创造光晕和光晕效果。

### 渐变效果
为元素添加渐变，创造丰富的色彩过渡。

### 噪点效果
为元素添加噪点，创造纹理和质感。

## 开发

### 项目结构

```
Figma-Gleef/
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

- **默认效果强度**：设置默认效果强度
- **效果预设**：启用效果预设
- **实时预览**：启用效果实时预览
- **效果历史**：保存效果历史记录

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `apply-blur`: 应用模糊效果
- `apply-shadow`: 应用阴影效果
- `apply-glow`: 应用发光效果
- `apply-gradient`: 应用渐变效果
- `apply-noise`: 应用噪点效果
- `apply-distortion`: 应用扭曲效果
- `apply-color-adjustment`: 应用色彩调整
- `save-effect-preset`: 保存效果预设
- `load-effect-preset`: 加载效果预设
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
