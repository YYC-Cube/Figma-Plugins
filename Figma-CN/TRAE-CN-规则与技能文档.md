# TRAE-CN 更新规则与技能设置文档

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

**更新时间：** 2026-01-31  
**版本：** v2.0

---

## 目录

1. [核心规则更新](#核心规则更新)
2. [技能系统配置](#技能系统配置)
3. [高效工作方法](#高效工作方法)
4. [快捷键与命令](#快捷键与命令)
5. [插件冲突排查](#插件冲突排查)
6. [性能优化指南](#性能优化指南)
7. [快速参考表](#快速参考表)

---

## 核心规则更新

### 1.1 代码规范

#### TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "lib": ["es2020", "dom"],
    "strict": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  }
}
```

**关键变更：**

- ✅ 添加 `dom` 到 `lib` 以支持浏览器 API
- ✅ 设置 `strict: false` 降低类型检查严格度
- ✅ 启用 `skipLibCheck` 跳过库文件检查

#### 代码风格

- 使用 2 空格缩进
- 使用单引号
- 行尾使用 LF
- 文件末尾保留空行

### 1.2 项目结构

```
Figma-Plugins/
├── figma-postgres-shared/     # 共享模块库
├── figma-postgres-plugin/     # 主插件
├── figma-postgres/            # 设计可视化器
├── figma-postgres-check/      # 检查插件
└── figma-postgres-Code/       # 代码生成器
```

**规则：**

- 共享代码放在 `figma-postgres-shared`
- 每个插件独立维护 `manifest.json`
- 避免循环依赖

### 1.3 依赖管理

#### 共享库配置

```json
{
  "name": "figma-postgres-shared",
  "private": true,
  "main": "index.ts"
}
```

**注意：**

- 使用 `private: true` 防止误发布
- 导出统一从 `index.ts` 管理

#### 插件依赖

```json
{
  "dependencies": {},
  "devDependencies": {
    "@figma/plugin-typings": "*",
    "typescript": "^5.3.2"
  }
}
```

**关键：**

- 运行时依赖为空（共享库通过编译后使用）
- 仅保留开发依赖

---

## 技能系统配置

### 2.1 技能结构

```
.trae/
└── skills/
    ├── trae-cn-doc-generator/
    │   └── SKILL.md
    └── [其他技能...]
```

### 2.2 技能元数据

```yaml
---
name: "skill-name"
description: "技能描述，包含功能和触发条件"
---
```

**描述要求：**

- ✅ 说明技能做什么
- ✅ 明确何时调用
- ✅ 长度 < 200 字符
- ✅ 使用英文（除非指定其他语言）

### 2.3 技能创建流程

1. **识别需求** - 确定用户需要什么技能
2. **创建目录** - `mkdir -p .trae/skills/<skill-name>/`
3. **编写 SKILL.md** - 包含 frontmatter 和详细说明
4. **验证结构** - 确保格式正确

### 2.4 技能使用

**自动触发：**

- 系统根据描述自动选择技能
- 用户请求匹配技能功能时调用

**手动触发：**

- 用户明确指定技能名称
- 通过命令行参数指定

---

## 高效工作方法

### 3.1 插件开发流程

#### 阶段 1：准备（2 分钟）

```bash
# 1. 创建项目目录
mkdir -p figma-postgres-plugin

# 2. 初始化配置
npm init -y

# 3. 创建基础文件
touch code.ts ui.html manifest.json
```

#### 阶段 2：开发（5-10 分钟）

```bash
# 1. 安装依赖
npm install @figma/plugin-typings typescript

# 2. 编写代码
vim code.ts

# 3. 实时编译
npm run watch
```

#### 阶段 3：测试（3 分钟）

```bash
# 1. 构建插件
npm run build

# 2. 创建 ZIP
zip -r plugin.zip manifest.json code.js ui.html

# 3. 上传到 Figma
# Plugins → Development → Import plugin from manifest...
```

### 3.2 调试技巧

#### 快速迭代

```typescript
// 添加日志
console.log('Debug: Variable value', variable);

// 使用 notify
figma.notify('Operation completed');

// 发送消息到 UI
figma.ui.postMessage({ type: 'debug', data: info });
```

#### 错误处理

```typescript
try {
  await riskyOperation();
} catch (error: any) {
  console.error('Error:', error);
  figma.notify(`Error: ${error.message}`);
  figma.ui.postMessage({
    type: 'error',
    data: { message: error.message }
  });
}
```

### 3.3 性能优化

#### 减少重渲染

```typescript
// ❌ 不推荐
figma.currentPage.children.forEach(child => {
  child.fills = [...];
});

// ✅ 推荐
const fills = [...];
figma.currentPage.children.forEach(child => {
  child.fills = fills;
});
```

#### 批量操作

```typescript
// 使用 Promise.all 并行处理
await Promise.all([
  processNode(node1),
  processNode(node2),
  processNode(node3)
]);
```

---

## 快捷键与命令

### 4.1 Figma 原生快捷键

| 功能 | macOS | Windows | 说明 |
|------|--------|---------|------|
| 打开插件 | `Cmd + /` | `Ctrl + /` | 打开插件面板 |
| 新建文本 | `T` | `T` | 创建文本图层 |
| 新建矩形 | `R` | `R` | 创建矩形 |
| 画笔工具 | `P` | `P` | 画笔工具 |
| 移动工具 | `V` | `V` | 选择工具 |
| 缩放 | `Cmd + +/-` | `Ctrl + +/-` | 缩放画布 |

### 4.2 常用命令行

```bash
# 构建项目
npm run build

# 监听模式
npm run watch

# 开发模式
npm run dev

# 清理缓存
rm -rf ~/Library/Application\ Support/Figma/

# 创建插件 ZIP
zip -r plugin.zip manifest.json code.js ui.html
```

### 4.3 终端快捷键

| 操作 | macOS | Windows | 说明 |
|------|--------|---------|------|
| 清屏 | `Cmd + K` | `Ctrl + L` | 清除终端内容 |
| 中断 | `Ctrl + C` | `Ctrl + C` | 停止当前命令 |
| 退出 | `Cmd + D` | `Ctrl + D` | 退出当前会话 |

---

## 插件冲突排查

### 5.1 快速诊断流程

#### 步骤 1：安全模式测试（30 秒）

```bash
# macOS
按住 Shift → 启动 Figma

# Windows
按住 Shift → 双击 Figma 图标
```

**判定标准：**

- ✅ 安全模式正常 → 插件冲突
- ❌ 安全模式异常 → 系统问题

#### 步骤 2：清理缓存（1 分钟）

```bash
# macOS
rm -rf "$HOME/Library/Application Support/Figma/"{Desktop,DesktopProfile}

# Windows
del "%appdata%\Figma\Desktop"
del "%appdata%\Figma\DesktopProfile"
```

#### 步骤 3：二分法定位（3 分钟）

```
1. 禁用所有插件
2. 启用前半组插件
3. 重启测试
4. 正常 → 冲突在后半组
5. 异常 → 冲突在前半组
6. 重复直至定位单个插件
```

### 5.2 常见冲突组合

| 冲突插件 | 解决方案 | 优先级 |
|----------|----------|---------|
| FigmaCN + 小众翻译 | 替换为 FigmaEX | 高 |
| 多个翻译插件 | 保留一个，卸载其他 | 高 |
| 自动布局插件 | 禁用冲突的布局功能 | 中 |
| AI 插件组合 | 检查 API 使用冲突 | 中 |

### 5.3 解决方案

#### 方案 1：更新插件

```
1. 打开 Figma Community
2. 搜索冲突插件
3. 点击"Update"
4. 重启 Figma
```

#### 方案 2：替换插件

```
1. 卸载冲突插件
2. 安装替代插件
3. 迁移配置（如有）
4. 测试功能
```

#### 方案 3：禁用功能

```
1. 打开插件设置
2. 禁用冲突功能
3. 保留核心功能
4. 保存配置
```

---

## 性能优化指南

### 6.1 插件优化

#### 减少插件数量

- 仅启用必需插件（3-5 个）
- 禁用自动启动功能
- 定期清理未使用插件

#### 优化插件配置

```typescript
// ❌ 不推荐
figma.on('selectionchange', () => {
  // 每次选择都执行
});

// ✅ 推荐
let lastSelection = [];
figma.on('selectionchange', () => {
  const current = figma.currentPage.selection;
  if (current !== lastSelection) {
    lastSelection = current;
    // 仅在真正变化时执行
  }
});
```

### 6.2 文件优化

#### 清理冗余

```bash
# 删除未使用的样式
选中空白区域 → 右键 → Delete

# 清理未使用的组件
Components 面板 → 右键 → Delete
```

#### 拆分大文件

```
1. 识别超大页面（> 1000 图层）
2. 创建新页面
3. 移动部分内容到新页面
4. 保持逻辑关联
```

### 6.3 系统优化

#### macOS

```bash
# 启用硬件加速
系统设置 → 隐私与安全性 → 硬件加速

# 清理缓存
rm -rf ~/Library/Caches/Figma
```

#### Windows

```
# 启用硬件加速
浏览器设置 → 系统 → 硬件加速

# 清理缓存
%LOCALAPPDATA%\Figma → 删除缓存文件夹
```

---

## 快速参考表

### 7.1 命令速查表

| 任务 | 命令 | 说明 |
|------|--------|------|
| 构建 | `npm run build` | 编译 TypeScript |
| 监听 | `npm run watch` | 实时编译 |
| 开发 | `npm run dev` | 完整开发模式 |
| 清理 | `rm -rf node_modules` | 删除依赖 |
| 安装 | `npm install` | 安装依赖 |
| 更新 | `npm update` | 更新依赖 |

### 7.2 文件结构速查

```
manifest.json      # 插件配置（必需）
code.js          # 编译后的插件代码（必需）
ui.html          # UI 界面（必需）
code.ts          # TypeScript 源码
package.json     # NPM 配置
tsconfig.json    # TypeScript 配置
```

### 7.3 常见问题 FAQ

#### Q1: 插件无法加载？

**A:** 检查 `manifest.json` 格式，确保 `main` 指向正确的 `.js` 文件。

#### Q2: 类型错误？

**A:** 运行 `npm install` 安装 `@figma/plugin-typings`。

#### Q3: 构建失败？

**A:** 检查 `tsconfig.json` 配置，确保 `moduleResolution: "node"`。

#### Q4: 插件冲突？

**A:** 使用安全模式测试，二分法定位冲突插件。

#### Q5: 性能卡顿？

**A:** 减少插件数量，禁用自动启动，清理缓存。

### 7.4 故障排除流程图

```
开始
  ↓
问题出现
  ↓
尝试快速修复（重启/清理缓存）
  ↓
问题解决？
  ├─ 是 → 完成
  └─ 否 → 进入安全模式
           ↓
         正常？
         ├─ 是 → 二分法定位插件
         └─ 否 → 系统问题（联系支持）
                  ↓
         定位到插件
           ↓
         更新/替换插件
           ↓
         测试验证
           ↓
         完成
```

---

## 附录

### A.1 推荐插件清单

| 插件名称 | 功能 | 兼容性 | 推荐度 |
|----------|------|---------|--------|
| FigmaCN | 界面汉化 | ⭐⭐⭐⭐⭐⭐ | 必装 |
| FigmaEX | 汉化+翻译 | ⭐⭐⭐⭐⭐ | 备选 |
| Gleef | AI 翻译 | ⭐⭐⭐⭐⭐ | 推荐 |
| Auto Layout Pro | 自动布局 | ⭐⭐⭐⭐ | 推荐 |
| Grid Guide | 栅格参考 | ⭐⭐⭐ | 可选 |

### A.2 最佳实践

1. **定期更新** - 保持插件和 Figma 最新
2. **按需安装** - 避免安装过多插件
3. **定期清理** - 清理缓存和未使用文件
4. **备份配置** - 重要配置定期导出备份
5. **监控性能** - 注意卡顿和异常行为

### A.3 联系支持

- **问题反馈：** Figma Community
- **文档查询：** 插件官方文档
- **社区讨论：** Figma Discord / Reddit

---

**文档结束**

*最后更新：2026-01-31*
*版本：v2.0*

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
