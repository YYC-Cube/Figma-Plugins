# PostgreSQL 设计可视化器

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 将 Figma 设计转换为 PostgreSQL 数据库模式

## 概述

PostgreSQL 设计可视化器是一个强大的 Figma 插件，使设计师和开发者能够弥合 UI/UX 设计与数据库架构之间的差距。解析设计元素、生成 SQL 模式、验证数据库设计，并直接在 Figma 中可视化数据库结构。

## 功能特性

### 🎨 设计到数据库映射
- 解析 Figma 组件并将其转换为数据库表
- 从设计元素自动推断字段类型
- 从设计注释中提取关系
- 支持复杂数据结构

### 💻 代码生成
- 生成 PostgreSQL DDL/SQL 脚本
- 导出为多种格式（SQL、JSON）
- 支持 ORM 代码生成（Prisma、TypeORM、Sequelize、Drizzle）
- 为流行框架生成 API 路由

### ✅ 设计验证
- 全面的模式验证
- 命名约定检查
- 性能优化建议
- 安全最佳实践验证
- 实时验证反馈

### 📊 可视化
- 数据库模式的视觉表示
- 交互式表图表
- 关系可视化
- ER 图生成

### 🔌 集成
- 无缝的插件间通信
- 共享配置管理
- 导入/导出功能
- 版本控制支持

## 快速开始

### 安装

1. 克隆仓库：
```bash
git clone https://github.com/your-org/figma-postgres.git
cd figma-postgres
```

2. 安装依赖：
```bash
npm install
```

3. 构建共享库：
```bash
cd ../figma-postgres-shared
npm install
npm run build
```

4. 构建插件：
```bash
cd ../figma-postgres
npm run build
```

### 使用方法

1. **在 Figma 中打开**：在 Figma 中加载插件
2. **选择设计元素**：选择要分析的组件
3. **解析设计**：点击"解析设计"以提取数据库结构
4. **生成 SQL**：点击"生成 SQL"以创建数据库脚本
5. **验证模式**：点击"验证模式"以检查问题
6. **可视化**：点击"可视化模式"以查看数据库图表

## 架构

### 插件生态系统

```
figma-postgres-shared/
├── types/           # TypeScript 类型定义
├── parsers/          # 设计和模式解析器
├── generators/       # 代码生成器（SQL、ORM、API）
├── validators/       # 模式验证规则
├── utils/           # 辅助函数和通信
└── config/          # 配置管理

figma-postgres/       # 主可视化插件
figma-postgres-Code/  # 代码生成插件
figma-postgres-check/ # 验证插件
figma-postgres-plugin/ # 数据管理插件
```

### 数据流

1. **设计阶段**：使用框架和组件在 Figma 中创建数据库模式
2. **解析阶段**：从设计元素中提取模式结构
3. **验证阶段**：根据最佳实践检查模式
4. **生成阶段**：创建 SQL、ORM 模型和 API 代码
5. **导出阶段**：将生成的代码导出到文件

## 设计约定

### 表命名
- 使用 `snake_case` 作为表名
- 使用描述性实体类型作为前缀
- 示例：`user_profiles`、`order_items`

### 列命名
- 使用 `snake_case` 作为列名
- 在名称中包含数据类型提示
- 示例：`user_id`、`created_at`、`is_active`

### 字段类型映射

| 设计类型 | PostgreSQL 类型 |
|-------------|-----------------|
| 文本        | character varying |
| 数字      | integer |
| 日期        | date |
| 日期时间    | timestamp |
| 布尔值     | boolean |
| 电子邮件       | character varying |
| URL         | character varying |
| JSON        | jsonb |

## 验证规则

### 命名约定
- 表：`snake_case`，最多 63 个字符
- 列：`snake_case`，最多 63 个字符
- 索引：`idx_table_column`
- 外键：`fk_table_column`

### 性能
- 每表最多 100 列
- 每表最多 50 个外键
- 每个索引最多 5 列
- 为外键列创建索引

### 安全
- 加密敏感数据字段
- 使用适当的密码存储
- 实施行级安全
- 为 PII 数据添加审计列

## 配置

### 验证配置

```typescript
{
  enabledRules: ['*'],
  severityOverrides: {},
  namingConventions: {
    tables: { pattern: /^[a-z][a-z0-9_]*$/ },
    columns: { pattern: /^[a-z][a-z0-9_]*$/ }
  },
  performanceThresholds: {
    maxColumnsPerTable: 100,
    maxForeignKeysPerTable: 50
  }
}
```

### 代码生成配置

```typescript
{
  defaultORM: 'prisma',
  defaultFramework: 'express',
  generateTypes: true,
  generateValidation: true
}
```

## API 参考

### 设计解析器

```typescript
import { DesignParser } from 'figma-postgres-shared';

const parser = new DesignParser();
const schema = await parser.parseFromSelection();
```

### SQL 生成器

```typescript
import { SQLGenerator } from 'figma-postgres-shared';

const generator = new SQLGenerator();
const sql = generator.generateFullSchemaSQL(schema);
```

### 模式验证器

```typescript
import { SchemaValidator } from 'figma-postgres-shared';

const validator = new SchemaValidator(config);
const result = validator.validateSchema(schema);
```

## 贡献

欢迎贡献！请遵循以下准则：

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 添加测试
5. 提交拉取请求

## 许可证

MIT 许可证 - 详见 LICENSE 文件

## 支持

如有问题和疑问：
- GitHub 问题：[https://github.com/your-org/figma-postgres/issues](https://github.com/your-org/figma-postgres/issues)
- 电子邮件：<admin@0379.email>

## 更新日志

### 版本 1.0.0
- 初始版本
- 设计到数据库映射
- SQL 代码生成
- 模式验证
- 可视化功能
- 插件生态系统

---

<div align="center">

> **YanYuCloudCube**
> **言启象限 | 语枢未来**
> **Words Initiate Quadrants, Language Serves as Core for Future**

> **万象归元于云枢 | 深栈智启新纪元**
> **All things converge in cloud pivot; Deep stacks ignite a new era of intelligence**

</div>
