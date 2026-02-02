# PostgreSQL 数据管理器

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 在Figma中直接管理、版本控制和导出PostgreSQL数据库模式

## 概述

PostgreSQL 数据管理器是一个全面的Figma插件，为在Figma设计环境中管理数据库模式提供了完整的解决方案。它作为PostgreSQL插件生态系统的中心枢纽，支持模式管理、版本控制、导入/导出功能，以及与其他PostgreSQL插件的无缝集成。

## 功能特性

### 模式管理
- 从Figma设计元素加载和解析数据库模式
- 保存和管理模式元数据
- 查看模式统计信息（表、列、关系）
- 实时模式验证

### 版本控制
- 创建和管理多个模式版本
- 比较不同版本以识别更改
- 合并模式版本
- 使用描述跟踪版本历史

### 导入/导出
- 从SQL、JSON或Prisma格式导入模式
- 将模式导出为多种格式
- 从本地文件加载模式
- 与外部工具的无缝集成

### 验证
- 全面的模式验证
- 对设计合规性的实时反馈
- 性能和安全检查
- 详细的验证报告

### 集成
- 与其他PostgreSQL插件的无缝通信
- 共享类型定义和实用程序
- 可配置的设置和首选项
- 插件生态系统支持

## 安装

1. 克隆此仓库或下载插件文件
2. 导航到插件目录：
   ```bash
   cd figma-postgres-plugin
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 构建共享库：
   ```bash
   npm run build:shared
   ```
5. 构建插件：
   ```bash
   npm run build
   ```
6. 在Figma中，转到Plugins > Development > Import plugin from manifest...
7. 选择此目录中的`manifest.json`文件

## 使用方法

### 加载模式

1. 在Figma中打开插件
2. 选择代表数据库模式的设计元素
3. 在模式选项卡中点击"加载模式"
4. 插件将解析并显示模式信息

### 创建版本

1. 加载或创建模式
2. 转到版本选项卡
3. 点击"创建版本"
4. 输入名称和描述
5. 点击"创建"以保存版本

### 导入模式

1. 转到导入选项卡
2. 选择导入格式（SQL、JSON或Prisma）
3. 粘贴模式内容或从文件加载
4. 点击"导入模式"

### 导出模式

1. 加载或创建模式
2. 转到导出选项卡
3. 选择导出格式
4. 点击"导出模式"
5. 文件将自动下载

### 验证模式

1. 加载或创建模式
2. 转到验证选项卡
3. 点击"运行验证"
4. 查看验证结果和建议

## 插件生态系统

此插件是PostgreSQL插件生态系统的一部分：

- **figma-postgres**: 设计可视化工具
- **figma-postgres-Code**: 代码生成插件
- **figma-postgres-check**: 设计规范检查器
- **figma-postgres-plugin**: 数据管理面板（此插件）

所有插件共享一个公共库（`figma-postgres-shared`），用于一致的类型定义、解析器、生成器和验证器。

## 开发

### 项目结构

```
figma-postgres-plugin/
├── manifest.json          # 插件清单
├── package.json            # 依赖和脚本
├── tsconfig.json           # TypeScript配置
├── code.ts                 # 主插件逻辑
├── ui.html                 # 插件UI
└── README.md              # 此文件
```

### 构建

```bash
# 首先构建共享库
npm run build:shared

# 构建插件
npm run build

# 监听更改
npm run watch

# 开发模式（构建共享库并监听）
npm run dev
```

### 代码检查

```bash
# 运行代码检查器
npm run lint

# 修复代码检查问题
npm run lint:fix
```

## 配置

插件支持可配置的设置：

- **默认导出格式**：在SQL、JSON或Prisma之间选择
- **自动保存模式**：启用自动模式保存

设置可从插件UI的设置选项卡访问。

## API参考

### 消息类型

插件使用以下消息类型与UI通信：

- `load-schema`: 从当前选择加载模式
- `save-schema`: 使用元数据保存当前模式
- `import-schema`: 从内容导入模式
- `export-schema`: 将模式导出为指定格式
- `create-version`: 创建新模式版本
- `load-version`: 加载特定版本
- `delete-version`: 删除版本
- `list-versions`: 列出所有版本
- `compare-versions`: 比较两个版本
- `merge-versions`: 合并两个版本
- `validate-schema`: 运行模式验证
- `visualize-schema`: 在设计中可视化模式
- `load-config`: 加载插件配置
- `save-config`: 保存插件配置
- `close`: 关闭插件

## 贡献

欢迎贡献！请遵循以下准则：

1. Fork仓库
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
