import { DatabaseSchema, Table, Column } from '../types/database.types';

export type ORMType = 'prisma' | 'typeorm' | 'sequelize' | 'drizzle';

export interface ORMGeneratorConfig {
  type: ORMType;
  schemaName?: string;
  generateRelations?: boolean;
  generateValidation?: boolean;
  indent?: string;
}

export class ORMGenerator {
  private config: ORMGeneratorConfig;

  constructor(config: ORMGeneratorConfig) {
    this.config = {
      indent: '  ',
      generateRelations: true,
      generateValidation: true,
      ...config
    };
  }

  generate(schema: DatabaseSchema): string {
    switch (this.config.type) {
      case 'prisma':
        return this.generatePrisma(schema);
      case 'typeorm':
        return this.generateTypeORM(schema);
      case 'sequelize':
        return this.generateSequelize(schema);
      case 'drizzle':
        return this.generateDrizzle(schema);
      default:
        throw new Error(`Unsupported ORM type: ${this.config.type}`);
    }
  }

  private generatePrisma(schema: DatabaseSchema): string {
    const lines: string[] = [];

    lines.push('// This is your Prisma schema file,');
    lines.push('// learn more about it in the docs: https://pris.ly/d/prisma-schema');
    lines.push('');
    lines.push('generator client {');
    lines.push('  provider = "prisma-client-js"');
    lines.push('}');
    lines.push('');

    lines.push('datasource db {');
    lines.push(`  provider = "postgresql"`);
    lines.push(`  url      = env("DATABASE_URL")`);
    lines.push('}');
    lines.push('');

    for (const table of schema.tables) {
      lines.push(this.generatePrismaModel(table));
      lines.push('');
    }

    return lines.join('\n');
  }

  private generatePrismaModel(table: Table): string {
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`model ${this.toPascalCase(table.name)} {`);

    for (const column of table.columns) {
      const fieldDef = this.generatePrismaField(column, table);
      lines.push(`${indent}${fieldDef}`);
    }

    if (this.config.generateRelations) {
      for (const fk of table.foreignKeys) {
        const relationDef = this.generatePrismaRelation(fk, table);
        if (relationDef) {
          lines.push(`${indent}${relationDef}`);
        }
      }
    }

    lines.push('}');

    return lines.join('\n');
  }

  private generatePrismaField(column: Column, table: Table): string {
    const prismaType = this.mapToPrismaType(column);
    const isPrimaryKey = table.primaryKeys.includes(column.name);
    const isUnique = column.constraints.some(c => c.type === 'UNIQUE');
    const isForeignKey = table.foreignKeys.some(fk => fk.columns.includes(column.name));

    let fieldDef = `${column.name} ${prismaType}`;

    if (isPrimaryKey) {
      fieldDef += ' @id';
    }

    if (!column.nullable) {
      fieldDef += isPrimaryKey ? ' @default(autoincrement())' : '';
    } else {
      fieldDef += '?';
    }

    if (isUnique && !isPrimaryKey) {
      fieldDef += ' @unique';
    }

    if (column.defaultValue && !isPrimaryKey) {
      fieldDef += ` @default(${this.formatPrismaDefault(column)})`;
    }

    if (isForeignKey) {
      const fk = table.foreignKeys.find(f => f.columns.includes(column.name))!;
      fieldDef += ` @relation(fields: [${column.name}], references: [${fk.referenceColumns[0]}])`;
    }

    return fieldDef;
  }

  private generatePrismaRelation(foreignKey: any, table: Table): string {
    const relationName = this.toCamelCase(foreignKey.referenceTable);
    return `${relationName} ${this.toPascalCase(foreignKey.referenceTable)}? @relation("${foreignKey.name}")`;
  }

  private mapToPrismaType(column: Column): string {
    const typeMapping: Record<string, string> = {
      'smallint': 'Int',
      'integer': 'Int',
      'bigint': 'BigInt',
      'decimal': 'Decimal',
      'numeric': 'Decimal',
      'real': 'Float',
      'double precision': 'Float',
      'smallserial': 'Int',
      'serial': 'Int',
      'bigserial': 'BigInt',
      'character varying': 'String',
      'varchar': 'String',
      'character': 'String',
      'char': 'String',
      'text': 'String',
      'bytea': 'Bytes',
      'timestamp': 'DateTime',
      'timestamp with time zone': 'DateTime',
      'timestamp without time zone': 'DateTime',
      'date': 'DateTime',
      'time': 'DateTime',
      'time with time zone': 'DateTime',
      'time without time zone': 'DateTime',
      'interval': 'String',
      'boolean': 'Boolean',
      'bool': 'Boolean',
      'json': 'Json',
      'jsonb': 'Json',
      'xml': 'String',
      'uuid': 'String',
      'money': 'Decimal'
    };

    return typeMapping[column.dataType] || 'String';
  }

  private formatPrismaDefault(column: Column): string {
    if (column.defaultValue === null) return 'null';
    if (typeof column.defaultValue === 'string') {
      return column.defaultValue.startsWith("'") ? column.defaultValue : `"${column.defaultValue}"`;
    }
    return String(column.defaultValue);
  }

  private generateTypeORM(schema: DatabaseSchema): string {
    const lines: string[] = [];

    lines.push('import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";');
    lines.push('');

    for (const table of schema.tables) {
      lines.push(this.generateTypeORMEntity(table));
      lines.push('');
    }

    return lines.join('\n');
  }

  private generateTypeORMEntity(table: Table): string {
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`@Entity()`);
    lines.push(`export class ${this.toPascalCase(table.name)} {`);

    for (const column of table.columns) {
      const fieldDef = this.generateTypeORMField(column, table);
      lines.push(`${indent}${fieldDef}`);
    }

    if (this.config.generateRelations) {
      for (const fk of table.foreignKeys) {
        const relationDef = this.generateTypeORMRelation(fk, table);
        if (relationDef) {
          lines.push(`${indent}${relationDef}`);
        }
      }
    }

    lines.push('}');

    return lines.join('\n');
  }

  private generateTypeORMField(column: Column, table: Table): string {
    const decorators: string[] = [];
    const isPrimaryKey = table.primaryKeys.includes(column.name);
    const isUnique = column.constraints.some(c => c.type === 'UNIQUE');

    if (isPrimaryKey) {
      decorators.push('@PrimaryGeneratedColumn()');
    } else {
      decorators.push(`@Column({ type: "${column.dataType}"${column.nullable ? ', nullable: true' : ''}${isUnique ? ', unique: true' : ''} })`);
    }

    return `${decorators.join('\n' + this.config.indent!)}\n${this.config.indent!}${column.name}: ${this.mapToTypeScriptType(column)};`;
  }

  private generateTypeORMRelation(foreignKey: any, table: Table): string {
    const relationName = this.toCamelCase(foreignKey.referenceTable);
    return `@ManyToOne(() => ${this.toPascalCase(foreignKey.referenceTable)})\n${this.config.indent!}${relationName}: ${this.toPascalCase(foreignKey.referenceTable)};`;
  }

  private mapToTypeScriptType(column: Column): string {
    const typeMapping: Record<string, string> = {
      'smallint': 'number',
      'integer': 'number',
      'bigint': 'number',
      'decimal': 'number',
      'numeric': 'number',
      'real': 'number',
      'double precision': 'number',
      'character varying': 'string',
      'varchar': 'string',
      'character': 'string',
      'char': 'string',
      'text': 'string',
      'bytea': 'Buffer',
      'timestamp': 'Date',
      'timestamp with time zone': 'Date',
      'timestamp without time zone': 'Date',
      'date': 'Date',
      'time': 'Date',
      'time with time zone': 'Date',
      'time without time zone': 'Date',
      'interval': 'string',
      'boolean': 'boolean',
      'bool': 'boolean',
      'json': 'any',
      'jsonb': 'any',
      'xml': 'string',
      'uuid': 'string',
      'money': 'number'
    };

    const tsType = typeMapping[column.dataType] || 'any';
    return column.nullable ? `${tsType} | null` : tsType;
  }

  private generateSequelize(schema: DatabaseSchema): string {
    const lines: string[] = [];

    lines.push('import { Model, DataTypes, Sequelize } from "sequelize";');
    lines.push('');

    for (const table of schema.tables) {
      lines.push(this.generateSequelizeModel(table));
      lines.push('');
    }

    return lines.join('\n');
  }

  private generateSequelizeModel(table: Table): string {
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`export class ${this.toPascalCase(table.name)} extends Model {`);
    lines.push(`${indent}static init(sequelize: Sequelize) {`);
    lines.push(`${indent}${indent}return super.init({`);

    for (const column of table.columns) {
      const fieldDef = this.generateSequelizeField(column, table);
      lines.push(`${indent}${indent}${indent}${column.name}: ${fieldDef},`);
    }

    lines.push(`${indent}${indent}}, {`);
    lines.push(`${indent}${indent}${indent}sequelize,`);
    lines.push(`${indent}${indent}${indent}tableName: '${table.name}',`);
    lines.push(`${indent}${indent}});`);
    lines.push(`${indent}}`);
    lines.push('}');

    return lines.join('\n');
  }

  private generateSequelizeField(column: Column, table: Table): string {
    const props: string[] = [];
    const isPrimaryKey = table.primaryKeys.includes(column.name);
    const isUnique = column.constraints.some(c => c.type === 'UNIQUE');

    props.push(`type: DataTypes.${this.mapToSequelizeType(column.dataType)}`);

    if (isPrimaryKey) {
      props.push('primaryKey: true');
      props.push('autoIncrement: true');
    }

    if (!column.nullable && !isPrimaryKey) {
      props.push('allowNull: false');
    }

    if (isUnique && !isPrimaryKey) {
      props.push('unique: true');
    }

    if (column.defaultValue && !isPrimaryKey) {
      props.push(`defaultValue: ${JSON.stringify(column.defaultValue)}`);
    }

    return `{${props.join(', ')}}`;
  }

  private mapToSequelizeType(postgresType: string): string {
    const typeMapping: Record<string, string> = {
      'smallint': 'SMALLINT',
      'integer': 'INTEGER',
      'bigint': 'BIGINT',
      'decimal': 'DECIMAL',
      'numeric': 'DECIMAL',
      'real': 'FLOAT',
      'double precision': 'DOUBLE',
      'character varying': 'STRING',
      'varchar': 'STRING',
      'character': 'CHAR',
      'char': 'CHAR',
      'text': 'TEXT',
      'bytea': 'BLOB',
      'timestamp': 'DATE',
      'timestamp with time zone': 'DATE',
      'timestamp without time zone': 'DATE',
      'date': 'DATEONLY',
      'time': 'TIME',
      'time with time zone': 'TIME',
      'time without time zone': 'TIME',
      'interval': 'STRING',
      'boolean': 'BOOLEAN',
      'bool': 'BOOLEAN',
      'json': 'JSON',
      'jsonb': 'JSONB',
      'xml': 'TEXT',
      'uuid': 'UUID',
      'money': 'DECIMAL'
    };

    return typeMapping[postgresType] || 'STRING';
  }

  private generateDrizzle(schema: DatabaseSchema): string {
    const lines: string[] = [];

    lines.push('import { pgTable, serial, text, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";');
    lines.push('');

    for (const table of schema.tables) {
      lines.push(this.generateDrizzleTable(table));
      lines.push('');
    }

    return lines.join('\n');
  }

  private generateDrizzleTable(table: Table): string {
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`export const ${this.toCamelCase(table.name)} = pgTable('${table.name}', {`);

    for (const column of table.columns) {
      const fieldDef = this.generateDrizzleField(column, table);
      lines.push(`${indent}${column.name}: ${fieldDef},`);
    }

    lines.push('});');

    return lines.join('\n');
  }

  private generateDrizzleField(column: Column, table: Table): string {
    const isPrimaryKey = table.primaryKeys.includes(column.name);
    const isUnique = column.constraints.some(c => c.type === 'UNIQUE');

    let drizzleType = this.mapToDrizzleType(column.dataType);

    if (isPrimaryKey) {
      drizzleType = 'serial()';
    }

    if (!column.nullable && !isPrimaryKey) {
      drizzleType += '.notNull()';
    }

    if (isUnique && !isPrimaryKey) {
      drizzleType += '.unique()';
    }

    return drizzleType;
  }

  private mapToDrizzleType(postgresType: string): string {
    const typeMapping: Record<string, string> = {
      'smallint': 'integer()',
      'integer': 'integer()',
      'bigint': 'bigint()',
      'decimal': 'numeric()',
      'numeric': 'numeric()',
      'real': 'real()',
      'double precision': 'doublePrecision()',
      'character varying': 'text()',
      'varchar': 'text()',
      'character': 'char()',
      'char': 'char()',
      'text': 'text()',
      'bytea': 'bytea()',
      'timestamp': 'timestamp()',
      'timestamp with time zone': 'timestamp()',
      'timestamp without time zone': 'timestamp()',
      'date': 'date()',
      'time': 'time()',
      'time with time zone': 'time()',
      'time without time zone': 'time()',
      'interval': 'interval()',
      'boolean': 'boolean()',
      'bool': 'boolean()',
      'json': 'json()',
      'jsonb': 'jsonb()',
      'xml': 'text()',
      'uuid': 'uuid()',
      'money': 'numeric()'
    };

    return typeMapping[postgresType] || 'text()';
  }

  private toPascalCase(str: string): string {
    return str.replace(/(^|[_\s-])(\w)/g, (_, p1, p2) => p2.toUpperCase());
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }
}
