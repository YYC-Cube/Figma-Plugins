import { Table, Column, ForeignKey, Index } from '../types/database.types';
import { ValidationResult, ValidationIssue, ValidationCategory, ValidationSeverity } from '../types/validation.types';

export class NamingValidator {
  private snakeCasePattern = /^[a-z][a-z0-9_]*$/;
  private reservedKeywords = new Set([
    'select', 'insert', 'update', 'delete', 'create', 'drop', 'alter',
    'table', 'index', 'view', 'sequence', 'function', 'procedure',
    'user', 'role', 'grant', 'revoke', 'commit', 'rollback',
    'begin', 'end', 'if', 'else', 'case', 'when', 'then',
    'and', 'or', 'not', 'null', 'true', 'false', 'default',
    'primary', 'foreign', 'unique', 'check', 'constraint',
    'timestamp', 'date', 'time', 'interval', 'boolean', 'text'
  ]);

  validateTableName(name: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!this.snakeCasePattern.test(name)) {
      issues.push({
        id: `table-name-${name}`,
        severity: 'warning',
        category: 'naming',
        code: 'TABLE_NAME_NOT_SNAKE_CASE',
        message: `表名 "${name}" 不符合 snake_case 命名规范`,
        description: 'PostgreSQL 推荐使用小写字母、数字和下划线的 snake_case 命名规范',
        suggestion: `建议将表名改为: ${this.toSnakeCase(name)}`,
        location: { table: name },
        autoFixable: true,
        fix: async () => { }
      });
    }

    if (this.reservedKeywords.has(name.toLowerCase())) {
      issues.push({
        id: `table-reserved-${name}`,
        severity: 'error',
        category: 'naming',
        code: 'TABLE_NAME_RESERVED_KEYWORD',
        message: `表名 "${name}" 是 PostgreSQL 保留关键字`,
        description: '使用保留关键字作为表名可能导致语法错误',
        suggestion: `建议使用双引号或重命名表名`,
        location: { table: name },
        autoFixable: false
      });
    }

    if (name.length > 63) {
      issues.push({
        id: `table-length-${name}`,
        severity: 'warning',
        category: 'naming',
        code: 'TABLE_NAME_TOO_LONG',
        message: `表名 "${name}" 超过 63 字符限制`,
        description: 'PostgreSQL 标识符最大长度为 63 个字符',
        suggestion: `建议缩短表名`,
        location: { table: name },
        autoFixable: false
      });
    }

    return issues;
  }

  validateColumnName(name: string, tableName: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!this.snakeCasePattern.test(name)) {
      issues.push({
        id: `column-name-${tableName}-${name}`,
        severity: 'warning',
        category: 'naming',
        code: 'COLUMN_NAME_NOT_SNAKE_CASE',
        message: `列名 "${name}" 不符合 snake_case 命名规范`,
        description: 'PostgreSQL 推荐使用小写字母、数字和下划线的 snake_case 命名规范',
        suggestion: `建议将列名改为: ${this.toSnakeCase(name)}`,
        location: { table: tableName, column: name },
        autoFixable: true,
        fix: async () => { }
      });
    }

    if (this.reservedKeywords.has(name.toLowerCase())) {
      issues.push({
        id: `column-reserved-${tableName}-${name}`,
        severity: 'error',
        category: 'naming',
        code: 'COLUMN_NAME_RESERVED_KEYWORD',
        message: `列名 "${name}" 是 PostgreSQL 保留关键字`,
        description: '使用保留关键字作为列名可能导致语法错误',
        suggestion: `建议使用双引号或重命名列名`,
        location: { table: tableName, column: name },
        autoFixable: false
      });
    }

    if (name.length > 63) {
      issues.push({
        id: `column-length-${tableName}-${name}`,
        severity: 'warning',
        category: 'naming',
        code: 'COLUMN_NAME_TOO_LONG',
        message: `列名 "${name}" 超过 63 字符限制`,
        description: 'PostgreSQL 标识符最大长度为 63 个字符',
        suggestion: `建议缩短列名`,
        location: { table: tableName, column: name },
        autoFixable: false
      });
    }

    return issues;
  }

  validateIndexName(name: string, tableName: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!name.startsWith(`idx_${tableName}`) && !name.startsWith(`uk_${tableName}`)) {
      issues.push({
        id: `index-name-${tableName}-${name}`,
        severity: 'info',
        category: 'naming',
        code: 'INDEX_NAME_NON_STANDARD',
        message: `索引名 "${name}" 不符合标准命名规范`,
        description: '推荐使用 idx_表名_列名 或 uk_表名_列名 格式',
        suggestion: `建议将索引名改为: idx_${tableName}_${name.replace(/^idx_/, '').replace(/^uk_/, '')}`,
        location: { table: tableName },
        autoFixable: true,
        fix: async () => { }
      });
    }

    return issues;
  }

  validateForeignKeyName(name: string, tableName: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (!name.startsWith(`fk_${tableName}`)) {
      issues.push({
        id: `fk-name-${tableName}-${name}`,
        severity: 'info',
        category: 'naming',
        code: 'FOREIGN_KEY_NAME_NON_STANDARD',
        message: `外键名 "${name}" 不符合标准命名规范`,
        description: '推荐使用 fk_表名_列名 格式',
        suggestion: `建议将外键名改为: fk_${tableName}_${name.replace(/^fk_/, '')}`,
        location: { table: tableName },
        autoFixable: true,
        fix: async () => { }
      });
    }

    return issues;
  }

  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/[-\s]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase();
  }
}
