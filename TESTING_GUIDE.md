# Figma 插件测试指南

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> YYC³ Team Figma插件测试指南 - 全面验证所有插件功能

## 概述

本指南提供了全面的 Figma 插件测试方法，帮助您验证工作区所有插件是否可以正常使用。涵盖了从基础加载测试到功能验证、性能测试和问题排查的完整流程。

## 测试方法

### 方法一：在 Figma 中加载插件测试

#### 1.1 打开 Figma
- 启动 Figma 应用
- 登录您的账户
- 创建新的设计文件或打开现有文件

#### 1.2 加载单个插件

**步骤：**
1. 在 Figma 中，点击右上角的 **"Resources"**（资源）图标
2. 选择 **"Plugins"**（插件）选项卡
3. 点击 **"Development"**（开发）子选项卡
4. 找到 **"Import plugin from manifest..."**（从清单导入插件）
5. 导航到插件目录，选择 `manifest.json` 文件
6. 插件将自动加载到 Figma

**测试插件：**
1. 按 `Cmd + /`（Mac）或 `Ctrl + /`（Windows）打开插件
2. 检查插件UI是否正常显示
3. 测试插件的主要功能
4. 查看控制台是否有错误信息

#### 1.3 批量加载插件

**使用 Figma CLI 工具：**

```bash
# 安装 Figma CLI
npm install -g @figma/cli

# 批量加载插件
cd /Users/yanyu/Figma-Plugins

# 加载所有插件
for dir in Figma-*/; do
  if [ -f "$dir/manifest.json" ]; then
    echo "加载插件: $dir"
    figma plugin:install "$dir/manifest.json"
  fi
done
```

### 方法二：本地开发模式测试

#### 2.1 使用 Figma 开发者模式

**步骤：**
1. 在 Figma 中，右键点击插件图标
2. 选择 **"Open in Figma"**（在 Figma 中打开）
3. 这将以开发模式打开插件，支持热重载

**热重载测试：**
1. 修改 `code.ts` 或 `ui.html` 文件
2. 保存文件
3. 在 Figma 中按 `Cmd + R`（Mac）或 `Ctrl + R`（Windows）
4. 插件将自动重新加载

#### 2.2 使用浏览器开发者工具

**步骤：**
1. 打开插件 UI（右键插件 > "Open in Figma"）
2. 在插件窗口中，右键点击并选择 **"Inspect"**（检查）
3. 打开开发者工具的控制台
4. 查看是否有 JavaScript 错误或警告

### 方法三：自动化测试

#### 3.1 创建测试脚本

创建 `test-plugins.sh` 文件：

```bash
#!/bin/bash

echo "开始测试 Figma 插件..."

# 插件列表
plugins=(
  "Figma-Content-Reel"
  "Figma-Design Lint"
  "Figma-EX"
  "Figma-Figmotion"
  "Figma-Gleef"
  "Figma-Grid-Guide"
  "Figma-Magician"
  "Figma-Able"
  "Figma-Auto-Layout-Pro"
  "Figma-Autoflow"
  "Figma-CN"
  "Figma-Parrot"
  "Fifma-Image-Palette"
  "Figma-PureRef"
  "Figma-Redlines"
  "Figma-html.to.design"
  "Figma-to-HTML"
  "Figma-Remove-BG"
  "Figma-Plugins"
  "Figma-Postgres"
  "Figma-Check"
  "Figma-Code"
)

# 检查每个插件的 manifest.json
for plugin in "${plugins[@]}"; do
  manifest_path="$plugin/manifest.json"
  
  if [ -f "$manifest_path" ]; then
    echo "✅ $plugin - manifest.json 存在"
    
    # 检查必需字段
    if grep -q '"name"' "$manifest_path" && \
       grep -q '"id"' "$manifest_path" && \
       grep -q '"api"' "$manifest_path" && \
       grep -q '"main"' "$manifest_path"; then
      echo "   ✅ manifest.json 格式正确"
    else
      echo "   ❌ manifest.json 格式不正确"
    fi
    
    # 检查必需文件
    if [ -f "$plugin/code.ts" ] && [ -f "$plugin/ui.html" ]; then
      echo "   ✅ 必需文件存在"
    else
      echo "   ❌ 缺少必需文件"
    fi
  else
    echo "❌ $plugin - 不存在"
  fi
done

echo "测试完成！"
```

运行测试脚本：

```bash
chmod +x test-plugins.sh
./test-plugins.sh
```

### 方法四：功能测试清单

#### 4.1 通用功能测试

**每个插件都应该测试：**

- [ ] **插件加载**
  - [ ] 插件可以成功加载到 Figma
  - [ ] 插件图标正确显示
  - [ ] 插件名称正确显示

- [ ] **UI 显示**
  - [ ] 插件 UI 正确打开
  - [ ] 所有按钮和控件可见
  - [ ] 布局正确，无错位
  - [ ] 文本可读，无乱码

- [ ] **基本功能**
  - [ ] 主要按钮可以点击
  - [ ] 输入框可以输入
  - [ ] 下拉菜单可以选择
  - [ ] 切换开关可以切换

- [ ] **错误处理**
  - [ ] 无选择时显示提示
  - [ ] 错误时显示友好消息
  - [ ] 不会导致 Figma 崩溃

#### 4.2 特定插件功能测试

**设计工具插件：**
- [ ] Figma Content Reel - 可以填充文本内容
- [ ] Figma Content Reel - 可以插入图片
- [ ] Figma Design Lint - 可以运行设计检查
- [ ] Figma Figmotion - 可以创建动画
- [ ] Figma Gleef - 可以应用效果
- [ ] Figma Grid Guide - 可以创建网格
- [ ] Figma Magician - 可以生成建议
- [ ] Figma Able - 可以检查可访问性
- [ ] Figma Autoflow - 可以创建流程图
- [ ] Fifma Image Palette - 可以提取颜色

**开发工具插件：**
- [ ] Figma html.to.design - 可以导入 HTML
- [ ] Figma to HTML - 可以导出 HTML 代码

**效率工具插件：**
- [ ] Figma EX - 可以使用扩展工具
- [ ] Figma Auto Layout Pro - 可以应用布局
- [ ] Figma CN - 可以使用中文功能
- [ ] Figma Parrot - 可以复制元素
- [ ] Figma PureRef - 可以清理文件
- [ ] Figma Remove BG - 可以移除背景

**协作工具插件：**
- [ ] Figma Redlines - 可以添加标注

**管理工具插件：**
- [ ] Figma Plugins Manager - 可以搜索插件
- [ ] Figma Plugins Manager - 可以安装/卸载插件

**PostgreSQL 插件：**
- [ ] Figma Postgres - 可以可视化数据库
- [ ] Figma Check - 可以验证模式
- [ ] Figma Code - 可以生成代码

### 方法五：调试技巧

#### 5.1 查看控制台输出

**在 Figma 中：**
1. 打开插件
2. 右键点击插件窗口
3. 选择 **"Inspect"**（检查）
4. 在开发者工具中，切换到 **Console**（控制台）选项卡
5. 查看错误和警告信息

**常见错误类型：**
- `TypeError` - 类型错误
- `ReferenceError` - 引用错误
- `NetworkError` - 网络错误
- `PermissionError` - 权限错误

#### 5.2 使用 console.log 调试

在 `code.ts` 中添加调试日志：

```typescript
console.log('插件已加载');
console.log('当前选择:', figma.currentPage.selection);
console.log('插件消息:', msg);
```

#### 5.3 使用 Figma UI API 调试

```typescript
// 显示通知
figma.notify('插件消息', {
  timeout: 3000
});

// 显示错误
figma.notify('错误消息', {
  error: true
});

// 关闭插件
figma.closePlugin();
```

### 方法六：性能测试

#### 6.1 测试插件性能

**检查点：**
- [ ] 插件加载时间 < 2 秒
- [ ] UI 响应时间 < 500ms
- [ ] 大型文件处理不卡顿
- [ ] 内存使用合理

**性能优化建议：**
- 使用 `figma.clientStorage` 缓存数据
- 避免频繁的 DOM 操作
- 使用 Web Workers 处理复杂计算
- 优化图片处理

#### 6.2 测试插件兼容性

**测试场景：**
- [ ] 在不同 Figma 版本中测试
- [ ] 在不同操作系统中测试（Mac、Windows）
- [ ] 在不同浏览器中测试（Chrome、Safari）
- [ ] 测试离线功能

### 测试报告模板

创建测试报告文档 `TESTING_REPORT.md`：

```markdown
# Figma 插件测试报告

**测试日期：** 2025-01-30
**测试人员：** YYC³ Team
**Figma 版本：** 最新版本

## 测试结果

### 设计工具

| 插件 | 加载 | UI 显示 | 基本功能 | 错误处理 | 备注 |
|------|------|----------|----------|------|
| Figma Content Reel | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Design Lint | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Figmotion | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Gleef | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Grid Guide | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Magician | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Able | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Autoflow | ✅ | ✅ | ✅ | ✅ | 正常 |
| Fifma Image Palette | ✅ | ✅ | ✅ | ✅ | 正常 |

### 开发工具

| 插件 | 加载 | UI 显示 | 基本功能 | 错误处理 | 备注 |
|------|------|----------|----------|------|
| Figma html.to.design | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma to HTML | ✅ | ✅ | ✅ | ✅ | 正常 |

### 效率工具

| 插件 | 加载 | UI 显示 | 基本功能 | 错误处理 | 备注 |
|------|------|----------|----------|------|
| Figma EX | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Auto Layout Pro | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma CN | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Parrot | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma PureRef | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Remove BG | ✅ | ✅ | ✅ | ✅ | 正常 |

### 协作工具

| 插件 | 加载 | UI 显示 | 基本功能 | 错误处理 | 备注 |
|------|------|----------|----------|------|
| Figma Redlines | ✅ | ✅ | ✅ | ✅ | 正常 |

### 管理工具

| 插件 | 加载 | UI 显示 | 基本功能 | 错误处理 | 备注 |
|------|------|----------|----------|------|
| Figma Plugins Manager | ✅ | ✅ | ✅ | ✅ | 正常 |

### PostgreSQL 生态系统

| 插件 | 加载 | UI 显示 | 基本功能 | 错误处理 | 备注 |
|------|------|----------|----------|------|
| Figma Postgres | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Check | ✅ | ✅ | ✅ | ✅ | 正常 |
| Figma Code | ✅ | ✅ | ✅ | ✅ | 正常 |

## 问题总结

### 发现的问题

1. **问题描述**
   - 严重性：高/中/低
   - 影响范围：所有用户/部分用户
   - 复现步骤

2. **解决方案**
   - 修复方案
   - 负责人
   - 预计完成时间

## 建议改进

1. **性能优化**
   - 具体建议

2. **用户体验改进**
   - 具体建议

3. **功能增强**
   - 具体建议
```

### 快速测试命令

创建快速测试脚本 `quick-test.sh`：

```bash
#!/bin/bash

echo "快速测试 Figma 插件..."

# 检查 manifest.json 文件
find . -name "manifest.json" -type f | while read file; do
  echo "检查: $file"
  if jq -e '.name' "$file" > /dev/null 2>&1; then
    echo "  ✅ 名称: $(jq -r '.name' "$file")"
  else
    echo "  ❌ JSON 格式错误"
  fi
done

# 检查必需文件
echo ""
echo "检查必需文件..."
for dir in Figma-*/; do
  if [ -d "$dir" ]; then
    echo ""
    echo "插件: $dir"
    [ -f "$dir/manifest.json" ] && echo "  ✅ manifest.json" || echo "  ❌ 缺少 manifest.json"
    [ -f "$dir/code.ts" ] && echo "  ✅ code.ts" || echo "  ❌ 缺少 code.ts"
    [ -f "$dir/ui.html" ] && echo "  ✅ ui.html" || echo "  ❌ 缺少 ui.html"
    [ -f "$dir/code.js" ] && echo "  ✅ code.js" || echo "  ⚠️  缺少 code.js（需要编译）"
  fi
done

echo ""
echo "快速测试完成！"
```

运行快速测试：

```bash
chmod +x quick-test.sh
./quick-test.sh
```

### 测试最佳实践

1. **逐步测试**：一次测试一个插件，确保功能正常
2. **记录问题**：详细记录发现的问题和解决方案
3. **版本控制**：在测试前提交代码，测试后回滚
4. **多环境测试**：在不同设备和网络环境下测试
5. **用户测试**：邀请团队成员测试插件

### 常见问题排查

**问题 1：插件无法加载**

**可能原因：**
- manifest.json 格式错误
- 缺少必需文件
- API 版本不兼容

**解决方案：**
```bash
# 检查 manifest.json 格式
jq '.' plugin/manifest.json

# 检查必需文件
ls -la plugin/
```

**问题 2：UI 显示异常**

**可能原因：**
- HTML/CSS 语法错误
- 资源文件路径错误
- 样式冲突

**解决方案：**
- 检查浏览器控制台错误
- 验证资源文件路径
- 检查 CSS 选择器优先级

**问题 3：功能不工作**

**可能原因：**
- JavaScript 错误
- API 使用错误
- 权限不足

**解决方案：**
- 添加详细的错误日志
- 检查 Figma API 文档
- 验证权限配置

## 附录

### A. 插件文件结构

每个 Figma 插件应包含以下文件：

```
plugin-name/
├── manifest.json       # 插件配置（必需）
├── package.json       # 项目依赖（必需）
├── tsconfig.json      # TypeScript 配置（必需）
├── code.ts          # 插件主逻辑（必需）
├── code.js          # 编译后的 JavaScript（必需）
├── ui.html          # 用户界面（必需）
└── README.md        # 插件文档（推荐）
```

### B. manifest.json 必需字段

```json
{
  "name": "插件名称",
  "id": "插件ID",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figma"],
  "permissions": ["document"]
}
```

### C. 测试检查清单

**文件完整性：**
- [ ] 所有插件目录存在
- [ ] 所有 manifest.json 文件有效
- [ ] 所有 code.ts 文件存在
- [ ] 所有 ui.html 文件存在
- [ ] 所有 code.js 文件存在

**功能完整性：**
- [ ] 所有插件可以加载
- [ ] 所有插件 UI 正常显示
- [ ] 所有插件基本功能正常
- [ ] 所有插件错误处理正常

**文档完整性：**
- [ ] 所有插件有 README.md
- [ ] 所有 README 包含使用说明
- [ ] 所有 README 包含功能列表

### D. 性能基准

**加载时间：**
- 优秀：< 500ms
- 良好：500ms - 1s
- 可接受：1s - 2s
- 需要优化：> 2s

**UI 响应时间：**
- 优秀：< 100ms
- 良好：100ms - 300ms
- 可接受：300ms - 500ms
- 需要优化：> 500ms

---

<div align="center">

> **YanYuCloudCube**
> **言启象限 | 语枢未来**
> **Words Initiate Quadrants, Language Serves as Core for Future**

> **万象归元于云枢 | 深栈智启新纪元**
> **All things converge in cloud pivot; Deep stacks ignite a new era of intelligence**

</div>
