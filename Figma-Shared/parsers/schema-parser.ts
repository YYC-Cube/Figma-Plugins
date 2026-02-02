import { DatabaseSchema, Table, Column, ForeignKey, Index } from '../types/database.types';

export class SchemaParser {
  parseFromSQL(sql: string): DatabaseSchema {
    const statements = this.splitStatements(sql);
    const tables: Table[] = [];

    for (const statement of statements) {
      if (this.isCreateTableStatement(statement)) {
        const table = this.parseCreateTable(statement);
        if (table) {
          tables.push(table);
        }
      }
    }

    return {
      name: 'parsed_schema',
      tables
    };
  }

  parseFromJSON(json: string): DatabaseSchema {
    try {
      const data = JSON.parse(json);
      return this.validateAndNormalizeSchema(data);
    } catch (error: any) {
      throw new Error(`Failed to parse JSON schema: ${error?.message || 'Unknown error'}`);
    }
  }

  parseFromPrisma(prismaSchema: string): DatabaseSchema {
    const tables: Table[] = [];
    const modelRegex = /model\s+(\w+)\s*{([^}]+)}/g;
    let match;

    while ((match = modelRegex.exec(prismaSchema)) !== null) {
      const [, modelName, modelBody] = match;
      const table = this.parsePrismaModel(modelName, modelBody);
      if (table) {
        tables.push(table);
      }
    }

    return {
      name: 'prisma_schema',
      tables
    };
  }

  private splitStatements(sql: string): string[] {
    return sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  private isCreateTableStatement(statement: string): boolean {
    return /^CREATE\s+TABLE\s+/i.test(statement);
  }

  private parseCreateTable(statement: string): Table | null {
    const tableNameMatch = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["`']?(\w+)["`']?\.)?["`']?(\w+)["`']?/i);
    if (!tableNameMatch) return null;

    const [, schema, name] = tableNameMatch;
    const columns: Column[] = [];
    const primaryKeys: string[] = [];
    const foreignKeys: ForeignKey[] = [];
    const indexes: Index[] = [];

    const bodyMatch = statement.match(/\(([\s\S]+)\)/);
    if (!bodyMatch) return null;

    const body = bodyMatch[1];
    const lines = this.splitLines(body);

    for (const line of lines) {
      const trimmed = line.trim();
      if (this.isColumnDefinition(trimmed)) {
        const column = this.parseColumn(trimmed);
        if (column) columns.push(column);
      } else if (this.isPrimaryKeyConstraint(trimmed)) {
        const pkColumns = this.parsePrimaryKey(trimmed);
        primaryKeys.push(...pkColumns);
      } else if (this.isForeignKeyConstraint(trimmed)) {
        const fk = this.parseForeignKey(trimmed);
        if (fk) foreignKeys.push(fk);
      } else if (this.isIndexDefinition(trimmed)) {
        const index = this.parseIndex(trimmed);
        if (index) indexes.push(index);
      }
    }

    return {
      name,
      schema: schema || 'public',
      columns,
      primaryKeys,
      foreignKeys,
      indexes
    };
  }

  private splitLines(text: string): string[] {
    return text.split(',').map(l => l.trim()).filter(l => l.length > 0);
  }

  private isColumnDefinition(line: string): boolean {
    return !line.toUpperCase().startsWith('CONSTRAINT') &&
           !line.toUpperCase().startsWith('PRIMARY KEY') &&
           !line.toUpperCase().startsWith('FOREIGN KEY') &&
           !line.toUpperCase().startsWith('UNIQUE') &&
           !line.toUpperCase().startsWith('INDEX') &&
           !line.toUpperCase().startsWith('KEY');
  }

  private parseColumn(line: string): Column | null {
    const parts = line.split(/\s+/);
    if (parts.length < 2) return null;

    const name = parts[0].replace(/["`']/g, '');
    const typeMatch = line.match(new RegExp(`${name}\\s+(\\w+(?:\\([^)]+\\))?)`, 'i'));
    const dataType = typeMatch ? typeMatch[1] : 'text';

    const nullable = !/\bNOT\s+NULL\b/i.test(line);
    const defaultValueMatch = line.match(/DEFAULT\s+([^\s,]+)/i);
    const defaultValue = defaultValueMatch ? defaultValueMatch[1] : undefined;

    const constraints: any[] = [];
    if (/\bPRIMARY\s+KEY\b/i.test(line)) {
      constraints.push({ type: 'PRIMARY_KEY' });
    }
    if (/\bUNIQUE\b/i.test(line)) {
      constraints.push({ type: 'UNIQUE' });
    }

    return {
      name,
      dataType: dataType as any,
      nullable,
      defaultValue,
      constraints
    };
  }

  private isPrimaryKeyConstraint(line: string): boolean {
    return /\bPRIMARY\s+KEY\b/i.test(line);
  }

  private parsePrimaryKey(line: string): string[] {
    const match = line.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i);
    if (!match) return [];

    return match[1]
      .split(',')
      .map(c => c.trim().replace(/["`']/g, ''));
  }

  private isForeignKeyConstraint(line: string): boolean {
    return /\bFOREIGN\s+KEY\b/i.test(line);
  }

  private parseForeignKey(line: string): ForeignKey | null {
    const nameMatch = line.match(/CONSTRAINT\s+["`']?(\w+)["`']?/i);
    const name = nameMatch ? nameMatch[1] : `fk_${Date.now()}`;

    const columnsMatch = line.match(/FOREIGN\s+KEY\s*\(([^)]+)\)/i);
    const columns = columnsMatch 
      ? columnsMatch[1].split(',').map(c => c.trim().replace(/["`']/g, ''))
      : [];

    const refMatch = line.match(/REFERENCES\s+["`']?(\w+)["`']?(?:\.["`']?(\w+)["`']?)?\s*\(([^)]+)\)/i);
    if (!refMatch) return null;

    const [, referenceTable, , referenceColumnsStr] = refMatch;
    const referenceColumns = referenceColumnsStr.split(',').map(c => c.trim().replace(/["`']/g, ''));

    const onDeleteMatch = line.match(/ON\s+DELETE\s+(\w+)/i);
    const onDelete = onDeleteMatch ? onDeleteMatch[1].toUpperCase() as any : undefined;

    const onUpdateMatch = line.match(/ON\s+UPDATE\s+(\w+)/i);
    const onUpdate = onUpdateMatch ? onUpdateMatch[1].toUpperCase() as any : undefined;

    return {
      name,
      columns,
      referenceTable,
      referenceColumns,
      onDelete,
      onUpdate
    };
  }

  private isIndexDefinition(line: string): boolean {
    return /\bINDEX\b/i.test(line) || /\bKEY\b/i.test(line);
  }

  private parseIndex(line: string): Index | null {
    const nameMatch = line.match(/(?:INDEX|KEY)\s+["`']?(\w+)["`']?/i);
    const name = nameMatch ? nameMatch[1] : `idx_${Date.now()}`;

    const columnsMatch = line.match(/\(([^)]+)\)/);
    const columns = columnsMatch 
      ? columnsMatch[1].split(',').map(c => c.trim().replace(/["`']/g, ''))
      : [];

    const unique = /\bUNIQUE\b/i.test(line);
    const typeMatch = line.match(/USING\s+(\w+)/i);
    const type = typeMatch ? typeMatch[1].toLowerCase() as any : undefined;

    return {
      name,
      columns,
      unique,
      type
    };
  }

  private parsePrismaModel(modelName: string, modelBody: string): Table | null {
    const columns: Column[] = [];
    const primaryKeys: string[] = [];
    const foreignKeys: ForeignKey[] = [];

    const lines = modelBody.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    for (const line of lines) {
      if (line.startsWith('@') || line.startsWith('//')) continue;

      const fieldMatch = line.match(/^(\w+)\s+(\w+)/);
      if (fieldMatch) {
        const [, name, prismaType] = fieldMatch;
        const column = this.parsePrismaField(name, prismaType, line);
        if (column) {
          columns.push(column);
          if (column.constraints.some(c => c.type === 'PRIMARY_KEY')) {
            primaryKeys.push(name);
          }
        }
      }

      const relationMatch = line.match(/@relation\s*\(\s*fields:\s*\[(\w+)\]\s*,\s*references:\s*\[(\w+)\]\s*,\s*references:\s*\[?(\w+)\]?\s*\)/i);
      if (relationMatch) {
        const [, field, refField, refTable] = relationMatch;
        foreignKeys.push({
          name: `fk_${modelName}_${field}`,
          columns: [field],
          referenceTable: refTable,
          referenceColumns: [refField]
        });
      }
    }

    return {
      name: modelName,
      schema: 'public',
      columns,
      primaryKeys,
      foreignKeys,
      indexes: []
    };
  }

  private parsePrismaField(name: string, prismaType: string, line: string): Column | null {
    const typeMapping: Record<string, any> = {
      'String': 'character varying',
      'Int': 'integer',
      'BigInt': 'bigint',
      'Float': 'double precision',
      'Decimal': 'numeric',
      'Boolean': 'boolean',
      'DateTime': 'timestamp',
      'Date': 'date',
      'Time': 'time',
      'Json': 'jsonb',
      'Bytes': 'bytea'
    };

    const dataType = typeMapping[prismaType] || 'text';
    const nullable = !line.includes('?') && !line.includes('@default');

    const constraints: any[] = [];
    if (line.includes('@id')) {
      constraints.push({ type: 'PRIMARY_KEY' });
    }
    if (line.includes('@unique')) {
      constraints.push({ type: 'UNIQUE' });
    }

    return {
      name,
      dataType,
      nullable,
      constraints
    };
  }

  private validateAndNormalizeSchema(data: any): DatabaseSchema {
    if (!data.tables || !Array.isArray(data.tables)) {
      throw new Error('Invalid schema: missing or invalid tables array');
    }

    const tables = data.tables.map((table: any) => ({
      name: table.name,
      schema: table.schema || 'public',
      columns: table.columns || [],
      primaryKeys: table.primaryKeys || [],
      foreignKeys: table.foreignKeys || [],
      indexes: table.indexes || []
    }));

    return {
      name: data.name || 'imported_schema',
      tables,
      extensions: data.extensions
    };
  }
}
