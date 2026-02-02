import { DatabaseSchema, Table, Column, ForeignKey, Index, Migration } from '../types/database.types';

export class SQLGenerator {
  private indent = '  ';
  private newline = '\n';

  generateCreateTableSQL(table: Table): string {
    const lines: string[] = [];
    
    lines.push(`CREATE TABLE ${this.quoteIdentifier(table.name)} (${this.newline}`);

    const columnDefs = table.columns.map(col => this.generateColumnDefinition(col));
    const constraintDefs = this.generateConstraintDefinitions(table);

    lines.push(columnDefs.concat(constraintDefs).join(`,${this.newline}`));
    lines.push(`${this.newline});${this.newline}`);

    if (table.comment) {
      lines.push(`COMMENT ON TABLE ${this.quoteIdentifier(table.name)} IS '${this.escapeString(table.comment)}';${this.newline}`);
    }

    return lines.join('');
  }

  generateDropTableSQL(tableName: string, cascade = false): string {
    const cascadeClause = cascade ? ' CASCADE' : '';
    return `DROP TABLE IF EXISTS ${this.quoteIdentifier(tableName)}${cascadeClause};${this.newline}`;
  }

  generateAlterTableSQL(oldTable: Table, newTable: Table): string[] {
    const statements: string[] = [];
    const tableName = newTable.name;

    const oldColumns = new Map(oldTable.columns.map(c => [c.name, c]));
    const newColumns = new Map(newTable.columns.map(c => [c.name, c]));

    for (const [name, column] of newColumns) {
      if (!oldColumns.has(name)) {
        statements.push(this.generateAddColumnSQL(tableName, column));
      } else if (this.hasColumnChanged(oldColumns.get(name)!, column)) {
        statements.push(this.generateAlterColumnSQL(tableName, column));
      }
    }

    for (const [name] of oldColumns) {
      if (!newColumns.has(name)) {
        statements.push(this.generateDropColumnSQL(tableName, name));
      }
    }

    return statements;
  }

  generateCreateIndexSQL(index: Index, tableName: string): string {
    const unique = index.unique ? 'UNIQUE ' : '';
    const columns = index.columns.map(c => this.quoteIdentifier(c)).join(', ');
    const type = index.type ? ` USING ${index.type}` : '';
    const where = index.where ? ` WHERE ${index.where}` : '';

    return `CREATE ${unique}INDEX ${this.quoteIdentifier(index.name)} ON ${this.quoteIdentifier(tableName)}${type} (${columns})${where};${this.newline}`;
  }

  generateDropIndexSQL(indexName: string): string {
    return `DROP INDEX IF EXISTS ${this.quoteIdentifier(indexName)};${this.newline}`;
  }

  generateInsertSQL(tableName: string, data: Record<string, any>[]): string[] {
    if (data.length === 0) return [];

    const columns = Object.keys(data[0]);
    const columnList = columns.map(c => this.quoteIdentifier(c)).join(', ');

    return data.map(row => {
      const values = columns.map(col => this.formatValue(row[col])).join(', ');
      return `INSERT INTO ${this.quoteIdentifier(tableName)} (${columnList}) VALUES (${values});${this.newline}`;
    });
  }

  generateUpdateSQL(tableName: string, data: Record<string, any>, where: Record<string, any>): string {
    const setClause = Object.entries(data)
      .map(([key, value]) => `${this.quoteIdentifier(key)} = ${this.formatValue(value)}`)
      .join(', ');

    const whereClause = Object.entries(where)
      .map(([key, value]) => `${this.quoteIdentifier(key)} = ${this.formatValue(value)}`)
      .join(' AND ');

    return `UPDATE ${this.quoteIdentifier(tableName)} SET ${setClause} WHERE ${whereClause};${this.newline}`;
  }

  generateDeleteSQL(tableName: string, where: Record<string, any>): string {
    const whereClause = Object.entries(where)
      .map(([key, value]) => `${this.quoteIdentifier(key)} = ${this.formatValue(value)}`)
      .join(' AND ');

    return `DELETE FROM ${this.quoteIdentifier(tableName)} WHERE ${whereClause};${this.newline}`;
  }

  generateSelectSQL(tableName: string, columns: string[] = ['*'], where?: Record<string, any>): string {
    const columnList = columns.length === 1 && columns[0] === '*' 
      ? '*' 
      : columns.map(c => this.quoteIdentifier(c)).join(', ');

    let sql = `SELECT ${columnList} FROM ${this.quoteIdentifier(tableName)}${this.newline}`;

    if (where && Object.keys(where).length > 0) {
      const whereClause = Object.entries(where)
        .map(([key, value]) => `${this.quoteIdentifier(key)} = ${this.formatValue(value)}`)
        .join(' AND ');
      sql += `WHERE ${whereClause}${this.newline}`;
    }

    return sql;
  }

  generateMigration(schema: DatabaseSchema, version: string): Migration {
    const upStatements: string[] = [];
    const downStatements: string[] = [];

    for (const table of schema.tables) {
      upStatements.push(this.generateCreateTableSQL(table));
      downStatements.push(this.generateDropTableSQL(table.name));

      for (const index of table.indexes) {
        upStatements.push(this.generateCreateIndexSQL(index, table.name));
        downStatements.push(this.generateDropIndexSQL(index.name));
      }
    }

    return {
      version,
      name: `Migration ${version}`,
      up: upStatements.join(this.newline),
      down: downStatements.join(this.newline),
      timestamp: Date.now()
    };
  }

  generateFullSchemaSQL(schema: DatabaseSchema): string {
    const statements: string[] = [];

    statements.push(`-- Database Schema: ${schema.name}${this.newline}`);
    statements.push(`-- Generated at: ${new Date().toISOString()}${this.newline}`);
    statements.push(this.newline);

    for (const table of schema.tables) {
      statements.push(this.generateCreateTableSQL(table));
      statements.push(this.newline);

      for (const column of table.columns) {
        if (column.comment) {
          statements.push(`COMMENT ON COLUMN ${this.quoteIdentifier(table.name)}.${this.quoteIdentifier(column.name)} IS '${this.escapeString(column.comment)}';${this.newline}`);
        }
      }

      for (const index of table.indexes) {
        statements.push(this.generateCreateIndexSQL(index, table.name));
      }

      statements.push(this.newline);
    }

    return statements.join('');
  }

  private generateColumnDefinition(column: Column): string {
    const parts: string[] = [];

    parts.push(this.indent + this.quoteIdentifier(column.name));
    parts.push(this.generateColumnType(column));

    if (!column.nullable) {
      parts.push('NOT NULL');
    }

    if (column.defaultValue !== undefined) {
      parts.push(`DEFAULT ${this.formatValue(column.defaultValue)}`);
    }

    for (const constraint of column.constraints) {
      parts.push(this.generateConstraint(constraint));
    }

    return parts.join(' ');
  }

  private generateColumnType(column: Column): string {
    let type = column.dataType;

    if (column.length && ['character varying', 'varchar', 'character', 'char'].includes(type)) {
      type += `(${column.length})`;
    }

    return type.toUpperCase();
  }

  private generateConstraint(constraint: any): string {
    switch (constraint.type) {
      case 'PRIMARY_KEY':
        return 'PRIMARY KEY';
      case 'FOREIGN_KEY':
        return `REFERENCES ${this.quoteIdentifier(constraint.referenceTable)}(${this.quoteIdentifier(constraint.referenceColumn)})`;
      case 'UNIQUE':
        return 'UNIQUE';
      case 'CHECK':
        return `CHECK (${constraint.value})`;
      case 'DEFAULT':
        return `DEFAULT ${constraint.value}`;
      default:
        return '';
    }
  }

  private generateConstraintDefinitions(table: Table): string[] {
    const constraints: string[] = [];

    if (table.primaryKeys.length > 0) {
      const pkColumns = table.primaryKeys.map(c => this.quoteIdentifier(c)).join(', ');
      constraints.push(`${this.indent}PRIMARY KEY (${pkColumns})`);
    }

    for (const fk of table.foreignKeys) {
      const columns = fk.columns.map(c => this.quoteIdentifier(c)).join(', ');
      const refColumns = fk.referenceColumns.map(c => this.quoteIdentifier(c)).join(', ');
      const onDelete = fk.onDelete ? ` ON DELETE ${fk.onDelete}` : '';
      const onUpdate = fk.onUpdate ? ` ON UPDATE ${fk.onUpdate}` : '';

      constraints.push(
        `${this.indent}CONSTRAINT ${this.quoteIdentifier(fk.name)} ` +
        `FOREIGN KEY (${columns}) REFERENCES ${this.quoteIdentifier(fk.referenceTable)} (${refColumns})${onDelete}${onUpdate}`
      );
    }

    return constraints;
  }

  private generateAddColumnSQL(tableName: string, column: Column): string {
    const columnDef = this.generateColumnDefinition(column);
    return `ALTER TABLE ${this.quoteIdentifier(tableName)} ADD COLUMN ${columnDef.replace(this.indent, '')};${this.newline}`;
  }

  private generateAlterColumnSQL(tableName: string, column: Column): string {
    const columnDef = this.generateColumnDefinition(column);
    return `ALTER TABLE ${this.quoteIdentifier(tableName)} ALTER COLUMN ${this.quoteIdentifier(column.name)} TYPE ${this.generateColumnType(column)};${this.newline}`;
  }

  private generateDropColumnSQL(tableName: string, columnName: string): string {
    return `ALTER TABLE ${this.quoteIdentifier(tableName)} DROP COLUMN ${this.quoteIdentifier(columnName)};${this.newline}`;
  }

  private hasColumnChanged(oldCol: Column, newCol: Column): boolean {
    return oldCol.dataType !== newCol.dataType ||
           oldCol.nullable !== newCol.nullable ||
           oldCol.length !== newCol.length ||
           JSON.stringify(oldCol.constraints) !== JSON.stringify(newCol.constraints);
  }

  private quoteIdentifier(name: string): string {
    return `"${name.replace(/"/g, '""')}"`;
  }

  private formatValue(value: any): string {
    if (value === null) return 'NULL';
    if (typeof value === 'string') return `'${this.escapeString(value)}'`;
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'number') return value.toString();
    if (value instanceof Date) return `'${value.toISOString()}'`;
    if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    return 'NULL';
  }

  private escapeString(str: string): string {
    return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
  }
}
