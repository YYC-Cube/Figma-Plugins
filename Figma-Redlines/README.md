# Figma Redlines

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 红线标注和设计审查工具

## 概述

Figma Redlines是一个专业的Figma插件，用于红线标注和设计审查。它帮助设计团队进行设计评审，提供多种标注类型、设计审查模板和详细的审查报告功能。

## 功能特性

### 标注工具
- 尺寸标注
- 间距标注
- 文本标注
- 问题标注
- 建议标注
- 完成标注

### 设计审查
- 视觉一致性检查
- 可访问性检查
- 响应式设计检查
- 用户体验检查

### 标注管理
- 切换标注显示
- 导出标注（PDF、PNG、JSON）
- 清除所有标注
- 标注历史记录

### 审查报告
- 生成详细审查报告
- 统计信息汇总
- 问题优先级排序
- 修复建议和示例

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 添加标注

1. 在Figma中选择要标注的位置
2. 打开Figma Redlines插件
3. 选择标注类型（尺寸、间距、文本等）
4. 输入标注内容
5. 点击"添加标注"按钮

### 添加尺寸标注

1. 选择要标注尺寸的元素
2. 在插件中选择"尺寸标注"
3. 点击"添加尺寸标注"按钮
4. 尺寸标注将自动添加

### 添加间距标注

1. 选择两个要标注间距的元素
2. 在插件中选择"间距标注"
3. 点击"添加间距标注"按钮
4. 间距标注将自动添加

### 运行设计审查

1. 在插件中选择审查模板（视觉一致性、可访问性等）
2. 点击"运行审查"按钮
3. 查看审查结果和问题列表

### 导出标注

1. 在插件中选择导出格式（PDF、PNG、JSON）
2. 点击"导出标注"按钮
3. 标注文件将自动下载

### 创建审查报告

1. 运行所需的审查
2. 点击"创建审查报告"按钮
3. 报告将自动生成并显示

## 标注类型

### 尺寸标注
标注元素的宽高尺寸，使用橙色。

### 间距标注
标注元素之间的间距，使用蓝色。

### 文本标注
添加文本说明和注释，使用绿色。

### 问题标注
标注设计问题和需要修改的地方，使用红色。

### 建议标注
标注设计建议和改进意见，使用橙色。

### 完成标注
标注已完成的部分，使用紫色。

## 审查模板

### 视觉一致性
检查颜色、字体、间距等视觉元素的一致性。

### 可访问性
检查设计的可访问性和无障碍支持。

### 响应式设计
检查设计在不同屏幕尺寸下的表现。

### 用户体验
检查用户体验和交互设计。

## 开发

### 项目结构

```
Figma-Redlines/
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

- **默认标注类型**：选择默认标注类型
- **标注颜色**：自定义标注颜色
- **自动保存**：启用自动标注保存
- **审查模板**：自定义审查模板

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `add-annotation`: 添加标注
- `add-dimension`: 添加尺寸标注
- `add-spacing`: 添加间距标注
- `run-review`: 运行审查
- `export-annotations`: 导出标注
- `clear-annotations`: 清除标注
- `toggle-annotations`: 切换标注显示
- `create-review-report`: 创建审查报告
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
