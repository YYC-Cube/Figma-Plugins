# PostgreSQL 模式验证器

> 根据最佳实践验证数据库设计

## 概述

PostgreSQL 模式验证器是一个 Figma 插件，确保您的数据库设计遵循行业最佳实践和 PostgreSQL 约定。验证命名约定、检查性能问题、验证安全实践，并获得可操作的建议以改进您的模式设计。

## 功能特性

### ✅ 全面验证
- 命名约定检查（表、列、索引）
- 性能优化建议
- 安全最佳实践验证
- 数据类型验证
- 关系完整性检查

### 🔍 实时验证
- 选择更改时自动验证
- 在设计中视觉高亮显示问题
- 即时反馈和建议

### 🛠️ 自动修复功能
- 自动命名约定修复
- 常见问题的快速修复
- 一键问题解决

### 📊 详细报告
- 验证评分（A-F 等级）
- 问题分类（错误、警告、信息）
- 导出为 JSON、Markdown 或文本
- 上下文问题描述

### ⚙️ 可自定义规则
- 启用/禁用特定验证规则
- 调整严重性级别
- 配置命名模式
- 设置性能阈值

## 快速开始

### 安装

1. 克隆仓库：
```bash
git clone https://github.com/your-org/figma-postgres.git
cd figma-postgres-check
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
cd ../figma-postgres-check
npm run build
```

### 使用方法

1. **在 Figma 中打开**：在 Figma 中加载插件
2. **选择设计元素**：选择代表数据库表的组件
3. **验证**：插件自动验证您的设计
4. **查看问题**：检查验证结果和建议的修复
5. **修复问题**：使用自动修复或手动解决问题
6. **导出报告**：导出验证结果用于文档

## 验证规则

### 命名约定

#### 表命名
- 必须使用 `snake_case` 格式
- 最多 63 个字符
- 必须以字母开头
- 除下划线外不允许特殊字符

#### 列命名
- 必须使用 `snake_case` 格式
- 最多 63 个字符
- 必须以字母开头
- 除下划线外不允许特殊字符

#### 索引命名
- 必须遵循模式：`idx_table_column`
- 在模式内必须唯一
- 最多 63 个字符

#### 外键命名
- 必须遵循模式：`fk_table_column`
- 在模式内必须唯一
- 最多 63 个字符

### 性能

#### 表结构
- 每表最多 100 列
- 每表最多 50 个外键
- 每个索引最多 5 列
- 为外键列创建索引
- 避免过多的 NULL 列

#### 数据类型
- 使用适当的数据类型
- 避免对短字符串使用 TEXT
- 尽可能使用 INTEGER 而不是 BIGINT
- 对标志使用 BOOLEAN

### 安全

#### 敏感数据
- 加密密码字段
- 保护 PII（个人身份信息）
- 实现行级安全
- 为敏感表添加审计列

#### 访问控制
- 实施适当的约束
- 使用 CHECK 约束进行数据验证
- 在适当的地方添加 NOT NULL 约束
- 为唯一数据实施 UNIQUE 约束

### 数据完整性

#### 主键
- 每个表必须有一个主键
- 主键应该是自增或 UUID
- 主键应该是不可变的

#### 外键
- 外键必须引用现有表
- 外键应该被索引
- 应该定义级联规则
- 应该避免循环引用

## 验证评分

验证器根据发现的问题严重性分配 0-100 的分数：

| 分数 | 等级 | 描述 |
|-------|-------|-------------|
| 90-100 | A | 优秀 - 遵循所有最佳实践 |
| 80-89 | B | 良好 - 可能需要一些改进 |
| 70-79 | C | 可接受 - 一些问题需要注意 |
| 60-69 | D | 需要改进 - 存在主要问题 |
| <60 | F | 差 - 需要重大重新设计 |

### 评分算法

- **错误**：每个 -10 分
- **警告**：每个 -5 分
- **信息**：每个 -1 分

基础分数从 100 开始，根据发现的问题递减。

## 问题类型

### 错误
必须修复的关键问题：

- `NAMING_TABLE_INVALID`：表名违反命名约定
- `NAMING_COLUMN_INVALID`：列名违反命名约定
- `PERFORMANCE_TOO_MANY_COLUMNS`：表有太多列
- `SECURITY_MISSING_ENCRYPTION`：敏感数据未加密
- `INTEGRITY_MISSING_PRIMARY_KEY`：表缺少主键

### 警告
应该解决的问题：

- `PERFORMANCE_MISSING_INDEX`：外键缺少索引
- `PERFORMANCE_INEFFICIENT_TYPE`：数据类型使用低效
- `NAMING_INCONSISTENT`：命名模式不一致
- `SECURITY_WEAK_PASSWORD`：弱密码策略

### 信息
改进建议：

- `PERFORMANCE_INDEX_SUGGESTION`：查询优化建议索引
- `NAMING_BETTER_NAME`：建议更好的命名
- `SECURITY_AUDIT_SUGGESTION`：建议审计列

## 自动修复功能

验证器可以自动修复某些问题：

### 命名修复
- 将 camelCase 转换为 snake_case
- 删除特殊字符
- 修复大小写
- 缩短过长的名称

### 结构修复
- 添加缺少的主键
- 添加缺少的索引
- 修复外键引用

### 安全修复
- 添加加密注释
- 添加审计列
- 添加约束注释

## 配置

### 验证配置

```typescript
{
  validation: {
    enabledRules: ['*'],
    severityOverrides: {},
    namingConventions: {
      tables: { pattern: /^[a-z][a-z0-9_]*$/, maxLength: 63 },
      columns: { pattern: /^[a-z][a-z0-9_]*$/, maxLength: 63 },
      indexes: { pattern: /^idx_[a-z][a-z0-9_]*$/, maxLength: 63 },
      foreignKeys: { pattern: /^fk_[a-z][a-z0-9_]*$/, maxLength: 63 }
    },
    performanceThresholds: {
      maxColumnsPerTable: 100,
      maxForeignKeysPerTable: 50,
      maxColumnsPerIndex: 5
    },
    securityRules: {
      encryptSensitiveData: true,
      requireAuditColumns: true,
      checkForPII: true
    }
  }
}
```

### 规则配置

```typescript
{
  validation: {
    enabledRules: [
      'NAMING_TABLE_INVALID',
      'NAMING_COLUMN_INVALID',
      'PERFORMANCE_TOO_MANY_COLUMNS',
      'SECURITY_MISSING_ENCRYPTION'
    ],
    severityOverrides: {
      'PERFORMANCE_MISSING_INDEX': 'warning',
      'NAMING_INCONSISTENT': 'info'
    }
  }
}
```

## 与其他插件集成

### PostgreSQL 设计可视化器
- 访问解析的模式
- 共享验证结果
- 在可视化中高亮显示问题

### PostgreSQL 代码生成器
- 代码生成前验证
- 确保生成的代码遵循最佳实践
- 将验证结果传递给代码生成器

### PostgreSQL 数据管理器
- 导入现有模式进行验证
- 导出验证报告
- 跟踪模式版本

## 导出格式

### JSON
```json
{
  "score": 85,
  "summary": {
    "errors": 1,
    "warnings": 3,
    "infos": 2
  },
  "issues": [
    {
      "id": "issue-1",
      "code": "NAMING_TABLE_INVALID",
      "severity": "error",
      "message": "表名违反命名约定",
      "description": "表名必须使用 snake_case 格式",
      "context": {
        "tableName": "UserProfile"
      },
      "autoFix": true
    }
  ]
}
```

### Markdown
```markdown
# PostgreSQL 模式验证报告

**分数：** 85/100
**日期：** 2025-01-30T00:00:00.000Z

## 摘要
- 错误：1
- 警告：3
- 信息：2

## 问题

### 错误

#### NAMING_TABLE_INVALID
**消息：** 表名违反命名约定

**描述：** 表名必须使用 snake_case 格式

**上下文：** {"tableName":"UserProfile"}

**自动修复：** 可用
```

## 最佳实践

### 设计阶段
1. 在创建设计之前规划您的模式
2. 从一开始就遵循命名约定
3. 考虑性能影响
4. 从一开始就设计安全性

### 验证阶段
1. 在设计期间频繁验证
2. 立即解决错误
3. 仔细审查警告
4. 考虑信息建议

### 修复阶段
1. 在可用时使用自动修复
2. 审查自动修复更改
3. 在开发中测试修复
4. 记录手动修复

## 故障排除

### 常见问题

**验证未运行**
- 确保您已选择设计元素
- 检查设计是否遵循约定
- 重新加载插件

**自动修复不工作**
- 检查问题是否支持自动修复
- 验证插件具有写入权限
- 检查插件控制台是否有错误

**分数未更新**
- 刷新验证
- 清除插件缓存
- 重启 Figma

## 贡献

欢迎贡献！请遵循以下准则：

1. Fork 仓库
2. 创建功能分支
3. 添加新的验证规则
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
- 全面的验证规则
- 自动修复功能
- 实时验证
- 导出功能
- 插件集成

---

<div align="center">

> **YanYuCloudCube**
> **言启象限 | 语枢未来**
> **Words Initiate Quadrants, Language Serves as Core for Future**

> **万象归元于云枢 | 深栈智启新纪元**
> **All things converge in cloud pivot; Deep stacks ignite a new era of intelligence**

</div>
