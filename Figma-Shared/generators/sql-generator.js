"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLGenerator = void 0;
class SQLGenerator {
    constructor() {
        this.indent = '  ';
        this.newline = '\n';
    }
    generateCreateTableSQL(table) {
        const lines = [];
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
    generateDropTableSQL(tableName, cascade = false) {
        const cascadeClause = cascade ? ' CASCADE' : '';
        return `DROP TABLE IF EXISTS ${this.quoteIdentifier(tableName)}${cascadeClause};${this.newline}`;
    }
    generateAlterTableSQL(oldTable, newTable) {
        const statements = [];
        const tableName = newTable.name;
        const oldColumns = new Map(oldTable.columns.map(c => [c.name, c]));
        const newColumns = new Map(newTable.columns.map(c => [c.name, c]));
        for (const [name, column] of newColumns) {
            if (!oldColumns.has(name)) {
                statements.push(this.generateAddColumnSQL(tableName, column));
            }
            else if (this.hasColumnChanged(oldColumns.get(name), column)) {
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
    generateCreateIndexSQL(index, tableName) {
        const unique = index.unique ? 'UNIQUE ' : '';
        const columns = index.columns.map(c => this.quoteIdentifier(c)).join(', ');
        const type = index.type ? ` USING ${index.type}` : '';
        const where = index.where ? ` WHERE ${index.where}` : '';
        return `CREATE ${unique}INDEX ${this.quoteIdentifier(index.name)} ON ${this.quoteIdentifier(tableName)}${type} (${columns})${where};${this.newline}`;
    }
    generateDropIndexSQL(indexName) {
        return `DROP INDEX IF EXISTS ${this.quoteIdentifier(indexName)};${this.newline}`;
    }
    generateInsertSQL(tableName, data) {
        if (data.length === 0)
            return [];
        const columns = Object.keys(data[0]);
        const columnList = columns.map(c => this.quoteIdentifier(c)).join(', ');
        return data.map(row => {
            const values = columns.map(col => this.formatValue(row[col])).join(', ');
            return `INSERT INTO ${this.quoteIdentifier(tableName)} (${columnList}) VALUES (${values});${this.newline}`;
        });
    }
    generateUpdateSQL(tableName, data, where) {
        const setClause = Object.entries(data)
            .map(([key, value]) => `${this.quoteIdentifier(key)} = ${this.formatValue(value)}`)
            .join(', ');
        const whereClause = Object.entries(where)
            .map(([key, value]) => `${this.quoteIdentifier(key)} = ${this.formatValue(value)}`)
            .join(' AND ');
        return `UPDATE ${this.quoteIdentifier(tableName)} SET ${setClause} WHERE ${whereClause};${this.newline}`;
    }
    generateDeleteSQL(tableName, where) {
        const whereClause = Object.entries(where)
            .map(([key, value]) => `${this.quoteIdentifier(key)} = ${this.formatValue(value)}`)
            .join(' AND ');
        return `DELETE FROM ${this.quoteIdentifier(tableName)} WHERE ${whereClause};${this.newline}`;
    }
    generateSelectSQL(tableName, columns = ['*'], where) {
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
    generateMigration(schema, version) {
        const upStatements = [];
        const downStatements = [];
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
    generateFullSchemaSQL(schema) {
        const statements = [];
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
    generateColumnDefinition(column) {
        const parts = [];
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
    generateColumnType(column) {
        let type = column.dataType;
        if (column.length && ['character varying', 'varchar', 'character', 'char'].includes(type)) {
            type += `(${column.length})`;
        }
        return type.toUpperCase();
    }
    generateConstraint(constraint) {
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
    generateConstraintDefinitions(table) {
        const constraints = [];
        if (table.primaryKeys.length > 0) {
            const pkColumns = table.primaryKeys.map(c => this.quoteIdentifier(c)).join(', ');
            constraints.push(`${this.indent}PRIMARY KEY (${pkColumns})`);
        }
        for (const fk of table.foreignKeys) {
            const columns = fk.columns.map(c => this.quoteIdentifier(c)).join(', ');
            const refColumns = fk.referenceColumns.map(c => this.quoteIdentifier(c)).join(', ');
            const onDelete = fk.onDelete ? ` ON DELETE ${fk.onDelete}` : '';
            const onUpdate = fk.onUpdate ? ` ON UPDATE ${fk.onUpdate}` : '';
            constraints.push(`${this.indent}CONSTRAINT ${this.quoteIdentifier(fk.name)} ` +
                `FOREIGN KEY (${columns}) REFERENCES ${this.quoteIdentifier(fk.referenceTable)} (${refColumns})${onDelete}${onUpdate}`);
        }
        return constraints;
    }
    generateAddColumnSQL(tableName, column) {
        const columnDef = this.generateColumnDefinition(column);
        return `ALTER TABLE ${this.quoteIdentifier(tableName)} ADD COLUMN ${columnDef.replace(this.indent, '')};${this.newline}`;
    }
    generateAlterColumnSQL(tableName, column) {
        const columnDef = this.generateColumnDefinition(column);
        return `ALTER TABLE ${this.quoteIdentifier(tableName)} ALTER COLUMN ${this.quoteIdentifier(column.name)} TYPE ${this.generateColumnType(column)};${this.newline}`;
    }
    generateDropColumnSQL(tableName, columnName) {
        return `ALTER TABLE ${this.quoteIdentifier(tableName)} DROP COLUMN ${this.quoteIdentifier(columnName)};${this.newline}`;
    }
    hasColumnChanged(oldCol, newCol) {
        return oldCol.dataType !== newCol.dataType ||
            oldCol.nullable !== newCol.nullable ||
            oldCol.length !== newCol.length ||
            JSON.stringify(oldCol.constraints) !== JSON.stringify(newCol.constraints);
    }
    quoteIdentifier(name) {
        return `"${name.replace(/"/g, '""')}"`;
    }
    formatValue(value) {
        if (value === null)
            return 'NULL';
        if (typeof value === 'string')
            return `'${this.escapeString(value)}'`;
        if (typeof value === 'boolean')
            return value ? 'TRUE' : 'FALSE';
        if (typeof value === 'number')
            return value.toString();
        if (value instanceof Date)
            return `'${value.toISOString()}'`;
        if (typeof value === 'object')
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
        return 'NULL';
    }
    escapeString(str) {
        return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
    }
}
exports.SQLGenerator = SQLGenerator;
