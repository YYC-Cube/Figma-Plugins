# PostgreSQL 代码生成器

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> 从 Figma 设计生成 PostgreSQL 代码

## 概述

PostgreSQL 代码生成器是一个 Figma 插件，可直接从 Figma 设计生成 PostgreSQL 数据库代码。支持生成 SQL 脚本、ORM 模型和 API 路由。

## 快速开始

### 安装

1. 克隆仓库：
```bash
git clone https://github.com/your-org/figma-postgres.git
cd figma-postgres-code-generator
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
cd ../figma-postgres-code-generator
npm run build
```

### 使用方法

1. **在 Figma 中打开**：在 Figma 中加载插件
2. **选择设计元素**：选择代表数据库表的组件
3. **生成代码**：插件根据您的选择自动生成代码

## 功能特性

- 生成 PostgreSQL SQL 脚本
- 支持 ORM 代码生成（Prisma、TypeORM、Sequelize、Drizzle）
- 生成 API 路由代码
- 支持多种代码格式导出

## 配置

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

## 开发

### 项目结构

```
Figma-Code-generatoor/
├── manifest.json          # 插件配置文件
├── package.json            # 依赖和脚本
├── tsconfig.json           # TypeScript配置
├── code.ts                 # 插件主逻辑
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

## 贡献

欢迎贡献！请遵循以下准则：

1. Fork 本仓库
2. 创建功能分支
3. 进行更改
4. 添加测试
5. 提交 Pull Request

## 许可证

MIT 许可证 - 详见 LICENSE 文件

## 支持

如有问题、疑问或建议，请联系 YYC³ 团队。

---

<div align="center">

> **YanYuCloudCube**
> **言启象限 | 语枢未来**
> **Words Initiate Quadrants, Language Serves as Core for Future**

> **万象归元于云枢 | 深栈智启新纪元**
> **All things converge in cloud pivot; Deep stacks ignite a new era of intelligence**

</div>
