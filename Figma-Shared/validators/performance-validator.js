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
exports.PerformanceValidator = void 0;
class PerformanceValidator {
    constructor() {
        this.maxColumnsPerTable = 100;
        this.maxForeignKeysPerTable = 50;
        this.maxIndexColumns = 5;
        this.recommendedIndexColumns = 3;
    }
    validateTableStructure(table) {
        const issues = [];
        if (table.columns.length > this.maxColumnsPerTable) {
            issues.push({
                id: `too-many-columns-${table.name}`,
                severity: 'warning',
                category: 'performance',
                code: 'TOO_MANY_COLUMNS',
                message: `表 "${table.name}" 有 ${table.columns.length} 列，超过推荐值 ${this.maxColumnsPerTable}`,
                description: '过多的列可能导致性能下降和维护困难',
                suggestion: '考虑将表拆分为多个相关表',
                location: { table: table.name },
                autoFixable: false
            });
        }
        if (table.foreignKeys.length > this.maxForeignKeysPerTable) {
            issues.push({
                id: `too-many-fks-${table.name}`,
                severity: 'warning',
                category: 'performance',
                code: 'TOO_MANY_FOREIGN_KEYS',
                message: `表 "${table.name}" 有 ${table.foreignKeys.length} 个外键，超过推荐值 ${this.maxForeignKeysPerTable}`,
                description: '过多的外键可能影响插入和更新性能',
                suggestion: '考虑重新评估表关系设计',
                location: { table: table.name },
                autoFixable: false
            });
        }
        return issues;
    }
    validateIndexUsage(table) {
        const issues = [];
        const indexedColumns = new Set();
        for (const index of table.indexes) {
            for (const column of index.columns) {
                indexedColumns.add(column);
            }
        }
        const foreignKeyColumns = new Set();
        for (const fk of table.foreignKeys) {
            for (const column of fk.columns) {
                foreignKeyColumns.add(column);
            }
        }
        for (const fkColumn of foreignKeyColumns) {
            if (!indexedColumns.has(fkColumn)) {
                issues.push({
                    id: `missing-fk-index-${table.name}-${fkColumn}`,
                    severity: 'warning',
                    category: 'performance',
                    code: 'MISSING_FOREIGN_KEY_INDEX',
                    message: `外键列 "${fkColumn}" 缺少索引`,
                    description: '外键列缺少索引可能导致 JOIN 操作性能下降',
                    suggestion: `建议为外键列 "${fkColumn}" 创建索引`,
                    location: { table: table.name, column: fkColumn },
                    autoFixable: true,
                    fix: () => __awaiter(this, void 0, void 0, function* () { })
                });
            }
        }
        return issues;
    }
    validateIndexDesign(index, table) {
        const issues = [];
        if (index.columns.length > this.maxIndexColumns) {
            issues.push({
                id: `too-many-index-columns-${table.name}-${index.name}`,
                severity: 'warning',
                category: 'performance',
                code: 'TOO_MANY_INDEX_COLUMNS',
                message: `索引 "${index.name}" 包含 ${index.columns.length} 列，超过推荐值 ${this.maxIndexColumns}`,
                description: '过多的索引列可能降低索引效率',
                suggestion: `考虑减少索引列数到 ${this.recommendedIndexColumns} 列以内`,
                location: { table: table.name },
                autoFixable: true,
                fix: () => __awaiter(this, void 0, void 0, function* () { })
            });
        }
        if (index.columns.length === 1 && index.unique) {
            const column = table.columns.find((c) => c.name === index.columns[0]);
            if (column && column.constraints.some((c) => c.type === 'PRIMARY_KEY')) {
                issues.push({
                    id: `redundant-unique-index-${table.name}-${index.name}`,
                    severity: 'info',
                    category: 'performance',
                    code: 'REDUNDANT_UNIQUE_INDEX',
                    message: `索引 "${index.name}" 可能是冗余的`,
                    description: '主键列已经有唯一约束，额外的唯一索引可能不必要',
                    suggestion: '考虑删除此索引',
                    location: { table: table.name },
                    autoFixable: true,
                    fix: () => __awaiter(this, void 0, void 0, function* () { })
                });
            }
        }
        return issues;
    }
    validateRedundantIndexes(table) {
        const issues = [];
        for (let i = 0; i < table.indexes.length; i++) {
            for (let j = i + 1; j < table.indexes.length; j++) {
                const index1 = table.indexes[i];
                const index2 = table.indexes[j];
                if (this.isIndexPrefix(index1, index2)) {
                    issues.push({
                        id: `redundant-index-${table.name}-${index1.name}-${index2.name}`,
                        severity: 'warning',
                        category: 'performance',
                        code: 'REDUNDANT_INDEX',
                        message: `索引 "${index1.name}" 和 "${index2.name}" 存在冗余`,
                        description: '一个索引的列是另一个索引的前缀，后者可能不必要',
                        suggestion: `考虑删除索引 "${index2.name}"`,
                        location: { table: table.name },
                        autoFixable: true,
                        fix: () => __awaiter(this, void 0, void 0, function* () { })
                    });
                }
            }
        }
        return issues;
    }
    validateNPlusOnePotential(table, allTables) {
        const issues = [];
        for (const fk of table.foreignKeys) {
            const referencedTable = allTables.find(t => t.name === fk.referenceTable);
            if (referencedTable) {
                const reverseFks = referencedTable.foreignKeys.filter(r => r.referenceTable === table.name);
                if (reverseFks.length > 3) {
                    issues.push({
                        id: `n-plus-one-risk-${table.name}-${fk.name}`,
                        severity: 'info',
                        category: 'performance',
                        code: 'N_PLUS_ONE_RISK',
                        message: `表 "${table.name}" 和 "${referencedTable.name}" 之间存在潜在的 N+1 查询风险`,
                        description: '多个外键关系可能导致 N+1 查询问题',
                        suggestion: '考虑使用批量查询或数据加载优化策略',
                        location: { table: table.name },
                        autoFixable: false
                    });
                }
            }
        }
        return issues;
    }
    validateLargeTextColumns(table) {
        const issues = [];
        const largeTextColumns = table.columns.filter(col => ['text', 'character varying', 'varchar'].includes(col.dataType) &&
            (!col.length || col.length > 1000));
        if (largeTextColumns.length > 5) {
            issues.push({
                id: `many-large-text-columns-${table.name}`,
                severity: 'warning',
                category: 'performance',
                code: 'MANY_LARGE_TEXT_COLUMNS',
                message: `表 "${table.name}" 有 ${largeTextColumns.length} 个大文本列`,
                description: '过多的大文本列可能影响查询性能和存储效率',
                suggestion: '考虑将大文本列分离到单独的表中',
                location: { table: table.name },
                autoFixable: false
            });
        }
        return issues;
    }
    validateMissingIndexes(table) {
        const issues = [];
        const commonQueryPatterns = [
            { pattern: /created_at/i, suggestion: 'created_at 字段常用于时间范围查询，建议创建索引' },
            { pattern: /updated_at/i, suggestion: 'updated_at 字段常用于时间范围查询，建议创建索引' },
            { pattern: /email/i, suggestion: 'email 字段常用于登录查询，建议创建唯一索引' },
            { pattern: /username/i, suggestion: 'username 字段常用于登录查询，建议创建唯一索引' },
            { pattern: /status/i, suggestion: 'status 字段常用于过滤查询，建议创建索引' }
        ];
        const indexedColumns = new Set();
        for (const index of table.indexes) {
            for (const column of index.columns) {
                indexedColumns.add(column);
            }
        }
        for (const column of table.columns) {
            for (const pattern of commonQueryPatterns) {
                if (pattern.pattern.test(column.name) && !indexedColumns.has(column.name)) {
                    issues.push({
                        id: `missing-index-${table.name}-${column.name}`,
                        severity: 'info',
                        category: 'performance',
                        code: 'MISSING_INDEX',
                        message: `列 "${column.name}" 可能需要索引`,
                        description: pattern.suggestion,
                        suggestion: `考虑为列 "${column.name}" 创建索引`,
                        location: { table: table.name, column: column.name },
                        autoFixable: true,
                        fix: () => __awaiter(this, void 0, void 0, function* () { })
                    });
                    break;
                }
            }
        }
        return issues;
    }
    validateCascadeDeletes(table) {
        const issues = [];
        for (const fk of table.foreignKeys) {
            if (fk.onDelete === 'CASCADE') {
                const referencedTable = table.name;
                issues.push({
                    id: `cascade-delete-${table.name}-${fk.name}`,
                    severity: 'warning',
                    category: 'performance',
                    code: 'CASCADE_DELETE_WARNING',
                    message: `外键 "${fk.name}" 使用了 CASCADE DELETE`,
                    description: '级联删除可能导致意外的数据丢失和性能问题',
                    suggestion: '考虑使用 SET NULL 或 RESTRICT 代替 CASCADE',
                    location: { table: table.name },
                    autoFixable: true,
                    fix: () => __awaiter(this, void 0, void 0, function* () { })
                });
            }
        }
        return issues;
    }
    isIndexPrefix(index1, index2) {
        if (index1.columns.length >= index2.columns.length)
            return false;
        for (let i = 0; i < index1.columns.length; i++) {
            if (index1.columns[i] !== index2.columns[i])
                return false;
        }
        return true;
    }
}
exports.PerformanceValidator = PerformanceValidator;
