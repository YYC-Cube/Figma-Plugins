# PostgreSQL 代码生成器

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 从 Figma 设计生成 SQL、ORM 和 API 代码

## 概述

PostgreSQL 代码生成器是一个 Figma 插件，可将数据库设计转换为生产就绪的代码。直接从您的 Figma 设计生成 PostgreSQL SQL 脚本、ORM 模型（Prisma、TypeORM、Sequelize、Drizzle）和 REST API 路由（Express、Fastify、NestJS、Next.js、Hono）。

## 功能特性

### 🗄️ SQL 生成
- 生成 PostgreSQL DDL/SQL 脚本
- 支持所有 PostgreSQL 数据类型
- 自动约束生成
- 索引和外键创建
- 迁移就绪的脚本

### 📦 ORM 支持
- **Prisma**：具有类型安全性的现代 TypeScript ORM
- **TypeORM**：功能丰富的 TypeScript 和 JavaScript ORM
- **Sequelize**：基于 Promise 的 Node.js ORM
- **Drizzle**：轻量级、类型安全的 SQL 工具包

### 🚀 API 生成
- **Express**：极简主义 Web 框架
- **Fastify**：高性能 Web 框架
- **NestJS**：渐进式 Node.js 框架
- **Next.js**：带有 API 路由的 React 框架
- **Hono**：超快速 Web 框架

### ⚙️ 配置
- 可自定义的代码生成选项
- 关系生成控制
- 验证模式生成
- 类型定义导出

## 快速开始

### 安装

1. 克隆仓库：
```bash
git clone https://github.com/your-org/figma-postgres.git
cd figma-postgres-Code
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
cd ../figma-postgres-Code
npm run build
```

### 使用方法

1. **在 Figma 中打开**：在 Figma 中加载插件
2. **选择设计元素**：选择代表数据库表的组件
3. **选择语言**：从代码生成面板中选择所需的输出语言
4. **生成代码**：插件根据您的选择自动生成代码

## 支持的语言

### SQL 变体
- PostgreSQL SQL（默认）
- MySQL SQL（计划中）
- SQLite SQL（计划中）

### ORM 框架
- Prisma
- TypeORM
- Sequelize
- Drizzle

### API 框架
- Express
- Fastify
- NestJS
- Next.js
- Hono

## 代码生成示例

### PostgreSQL SQL

```sql
-- 表：users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Prisma ORM

```prisma
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  username    String   @unique
  passwordHash String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### TypeORM

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Express API

```typescript
import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /users
router.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});

// POST /users
router.post('/users', [
  body('email').isEmail(),
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await db.query(
    'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [req.body.email, req.body.username, await hashPassword(req.body.password)]
  );
  
  res.status(201).json(user[0]);
});

export default router;
```

## 配置

### 代码生成配置

```typescript
{
  codegen: {
    defaultORM: 'prisma',
    defaultFramework: 'express',
    generateRelations: true,
    generateValidation: true,
    generateTypes: true
  }
}
```

### ORM 特定选项

#### Prisma
```typescript
{
  generateRelations: true,
  generateValidation: true,
  generateTypes: true
}
```

#### TypeORM
```typescript
{
  generateRelations: true,
  generateValidation: true,
  generateTypes: true,
  useDecorators: true
}
```

#### Sequelize
```typescript
{
  generateRelations: true,
  generateValidation: true,
  generateTypes: true,
  useModelDefinition: true
}
```

### API 框架选项

#### Express
```typescript
{
  generateCRUD: true,
  generateValidation: true,
  generateTypes: true,
  middleware: ['cors', 'helmet', 'express.json']
}
```

#### NestJS
```typescript
{
  generateCRUD: true,
  generateValidation: true,
  generateTypes: true,
  generateModules: true,
  generateServices: true,
  generateControllers: true
}
```

## 设计约定

### 表表示
- 使用 **Frame** 组件表示数据库表
- Frame 名称 = 表名（snake_case）
- 子组件 = 表列

### 列表示
- 使用 **Text** 组件表示列名
- 使用组件名称指示数据类型
- 添加约束后缀：
  - `_id` = 主键/外键
  - `_at` = 时间戳
  - `is_` = 布尔值

### 关系指示器
- 使用 **Connection** 线显示关系
- 为连接线添加标签以表示关系类型：
  - `1:1` = 一对一
  - `1:n` = 一对多
  - `n:n` = 多对多

## 与其他插件集成

### PostgreSQL 设计可视化器
- 从可视化器解析设计
- 访问保存的模式
- 共享配置设置

### PostgreSQL 设计检查器
- 代码生成前验证模式
- 检查命名约定
- 验证数据类型映射

### PostgreSQL 数据管理器
- 导入现有数据库模式
- 导出生成的代码
- 管理模式版本

## API 参考

### 代码生成

```typescript
figma.codegen.on('generate', async (event) => {
  const language = event.node.document?.codegenLanguage;
  const code = await generateCode(language, event.node);
  return [{ language, code, title: 'Generated Code' }];
});
```

### 模式加载

```typescript
const schema = await PluginCommunication.loadSchema();
const code = generator.generate(schema);
```

### 配置管理

```typescript
const config = await ConfigManager.load();
const generator = new ORMGenerator(config);
```

## 最佳实践

### 设计阶段
1. 在创建设计之前规划数据库模式
2. 使用一致的命名约定
3. 清楚地记录关系
4. 包含所有必要的约束

### 代码生成阶段
1. 在生成代码之前验证您的模式
2. 查看生成的代码以进行自定义修改
3. 在开发环境中测试生成的代码
4. 对生成的代码进行版本控制

### 集成阶段
1. 将生成的代码与现有代码库集成
2. 添加自定义业务逻辑
3. 实施错误处理
4. 添加日志和监控

## 故障排除

### 常见问题

**未找到模式**
- 确保您已选择有效的设计元素
- 检查设计是否遵循约定
- 尝试先使用可视化器解析设计

**无效的代码生成**
- 验证所选语言是否受支持
- 检查您的配置设置
- 查看设计是否存在命名约定违规

**缺少依赖项**
- 确保已构建共享库
- 运行 `npm install` 安装依赖项
- 检查 TypeScript 编译错误

## 贡献

欢迎贡献！请遵循以下准则：

1. Fork 仓库
2. 创建功能分支
3. 添加对新语言/框架的支持
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
- SQL 代码生成
- ORM 支持（Prisma、TypeORM、Sequelize、Drizzle）
- API 生成（Express、Fastify、NestJS、Next.js、Hono）
- 配置管理
- 插件集成

---

<div align="center">

> **YanYuCloudCube**
> **言启象限 | 语枢未来**
> **Words Initiate Quadrants, Language Serves as Core for Future**

> **万象归元于云枢 | 深栈智启新纪元**
> **All things converge in cloud pivot; Deep stacks ignite a new era of intelligence**

</div>
