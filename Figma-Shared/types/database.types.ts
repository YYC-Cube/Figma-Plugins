export type PostgreSQLDataType =
  | 'smallint'
  | 'integer'
  | 'bigint'
  | 'decimal'
  | 'numeric'
  | 'real'
  | 'double precision'
  | 'smallserial'
  | 'serial'
  | 'bigserial'
  | 'character varying'
  | 'varchar'
  | 'character'
  | 'char'
  | 'text'
  | 'bytea'
  | 'timestamp'
  | 'timestamp with time zone'
  | 'timestamp without time zone'
  | 'date'
  | 'time'
  | 'time with time zone'
  | 'time without time zone'
  | 'interval'
  | 'boolean'
  | 'bool'
  | 'point'
  | 'line'
  | 'lseg'
  | 'box'
  | 'path'
  | 'polygon'
  | 'circle'
  | 'cidr'
  | 'inet'
  | 'macaddr'
  | 'macaddr8'
  | 'json'
  | 'jsonb'
  | 'xml'
  | 'uuid'
  | 'money';

export interface ColumnConstraint {
  type: 'PRIMARY_KEY' | 'FOREIGN_KEY' | 'UNIQUE' | 'NOT_NULL' | 'CHECK' | 'DEFAULT';
  value?: string;
  referenceTable?: string;
  referenceColumn?: string;
}

export interface Column {
  name: string;
  dataType: PostgreSQLDataType;
  length?: number;
  nullable: boolean;
  defaultValue?: string;
  constraints: ColumnConstraint[];
  comment?: string;
}

export interface ForeignKey {
  name: string;
  columns: string[];
  referenceTable: string;
  referenceColumns: string[];
  onDelete?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION';
}

export interface Index {
  name: string;
  columns: string[];
  unique: boolean;
  type?: 'btree' | 'hash' | 'gist' | 'gin' | 'spgist' | 'brin';
  where?: string;
}

export interface Table {
  name: string;
  schema?: string;
  columns: Column[];
  primaryKeys: string[];
  foreignKeys: ForeignKey[];
  indexes: Index[];
  comment?: string;
}

export interface DatabaseSchema {
  name: string;
  version?: string;
  tables: Table[];
  relations?: any[];
  extensions?: string[];
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    description?: string;
  };
}

export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  fields: any[];
}

export interface Migration {
  version: string;
  name: string;
  up: string;
  down: string;
  timestamp: number;
}
