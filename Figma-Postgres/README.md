# PostgreSQL Design Visualizer

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> Transform Figma designs into PostgreSQL database schemas

## Overview

PostgreSQL Design Visualizer is a powerful Figma plugin that enables designers and developers to bridge the gap between UI/UX design and database architecture. Parse design elements, generate SQL schemas, validate database designs, and visualize database structures directly within Figma.

## Features

### 🎨 Design to Database Mapping
- Parse Figma components and convert them to database tables
- Automatically infer field types from design elements
- Extract relationships from design annotations
- Support for complex data structures

### 💻 Code Generation
- Generate PostgreSQL DDL/SQL scripts
- Export to multiple formats (SQL, JSON)
- Support for ORM code generation (Prisma, TypeORM, Sequelize, Drizzle)
- API route generation for popular frameworks

### ✅ Design Validation
- Comprehensive schema validation
- Naming convention checks
- Performance optimization suggestions
- Security best practices verification
- Real-time validation feedback

### 📊 Visualization
- Visual representation of database schemas
- Interactive table diagrams
- Relationship visualization
- ER diagram generation

### 🔌 Integration
- Seamless plugin-to-plugin communication
- Shared configuration management
- Import/Export functionality
- Version control support

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/figma-postgres.git
cd figma-postgres
```

2. Install dependencies:
```bash
npm install
```

3. Build the shared library:
```bash
cd ../figma-postgres-shared
npm install
npm run build
```

4. Build the plugin:
```bash
cd ../figma-postgres
npm run build
```

### Usage

1. **Open in Figma**: Load the plugin in Figma
2. **Select Design Elements**: Choose the components you want to analyze
3. **Parse Design**: Click "Parse Design" to extract database structure
4. **Generate SQL**: Click "Generate SQL" to create database scripts
5. **Validate Schema**: Click "Validate Schema" to check for issues
6. **Visualize**: Click "Visualize Schema" to see the database diagram

## Architecture

### Plugin Ecosystem

```
figma-postgres-shared/
├── types/           # TypeScript type definitions
├── parsers/          # Design and schema parsers
├── generators/       # Code generators (SQL, ORM, API)
├── validators/       # Schema validation rules
├── utils/           # Helper functions and communication
└── config/          # Configuration management

figma-postgres/       # Main visualization plugin
figma-postgres-Code/  # Code generation plugin
figma-postgres-check/ # Validation plugin
figma-postgres-plugin/ # Data management plugin
```

### Data Flow

1. **Design Phase**: Create database schema in Figma using frames and components
2. **Parse Phase**: Extract schema structure from design elements
3. **Validate Phase**: Check schema against best practices
4. **Generate Phase**: Create SQL, ORM models, and API code
5. **Export Phase**: Export generated code to files

## Design Conventions

### Table Naming
- Use `snake_case` for table names
- Prefix with descriptive entity type
- Example: `user_profiles`, `order_items`

### Column Naming
- Use `snake_case` for column names
- Include data type hints in name
- Example: `user_id`, `created_at`, `is_active`

### Field Type Mapping

| Design Type | PostgreSQL Type |
|-------------|-----------------|
| Text        | character varying |
| Number      | integer |
| Date        | date |
| DateTime    | timestamp |
| Boolean     | boolean |
| Email       | character varying |
| URL         | character varying |
| JSON        | jsonb |

## Validation Rules

### Naming Conventions
- Tables: `snake_case`, max 63 characters
- Columns: `snake_case`, max 63 characters
- Indexes: `idx_table_column`
- Foreign Keys: `fk_table_column`

### Performance
- Max 100 columns per table
- Max 50 foreign keys per table
- Max 5 columns per index
- Index foreign key columns

### Security
- Encrypt sensitive data fields
- Use proper password storage
- Implement row-level security
- Add audit columns for PII data

## Configuration

### Validation Config

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

### Code Generation Config

```typescript
{
  defaultORM: 'prisma',
  defaultFramework: 'express',
  generateTypes: true,
  generateValidation: true
}
```

## API Reference

### Design Parser

```typescript
import { DesignParser } from 'figma-postgres-shared';

const parser = new DesignParser();
const schema = await parser.parseFromSelection();
```

### SQL Generator

```typescript
import { SQLGenerator } from 'figma-postgres-shared';

const generator = new SQLGenerator();
const sql = generator.generateFullSchemaSQL(schema);
```

### Schema Validator

```typescript
import { SchemaValidator } from 'figma-postgres-shared';

const validator = new SchemaValidator(config);
const result = validator.validateSchema(schema);
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [https://github.com/your-org/figma-postgres/issues](https://github.com/your-org/figma-postgres/issues)
- Email: <admin@0379.email>

## Changelog

### Version 1.0.0
- Initial release
- Design to database mapping
- SQL code generation
- Schema validation
- Visualization features
- Plugin ecosystem

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
