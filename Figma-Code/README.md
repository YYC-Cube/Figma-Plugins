# PostgreSQL Code Generator

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> Generate SQL, ORM, and API code from Figma designs

## Overview

PostgreSQL Code Generator is a Figma plugin that transforms database designs into production-ready code. Generate PostgreSQL SQL scripts, ORM models (Prisma, TypeORM, Sequelize, Drizzle), and REST API routes (Express, Fastify, NestJS, Next.js, Hono) directly from your Figma designs.

## Features

### 🗄️ SQL Generation
- Generate PostgreSQL DDL/SQL scripts
- Support for all PostgreSQL data types
- Automatic constraint generation
- Index and foreign key creation
- Migration-ready scripts

### 📦 ORM Support
- **Prisma**: Modern TypeScript ORM with type safety
- **TypeORM**: Feature-rich ORM for TypeScript and JavaScript
- **Sequelize**: Promise-based Node.js ORM
- **Drizzle**: Lightweight, type-safe SQL toolkit

### 🚀 API Generation
- **Express**: Minimalist web framework
- **Fastify**: High-performance web framework
- **NestJS**: Progressive Node.js framework
- **Next.js**: React framework with API routes
- **Hono**: Ultra-fast web framework

### ⚙️ Configuration
- Customizable code generation options
- Relation generation control
- Validation schema generation
- Type definitions export

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/figma-postgres.git
cd figma-postgres-Code
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
cd ../figma-postgres-Code
npm run build
```

### Usage

1. **Open in Figma**: Load the plugin in Figma
2. **Select Design Element**: Choose a component representing a database table
3. **Choose Language**: Select your desired output language from the codegen panel
4. **Generate Code**: The plugin automatically generates code based on your selection

## Supported Languages

### SQL Variants
- PostgreSQL SQL (default)
- MySQL SQL (planned)
- SQLite SQL (planned)

### ORM Frameworks
- Prisma
- TypeORM
- Sequelize
- Drizzle

### API Frameworks
- Express
- Fastify
- NestJS
- Next.js
- Hono

## Code Generation Examples

### PostgreSQL SQL

```sql
-- Table: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
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

## Configuration

### Code Generation Config

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

### ORM-Specific Options

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

### API Framework Options

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

## Design Conventions

### Table Representation
- Use **Frame** components to represent database tables
- Frame name = table name (snake_case)
- Child components = table columns

### Column Representation
- Use **Text** components for column names
- Use component names to indicate data types
- Add suffixes for constraints:
  - `_id` = primary/foreign key
  - `_at` = timestamp
  - `is_` = boolean

### Relationship Indicators
- Use **Connection** lines to show relationships
- Add labels to connection lines for relationship types:
  - `1:1` = one-to-one
  - `1:n` = one-to-many
  - `n:n` = many-to-many

## Integration with Other Plugins

### PostgreSQL Design Visualizer
- Parse designs from the visualizer
- Access saved schemas
- Share configuration settings

### PostgreSQL Design Checker
- Validate schemas before code generation
- Check for naming conventions
- Verify data type mappings

### PostgreSQL Data Manager
- Import existing database schemas
- Export generated code
- Manage schema versions

## API Reference

### Code Generation

```typescript
figma.codegen.on('generate', async (event) => {
  const language = event.node.document?.codegenLanguage;
  const code = await generateCode(language, event.node);
  return [{ language, code, title: 'Generated Code' }];
});
```

### Schema Loading

```typescript
const schema = await PluginCommunication.loadSchema();
const code = generator.generate(schema);
```

### Configuration Management

```typescript
const config = await ConfigManager.load();
const generator = new ORMGenerator(config);
```

## Best Practices

### Design Phase
1. Plan your database schema before creating designs
2. Use consistent naming conventions
3. Document relationships clearly
4. Include all necessary constraints

### Code Generation Phase
1. Validate your schema before generating code
2. Review generated code for custom modifications
3. Test generated code in your development environment
4. Version control your generated code

### Integration Phase
1. Integrate generated code with your existing codebase
2. Add custom business logic
3. Implement error handling
4. Add logging and monitoring

## Troubleshooting

### Common Issues

**No schema found**
- Ensure you've selected a valid design element
- Check that the design follows the conventions
- Try parsing the design first with the visualizer

**Invalid code generation**
- Verify the selected language is supported
- Check your configuration settings
- Review the design for naming convention violations

**Missing dependencies**
- Ensure the shared library is built
- Run `npm install` to install dependencies
- Check TypeScript compilation errors

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Add support for new languages/frameworks
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
- SQL code generation
- ORM support (Prisma, TypeORM, Sequelize, Drizzle)
- API generation (Express, Fastify, NestJS, Next.js, Hono)
- Configuration management
- Plugin integration

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
