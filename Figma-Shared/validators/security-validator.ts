import { Table, Column } from '../types/database.types';
import { ValidationIssue, ValidationCategory } from '../types/validation.types';

export class SecurityValidator {
  private sensitiveKeywords = [
    'password', 'passwd', 'pwd', 'secret', 'token', 'api_key',
    'credit_card', 'ssn', 'social_security', 'passport',
    'phone', 'mobile', 'email', 'address', 'birthdate',
    'salary', 'income', 'bank_account', 'routing_number'
  ];

  private encryptionKeywords = ['encrypted', 'hashed', 'secure', 'protected'];

  validateSensitiveData(table: Table): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const column of table.columns) {
      const columnName = column.name.toLowerCase();

      for (const keyword of this.sensitiveKeywords) {
        if (columnName.includes(keyword)) {
          const isEncrypted = this.encryptionKeywords.some(
            enc => columnName.includes(enc) || column.comment?.toLowerCase().includes(enc)
          );

          if (!isEncrypted) {
            issues.push({
              id: `sensitive-data-${table.name}-${column.name}`,
              severity: 'warning',
              category: 'security',
              code: 'SENSITIVE_DATA_UNENCRYPTED',
              message: `列 "${column.name}" 可能包含敏感数据但未加密`,
              description: `基于列名 "${column.name}"，此列可能包含敏感信息`,
              suggestion: '考虑对敏感数据进行加密或使用专门的加密字段',
              location: { table: table.name, column: column.name },
              autoFixable: false
            });
          }
          break;
        }
      }
    }

    return issues;
  }

  validatePasswordStorage(column: Column, tableName: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (column.name.toLowerCase().includes('password') || column.name.toLowerCase().includes('pwd')) {
      if (column.dataType !== 'character varying' && column.dataType !== 'text') {
        issues.push({
          id: `password-type-${tableName}-${column.name}`,
          severity: 'error',
          category: 'security',
          code: 'PASSWORD_STORAGE_TYPE',
          message: `密码列 "${column.name}" 应使用可变长度字符类型`,
          description: '密码应该存储为哈希值，需要足够的长度',
          suggestion: `建议使用 character varying(255) 或 text 类型`,
          location: { table: tableName, column: column.name },
          autoFixable: true,
          fix: async () => { }
        });
      }

      if (column.nullable) {
        issues.push({
          id: `password-nullable-${tableName}-${column.name}`,
          severity: 'warning',
          category: 'security',
          code: 'PASSWORD_NULLABLE',
          message: `密码列 "${column.name}" 不应为可空`,
          description: '密码字段应该有值，不允许为空',
          suggestion: '将密码字段设置为 NOT NULL',
          location: { table: tableName, column: column.name },
          autoFixable: true,
          fix: async () => { }
        });
      }
    }

    return issues;
  }

  validatePIIData(table: Table): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const piiColumns = table.columns.filter(column => {
      const name = column.name.toLowerCase();
      return ['email', 'phone', 'mobile', 'ssn', 'social_security', 'passport'].some(keyword => name.includes(keyword));
    });

    if (piiColumns.length > 0) {
      const hasAuditColumns = table.columns.some(
        col => ['created_at', 'updated_at', 'created_by', 'updated_by'].includes(col.name.toLowerCase())
      );

      if (!hasAuditColumns) {
        issues.push({
          id: `missing-audit-${table.name}`,
          severity: 'info',
          category: 'security',
          code: 'MISSING_AUDIT_COLUMNS',
          message: `表 "${table.name}" 包含 PII 数据但缺少审计列`,
          description: '包含个人身份信息的表应该有审计追踪',
          suggestion: '考虑添加 created_at, updated_at, created_by, updated_by 等审计列',
          location: { table: table.name },
          autoFixable: false
        });
      }
    }

    return issues;
  }

  validateSQLInjectionRisk(table: Table): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const column of table.columns) {
      if (['text', 'character varying', 'varchar'].includes(column.dataType)) {
        const columnName = column.name.toLowerCase();

        if (['query', 'sql', 'script', 'code', 'expression'].some(keyword => columnName.includes(keyword))) {
          issues.push({
            id: `sql-injection-risk-${table.name}-${column.name}`,
            severity: 'warning',
            category: 'security',
            code: 'SQL_INJECTION_RISK',
            message: `列 "${column.name}" 可能存在 SQL 注入风险`,
            description: '存储可执行代码或 SQL 语句的列需要特别小心',
            suggestion: '确保应用层正确处理此列的数据，使用参数化查询',
            location: { table: table.name, column: column.name },
            autoFixable: false
          });
        }
      }
    }

    return issues;
  }

  validateDataRetention(table: Table): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const hasTimestamp = table.columns.some(
      col => ['created_at', 'timestamp', 'date'].some(keyword => col.name.toLowerCase().includes(keyword))
    );

    if (hasTimestamp) {
      const hasRetentionPolicy = table.comment?.toLowerCase().includes('retention') ||
                                table.comment?.toLowerCase().includes('ttl') ||
                                table.comment?.toLowerCase().includes('expire');

      if (!hasRetentionPolicy) {
        issues.push({
          id: `missing-retention-${table.name}`,
          severity: 'info',
          category: 'security',
          code: 'MISSING_RETENTION_POLICY',
          message: `表 "${table.name}" 包含时间数据但未定义保留策略`,
          description: '包含时间数据的表应该有明确的数据保留策略',
          suggestion: '考虑添加数据保留策略或 TTL 索引',
          location: { table: table.name },
          autoFixable: false
        });
      }
    }

    return issues;
  }

  validateAccessControl(table: Table): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const hasPermissionColumns = table.columns.some(
      col => ['role', 'permission', 'access', 'owner', 'user_id'].some(keyword => col.name.toLowerCase().includes(keyword))
    );

    if (hasPermissionColumns) {
      const hasRowLevelSecurity = table.comment?.toLowerCase().includes('rls') ||
                                  table.comment?.toLowerCase().includes('row level security');

      if (!hasRowLevelSecurity) {
        issues.push({
          id: `missing-rls-${table.name}`,
          severity: 'info',
          category: 'security',
          code: 'MISSING_ROW_LEVEL_SECURITY',
          message: `表 "${table.name}" 包含权限相关列但未定义 RLS`,
          description: '包含权限控制的表应该使用行级安全策略',
          suggestion: '考虑启用 PostgreSQL 的行级安全 (RLS)',
          location: { table: table.name },
          autoFixable: false
        });
      }
    }

    return issues;
  }

  validateDefaultValues(table: Table): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const column of table.columns) {
      if (column.defaultValue) {
        const defaultValue = String(column.defaultValue).toLowerCase();

        if (['password', 'secret', 'token'].some(keyword => column.name.toLowerCase().includes(keyword))) {
          if (defaultValue !== 'null' && !defaultValue.includes('crypt') && !defaultValue.includes('hash')) {
            issues.push({
              id: `insecure-default-${table.name}-${column.name}`,
              severity: 'error',
              category: 'security',
              code: 'INSECURE_DEFAULT_VALUE',
              message: `敏感列 "${column.name}" 的默认值可能不安全`,
              description: '敏感字段的默认值应该是加密或哈希后的值',
              suggestion: '使用加密或哈希函数作为默认值',
              location: { table: table.name, column: column.name },
              autoFixable: true,
              fix: async () => { }
            });
          }
        }
      }
    }

    return issues;
  }

  validateForeignKeyConstraints(table: Table): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    for (const fk of table.foreignKeys) {
      if (fk.onDelete === 'CASCADE' || fk.onDelete === 'SET NULL') {
        const isSensitiveTable = ['user', 'account', 'profile', 'payment'].some(
          keyword => fk.referenceTable.toLowerCase().includes(keyword)
        );

        if (isSensitiveTable) {
          issues.push({
            id: `sensitive-cascade-${table.name}-${fk.name}`,
            severity: 'warning',
            category: 'security',
            code: 'SENSITIVE_CASCADE',
            message: `外键 "${fk.name}" 引用敏感表并使用级联操作`,
            description: '对敏感表使用级联删除可能导致意外的数据丢失',
            suggestion: '考虑使用 RESTRICT 或 NO ACTION 代替 CASCADE',
            location: { table: table.name },
            autoFixable: true,
            fix: async () => { }
          });
        }
      }
    }

    return issues;
  }
}
