# Figma Plugins Manager

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> Figma插件集合和管理工具

## 概述

Figma Plugins Manager是一个综合的Figma插件，用于管理和浏览Figma插件集合。它作为插件生态系统的中心枢纽，提供插件搜索、分类浏览、安装/卸载、插件推荐和统计信息等功能。

## 功能特性

### 插件搜索
- 按名称搜索插件
- 按描述搜索插件
- 实时搜索结果
- 搜索历史记录

### 分类浏览
- 设计工具
- 开发工具
- 效率工具
- 协作工具
- 数据分析
- 自动化

### 插件管理
- 安装插件
- 卸载插件
- 插件更新检查
- 插件版本管理

### 插件推荐
- 基于评分推荐
- 基于下载量推荐
- 个性化推荐
- 新插件推荐

### 统计信息
- 总插件数
- 已安装插件数
- 总下载量
- 平均评分
- 分类统计

## 安装

1. 在Figma中打开插件管理器
2. 点击"Plugins" > "Development" > "Import plugin from manifest..."
3. 选择`manifest.json`文件
4. 插件将自动安装到Figma中

## 使用方法

### 搜索插件

1. 打开Figma Plugins Manager插件
2. 在搜索框中输入关键词
3. 查看搜索结果
4. 点击插件卡片查看详情

### 按分类浏览

1. 打开插件
2. 点击分类标签（设计工具、开发工具等）
3. 查看该分类下的所有插件
4. 点击插件卡片查看详情

### 安装插件

1. 找到要安装的插件
2. 点击"安装"按钮
3. 等待安装完成
4. 插件将添加到已安装列表

### 卸载插件

1. 在已安装插件列表中找到要卸载的插件
2. 点击"卸载"按钮
3. 确认卸载操作
4. 插件将从已安装列表中移除

### 获取推荐

1. 打开插件
2. 点击"获取推荐"按钮
3. 查看推荐的插件列表
4. 点击插件卡片查看详情

### 查看统计信息

1. 打开插件
2. 点击"查看统计"按钮
3. 查看详细的统计信息
4. 了解插件生态系统的整体情况

## 插件分类

### 设计工具
用于设计和创作的工具，包括内容填充、设计规范检查、动画创建等。

### 开发工具
用于代码生成和开发的工具，包括HTML转换、代码生成等。

### 效率工具
用于提高工作效率的工具，包括自动布局、元素复制、文件清理等。

### 协作工具
用于团队协作和沟通的工具，包括红线标注、设计审查等。

### 数据分析
用于数据分析和可视化的工具。

### 自动化
用于自动化和批量处理的工具。

## 开发

### 项目结构

```
Figma-Plugins/
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

- **默认分类**：选择默认显示的分类
- **搜索历史**：启用搜索历史记录
- **自动更新检查**：启用自动插件更新检查
- **推荐算法**：选择推荐算法

设置可在插件UI的设置选项卡中访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `search-plugins`: 搜索插件
- `filter-by-category`: 按分类过滤
- `install-plugin`: 安装插件
- `uninstall-plugin`: 卸载插件
- `check-updates`: 检查更新
- `get-plugin-info`: 获取插件信息
- `get-recommendations`: 获取推荐
- `get-statistics`: 获取统计信息
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
