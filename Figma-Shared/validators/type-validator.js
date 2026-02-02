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
exports.TypeValidator = void 0;
class TypeValidator {
    constructor() {
        this.typeRecommendations = new Map([
            ['email', ['character varying', 'text']],
            ['phone', ['character varying', 'text']],
            ['url', ['character varying', 'text']],
            ['password', ['character varying', 'text']],
            ['json', ['json', 'jsonb']],
            ['boolean', ['boolean', 'bool']],
            ['date', ['date', 'timestamp']],
            ['datetime', ['timestamp', 'timestamp with time zone']],
            ['timestamp', ['timestamp', 'timestamp with time zone']],
            ['money', ['money', 'numeric', 'decimal']],
            ['image', ['bytea', 'text']],
            ['file', ['bytea', 'text']]
        ]);
        this.incompatibleTypes = new Map([
            ['character varying', ['bytea', 'json', 'jsonb']],
            ['text', ['bytea', 'json', 'jsonb']],
            ['integer', ['bytea', 'json', 'jsonb', 'boolean']],
            ['bigint', ['bytea', 'json', 'jsonb', 'boolean']],
            ['decimal', ['bytea', 'json', 'jsonb', 'boolean']],
            ['boolean', ['bytea', 'json', 'jsonb', 'integer', 'bigint', 'decimal']]
        ]);
    }
    validateColumnType(column, tableName) {
        const issues = [];
        const columnName = column.name.toLowerCase();
        for (const [keyword, recommendedTypes] of this.typeRecommendations) {
            if (columnName.includes(keyword)) {
                if (!recommendedTypes.includes(column.dataType)) {
                    issues.push({
                        id: `type-recommendation-${tableName}-${column.name}`,
                        severity: 'warning',
                        category: 'type',
                        code: 'TYPE_RECOMMENDATION',
                        message: `列 "${column.name}" 的数据类型可能不是最佳选择`,
                        description: `基于列名 "${column.name}"，建议使用更适合的数据类型`,
                        suggestion: `建议使用: ${recommendedTypes.join(' 或 ')}`,
                        location: { table: tableName, column: column.name },
                        autoFixable: true,
                        fix: () => __awaiter(this, void 0, void 0, function* () { })
                    });
                }
                break;
            }
        }
        return issues;
    }
    validateTypeLength(column, tableName) {
        const issues = [];
        if (['character varying', 'varchar', 'character', 'char'].includes(column.dataType)) {
            if (!column.length || column.length <= 0) {
                issues.push({
                    id: `type-length-${tableName}-${column.name}`,
                    severity: 'info',
                    category: 'type',
                    code: 'TYPE_LENGTH_NOT_SPECIFIED',
                    message: `列 "${column.name}" 未指定长度`,
                    description: '对于变长字符类型，建议指定最大长度以提高性能',
                    suggestion: `建议指定长度，例如: ${column.dataType}(255)`,
                    location: { table: tableName, column: column.name },
                    autoFixable: true,
                    fix: () => __awaiter(this, void 0, void 0, function* () { })
                });
            }
            else if (column.length > 65535) {
                issues.push({
                    id: `type-length-exceed-${tableName}-${column.name}`,
                    severity: 'warning',
                    category: 'type',
                    code: 'TYPE_LENGTH_TOO_LONG',
                    message: `列 "${column.name}" 的长度 ${column.length} 可能过大`,
                    description: '过大的长度可能导致性能问题和存储浪费',
                    suggestion: `建议使用 TEXT 类型或减小长度`,
                    location: { table: tableName, column: column.name },
                    autoFixable: true,
                    fix: () => __awaiter(this, void 0, void 0, function* () { })
                });
            }
        }
        return issues;
    }
    validateNumericPrecision(column, tableName) {
        const issues = [];
        if (['decimal', 'numeric'].includes(column.dataType)) {
            if (!column.length) {
                issues.push({
                    id: `numeric-precision-${tableName}-${column.name}`,
                    severity: 'info',
                    category: 'type',
                    code: 'NUMERIC_PRECISION_NOT_SPECIFIED',
                    message: `列 "${column.name}" 未指定精度`,
                    description: '对于 DECIMAL/NUMERIC 类型，建议指定精度和标度',
                    suggestion: `建议指定精度，例如: ${column.dataType}(10,2)`,
                    location: { table: tableName, column: column.name },
                    autoFixable: true,
                    fix: () => __awaiter(this, void 0, void 0, function* () { })
                });
            }
        }
        return issues;
    }
    validateTypeCompatibility(table) {
        const issues = [];
        for (const column of table.columns) {
            const incompatible = this.incompatibleTypes.get(column.dataType);
            if (incompatible) {
                for (const otherColumn of table.columns) {
                    if (column.name !== otherColumn.name && incompatible.includes(otherColumn.dataType)) {
                        const hasRelation = table.foreignKeys.some(fk => fk.columns.includes(column.name) && fk.referenceColumns.includes(otherColumn.name));
                        if (!hasRelation) {
                            issues.push({
                                id: `type-incompatible-${table.name}-${column.name}-${otherColumn.name}`,
                                severity: 'warning',
                                category: 'type',
                                code: 'TYPE_INCOMPATIBLE',
                                message: `列 "${column.name}" 和 "${otherColumn.name}" 的数据类型可能不兼容`,
                                description: '这些数据类型之间可能无法直接比较或转换',
                                suggestion: '检查是否需要类型转换或使用兼容的数据类型',
                                location: { table: table.name, column: column.name },
                                autoFixable: false
                            });
                        }
                    }
                }
            }
        }
        return issues;
    }
    validateTimestampTimezone(column, tableName) {
        const issues = [];
        if (column.dataType === 'timestamp without time zone') {
            issues.push({
                id: `timezone-${tableName}-${column.name}`,
                severity: 'info',
                category: 'best_practice',
                code: 'TIMESTAMP_WITHOUT_TIMEZONE',
                message: `列 "${column.name}" 使用不带时区的时间戳`,
                description: '建议使用带时区的时间戳以避免时区相关问题',
                suggestion: `建议使用: timestamp with time zone`,
                location: { table: tableName, column: column.name },
                autoFixable: true,
                fix: () => __awaiter(this, void 0, void 0, function* () { })
            });
        }
        return issues;
    }
    validateTextVsVarchar(column, tableName) {
        const issues = [];
        if (column.dataType === 'character varying' && column.length && column.length > 1000) {
            issues.push({
                id: `text-vs-varchar-${tableName}-${column.name}`,
                severity: 'info',
                category: 'performance',
                code: 'CONSIDER_USING_TEXT',
                message: `列 "${column.name}" 的长度 ${column.length} 较大`,
                description: '对于较大的文本字段，使用 TEXT 类型可能更高效',
                suggestion: `考虑使用 TEXT 类型代替 VARCHAR(${column.length})`,
                location: { table: tableName, column: column.name },
                autoFixable: true,
                fix: () => __awaiter(this, void 0, void 0, function* () { })
            });
        }
        return issues;
    }
    validateBooleanNaming(column, tableName) {
        const issues = [];
        if (column.dataType === 'boolean' || column.dataType === 'bool') {
            if (!column.name.startsWith('is_') && !column.name.startsWith('has_') && !column.name.startsWith('can_') && !column.name.startsWith('should_')) {
                issues.push({
                    id: `boolean-naming-${tableName}-${column.name}`,
                    severity: 'info',
                    category: 'naming',
                    code: 'BOOLEAN_NAMING_CONVENTION',
                    message: `布尔列 "${column.name}" 不符合命名约定`,
                    description: '布尔类型的列名通常以 is_, has_, can_ 或 should_ 开头',
                    suggestion: `建议重命名为: is_${column.name}`,
                    location: { table: tableName, column: column.name },
                    autoFixable: true,
                    fix: () => __awaiter(this, void 0, void 0, function* () { })
                });
            }
        }
        return issues;
    }
}
exports.TypeValidator = TypeValidator;
