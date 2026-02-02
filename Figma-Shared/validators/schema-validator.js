"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidator = void 0;
const naming_validator_1 = require("./naming-validator");
const type_validator_1 = require("./type-validator");
const performance_validator_1 = require("./performance-validator");
const security_validator_1 = require("./security-validator");
class SchemaValidator {
    constructor(config) {
        this.namingValidator = new naming_validator_1.NamingValidator();
        this.typeValidator = new type_validator_1.TypeValidator();
        this.performanceValidator = new performance_validator_1.PerformanceValidator();
        this.securityValidator = new security_validator_1.SecurityValidator();
        this.config = Object.assign({ enabledRules: ['*'], severityOverrides: {}, namingConventions: {
                tables: { pattern: /^[a-z][a-z0-9_]*$/, description: 'snake_case', examples: { valid: ['users', 'user_profiles'], invalid: ['Users', 'userProfiles'] } },
                columns: { pattern: /^[a-z][a-z0-9_]*$/, description: 'snake_case', examples: { valid: ['user_id', 'created_at'], invalid: ['userId', 'createdAt'] } },
                indexes: { pattern: /^idx_[a-z][a-z0-9_]*$/, description: 'idx_table_column', examples: { valid: ['idx_users_email'], invalid: ['users_email_idx'] } },
                foreignKeys: { pattern: /^fk_[a-z][a-z0-9_]*$/, description: 'fk_table_column', examples: { valid: ['fk_posts_user_id'], invalid: ['posts_user_id_fk'] } }
            }, performanceThresholds: {
                maxColumnsPerTable: 100,
                maxForeignKeysPerTable: 50,
                maxIndexColumns: 5
            }, securityChecks: {
                checkForSensitiveData: true,
                checkForEncryption: true,
                checkForPermissions: true
            } }, config);
    }
    validateSchema(schema) {
        const issues = [];
        for (const table of schema.tables) {
            const tableIssues = this.validateTable(table, schema.tables);
            issues.push(...tableIssues);
        }
        const crossTableIssues = this.validateCrossTableRelations(schema.tables);
        issues.push(...crossTableIssues);
        return this.createValidationResult(issues);
    }
    validateTable(table, allTables) {
        const issues = [];
        issues.push(...this.namingValidator.validateTableName(table.name));
        for (const column of table.columns) {
            issues.push(...this.namingValidator.validateColumnName(column.name, table.name));
            issues.push(...this.typeValidator.validateColumnType(column, table.name));
            issues.push(...this.typeValidator.validateTypeLength(column, table.name));
            issues.push(...this.typeValidator.validateNumericPrecision(column, table.name));
            issues.push(...this.typeValidator.validateTimestampTimezone(column, table.name));
            issues.push(...this.typeValidator.validateTextVsVarchar(column, table.name));
            issues.push(...this.typeValidator.validateBooleanNaming(column, table.name));
            issues.push(...this.securityValidator.validatePasswordStorage(column, table.name));
        }
        issues.push(...this.typeValidator.validateTypeCompatibility(table));
        for (const index of table.indexes) {
            issues.push(...this.namingValidator.validateIndexName(index.name, table.name));
            issues.push(...this.performanceValidator.validateIndexDesign(index, table));
        }
        for (const fk of table.foreignKeys) {
            issues.push(...this.namingValidator.validateForeignKeyName(fk.name, table.name));
            issues.push(...this.securityValidator.validateForeignKeyConstraints(table));
        }
        issues.push(...this.performanceValidator.validateTableStructure(table));
        issues.push(...this.performanceValidator.validateIndexUsage(table));
        issues.push(...this.performanceValidator.validateRedundantIndexes(table));
        issues.push(...this.performanceValidator.validateNPlusOnePotential(table, allTables));
        issues.push(...this.performanceValidator.validateLargeTextColumns(table));
        issues.push(...this.performanceValidator.validateMissingIndexes(table));
        issues.push(...this.performanceValidator.validateCascadeDeletes(table));
        issues.push(...this.securityValidator.validateSensitiveData(table));
        issues.push(...this.securityValidator.validatePIIData(table));
        issues.push(...this.securityValidator.validateSQLInjectionRisk(table));
        issues.push(...this.securityValidator.validateDataRetention(table));
        issues.push(...this.securityValidator.validateAccessControl(table));
        issues.push(...this.securityValidator.validateDefaultValues(table));
        return this.filterIssues(issues);
    }
    validateCrossTableRelations(tables) {
        const issues = [];
        for (const table of tables) {
            for (const fk of table.foreignKeys) {
                const referencedTable = tables.find(t => t.name === fk.referenceTable);
                if (!referencedTable) {
                    issues.push({
                        id: `missing-ref-table-${table.name}-${fk.name}`,
                        severity: 'error',
                        category: 'best_practice',
                        code: 'MISSING_REFERENCED_TABLE',
                        message: `外键 "${fk.name}" 引用的表 "${fk.referenceTable}" 不存在`,
                        description: '外键引用的表必须在同一数据库中',
                        suggestion: `检查表名 "${fk.referenceTable}" 是否正确`,
                        location: { table: table.name },
                        autoFixable: false
                    });
                    continue;
                }
                for (const refColumn of fk.referenceColumns) {
                    const column = referencedTable.columns.find(c => c.name === refColumn);
                    if (!column) {
                        issues.push({
                            id: `missing-ref-column-${table.name}-${fk.name}`,
                            severity: 'error',
                            category: 'best_practice',
                            code: 'MISSING_REFERENCED_COLUMN',
                            message: `外键 "${fk.name}" 引用的列 "${fk.referenceTable}.${refColumn}" 不存在`,
                            description: '外键引用的列必须在目标表中存在',
                            suggestion: `检查列名 "${refColumn}" 是否正确`,
                            location: { table: table.name },
                            autoFixable: false
                        });
                    }
                    else {
                        const fkColumn = table.columns.find(c => c.name === fk.columns[0]);
                        if (fkColumn && column.dataType !== fkColumn.dataType) {
                            issues.push({
                                id: `type-mismatch-${table.name}-${fk.name}`,
                                severity: 'warning',
                                category: 'best_practice',
                                code: 'FOREIGN_KEY_TYPE_MISMATCH',
                                message: `外键 "${fk.name}" 的数据类型不匹配`,
                                description: `外键列 "${fkColumn.name}" (${fkColumn.dataType}) 和引用列 "${column.name}" (${column.dataType}) 的数据类型不同`,
                                suggestion: '确保外键列和引用列的数据类型一致',
                                location: { table: table.name, column: fkColumn.name },
                                autoFixable: true,
                                fix: () => __awaiter(this, void 0, void 0, function* () { })
                            });
                        }
                    }
                }
            }
        }
        return this.filterIssues(issues);
    }
    validateSingleTable(table) {
        const issues = this.validateTable(table, [table]);
        return this.createValidationResult(issues);
    }
    validateSingleColumn(column, tableName) {
        const issues = [];
        issues.push(...this.namingValidator.validateColumnName(column.name, tableName));
        issues.push(...this.typeValidator.validateColumnType(column, tableName));
        issues.push(...this.typeValidator.validateTypeLength(column, tableName));
        issues.push(...this.typeValidator.validateNumericPrecision(column, tableName));
        issues.push(...this.typeValidator.validateTimestampTimezone(column, tableName));
        issues.push(...this.typeValidator.validateTextVsVarchar(column, tableName));
        issues.push(...this.typeValidator.validateBooleanNaming(column, tableName));
        issues.push(...this.securityValidator.validatePasswordStorage(column, tableName));
        return this.createValidationResult(issues);
    }
    createValidationResult(issues) {
        const summary = {
            total: issues.length,
            errors: issues.filter(i => i.severity === 'error').length,
            warnings: issues.filter(i => i.severity === 'warning').length,
            infos: issues.filter(i => i.severity === 'info').length
        };
        const score = this.calculateScore(summary);
        return {
            valid: summary.errors === 0,
            issues,
            summary,
            score
        };
    }
    calculateScore(summary) {
        const totalWeight = summary.errors * 10 + summary.warnings * 3 + summary.infos * 1;
        const maxScore = 100;
        const score = Math.max(0, maxScore - totalWeight);
        return Math.round(score);
    }
    filterIssues(issues) {
        if (this.config.enabledRules.includes('*')) {
            return issues.map(issue => this.applySeverityOverride(issue));
        }
        const enabledSet = new Set(this.config.enabledRules);
        return issues
            .filter(issue => enabledSet.has(issue.code))
            .map(issue => this.applySeverityOverride(issue));
    }
    applySeverityOverride(issue) {
        const override = this.config.severityOverrides[issue.code];
        if (override) {
            return Object.assign(Object.assign({}, issue), { severity: override });
        }
        return issue;
    }
    updateConfig(newConfig) {
        this.config = Object.assign(Object.assign({}, this.config), newConfig);
    }
    getConfig() {
        return Object.assign({}, this.config);
    }
    getEnabledRules() {
        const rules = [];
        rules.push('TABLE_NAME_NOT_SNAKE_CASE');
        rules.push('TABLE_NAME_RESERVED_KEYWORD');
        rules.push('TABLE_NAME_TOO_LONG');
        rules.push('COLUMN_NAME_NOT_SNAKE_CASE');
        rules.push('COLUMN_NAME_RESERVED_KEYWORD');
        rules.push('COLUMN_NAME_TOO_LONG');
        rules.push('INDEX_NAME_NON_STANDARD');
        rules.push('FOREIGN_KEY_NAME_NON_STANDARD');
        rules.push('TYPE_RECOMMENDATION');
        rules.push('TYPE_LENGTH_NOT_SPECIFIED');
        rules.push('TYPE_LENGTH_TOO_LONG');
        rules.push('NUMERIC_PRECISION_NOT_SPECIFIED');
        rules.push('TYPE_INCOMPATIBLE');
        rules.push('TIMESTAMP_WITHOUT_TIMEZONE');
        rules.push('CONSIDER_USING_TEXT');
        rules.push('BOOLEAN_NAMING_CONVENTION');
        rules.push('TOO_MANY_COLUMNS');
        rules.push('TOO_MANY_FOREIGN_KEYS');
        rules.push('MISSING_FOREIGN_KEY_INDEX');
        rules.push('TOO_MANY_INDEX_COLUMNS');
        rules.push('REDUNDANT_UNIQUE_INDEX');
        rules.push('REDUNDANT_INDEX');
        rules.push('N_PLUS_ONE_RISK');
        rules.push('MANY_LARGE_TEXT_COLUMNS');
        rules.push('MISSING_INDEX');
        rules.push('CASCADE_DELETE_WARNING');
        rules.push('SENSITIVE_DATA_UNENCRYPTED');
        rules.push('PASSWORD_STORAGE_TYPE');
        rules.push('PASSWORD_NULLABLE');
        rules.push('MISSING_AUDIT_COLUMNS');
        rules.push('SQL_INJECTION_RISK');
        rules.push('MISSING_RETENTION_POLICY');
        rules.push('MISSING_ROW_LEVEL_SECURITY');
        rules.push('INSECURE_DEFAULT_VALUE');
        rules.push('SENSITIVE_CASCADE');
        rules.push('MISSING_REFERENCED_TABLE');
        rules.push('MISSING_REFERENCED_COLUMN');
        rules.push('FOREIGN_KEY_TYPE_MISMATCH');
        return rules;
    }
}
exports.SchemaValidator = SchemaValidator;
