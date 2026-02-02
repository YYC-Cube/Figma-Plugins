"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationParser = void 0;
class RelationParser {
    constructor() {
        this.relationKeywords = [
            'relation', 'foreign', 'reference', 'ref', 'link', 'connect',
            '关联', '外键', '引用', '连接'
        ];
    }
    parseRelationsFromDesign(tables) {
        const relations = [];
        for (const table of tables) {
            if (table.relations) {
                relations.push(...table.relations);
            }
            const fieldRelations = this.extractRelationsFromFields(table);
            relations.push(...fieldRelations);
        }
        return this.deduplicateRelations(relations);
    }
    parseRelationsFromSchema(tables) {
        const foreignKeys = [];
        for (const table of tables) {
            if (table.foreignKeys) {
                foreignKeys.push(...table.foreignKeys);
            }
        }
        return foreignKeys;
    }
    inferRelations(tables) {
        const relations = [];
        for (const sourceTable of tables) {
            for (const targetTable of tables) {
                if (sourceTable.id === targetTable.id)
                    continue;
                const inferredRelations = this.inferRelationsBetweenTables(sourceTable, targetTable);
                relations.push(...inferredRelations);
            }
        }
        return this.deduplicateRelations(relations);
    }
    extractRelationsFromFields(table) {
        const relations = [];
        for (const field of table.fields) {
            if (this.isRelationField(field)) {
                const relation = this.createRelationFromField(table, field);
                if (relation) {
                    relations.push(relation);
                }
            }
        }
        return relations;
    }
    isRelationField(field) {
        var _a;
        const name = field.name.toLowerCase();
        const type = ((_a = field.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        return name.endsWith('_id') ||
            name.endsWith('id') ||
            name.includes('ref') ||
            name.includes('foreign') ||
            this.relationKeywords.some(keyword => name.includes(keyword)) ||
            type === 'relation';
    }
    createRelationFromField(table, field) {
        const fieldName = field.name;
        let targetTable = this.extractTargetTableName(fieldName);
        let targetField = 'id';
        if (field.validation && field.validation.reference) {
            const refParts = field.validation.reference.split('.');
            targetTable = refParts[0] || targetTable;
            targetField = refParts[1] || targetField;
        }
        if (!targetTable)
            return null;
        return {
            id: `rel-${table.id}-${field.name}`,
            fromTable: table.name,
            fromField: fieldName,
            toTable: targetTable,
            toField: targetField,
            type: this.inferRelationType(field)
        };
    }
    extractTargetTableName(fieldName) {
        const name = fieldName.toLowerCase();
        if (name.endsWith('_id')) {
            return name.slice(0, -3);
        }
        if (name.endsWith('id') && name.length > 2) {
            return name.slice(0, -2);
        }
        for (const keyword of this.relationKeywords) {
            const match = name.match(new RegExp(`(${keyword})_?(\\w+)`));
            if (match) {
                return match[2];
            }
        }
        return null;
    }
    inferRelationType(field) {
        var _a, _b;
        const name = field.name.toLowerCase();
        const type = ((_a = field.type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (type === 'array' || name.endsWith('s') && !name.endsWith('ss')) {
            return 'many-to-many';
        }
        if (field.unique || ((_b = field.validation) === null || _b === void 0 ? void 0 : _b.unique)) {
            return 'one-to-one';
        }
        return 'one-to-many';
    }
    inferRelationsBetweenTables(sourceTable, targetTable) {
        const relations = [];
        for (const field of sourceTable.fields) {
            const targetTableName = this.extractTargetTableName(field.name);
            if (targetTableName && targetTableName === targetTable.name) {
                const relation = {
                    id: `rel-${sourceTable.id}-${field.name}`,
                    fromTable: sourceTable.name,
                    fromField: field.name,
                    toTable: targetTable.name,
                    toField: 'id',
                    type: this.inferRelationType(field)
                };
                relations.push(relation);
            }
        }
        return relations;
    }
    deduplicateRelations(relations) {
        const seen = new Set();
        const unique = [];
        for (const relation of relations) {
            const key = `${relation.fromTable}.${relation.fromField}-${relation.toTable}.${relation.toField}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(relation);
            }
        }
        return unique;
    }
    validateRelations(relations, tables) {
        const errors = [];
        const tableNames = new Set(tables.map(t => t.name));
        for (const relation of relations) {
            if (!tableNames.has(relation.fromTable)) {
                errors.push(`Relation references non-existent table: ${relation.fromTable}`);
            }
            if (!tableNames.has(relation.toTable)) {
                errors.push(`Relation references non-existent table: ${relation.toTable}`);
            }
            const fromTable = tables.find(t => t.name === relation.fromTable);
            if (fromTable && !fromTable.fields.some(f => f.name === relation.fromField)) {
                errors.push(`Relation references non-existent field: ${relation.fromTable}.${relation.fromField}`);
            }
            const toTable = tables.find(t => t.name === relation.toTable);
            if (toTable && !toTable.fields.some(f => f.name === relation.toField)) {
                errors.push(`Relation references non-existent field: ${relation.toTable}.${relation.toField}`);
            }
        }
        return errors;
    }
    detectCircularDependencies(relations) {
        const graph = this.buildRelationGraph(relations);
        const cycles = [];
        const visited = new Set();
        const recursionStack = new Set();
        const path = [];
        for (const node of Object.keys(graph)) {
            if (!visited.has(node)) {
                this.detectCyclesDFS(node, graph, visited, recursionStack, path, cycles);
            }
        }
        return cycles;
    }
    buildRelationGraph(relations) {
        const graph = {};
        for (const relation of relations) {
            if (!graph[relation.fromTable]) {
                graph[relation.fromTable] = [];
            }
            graph[relation.fromTable].push(relation.toTable);
        }
        return graph;
    }
    detectCyclesDFS(node, graph, visited, recursionStack, path, cycles) {
        visited.add(node);
        recursionStack.add(node);
        path.push(node);
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                this.detectCyclesDFS(neighbor, graph, visited, recursionStack, path, cycles);
            }
            else if (recursionStack.has(neighbor)) {
                const cycleStart = path.indexOf(neighbor);
                cycles.push([...path.slice(cycleStart), neighbor]);
            }
        }
        path.pop();
        recursionStack.delete(node);
    }
    suggestRelationOptimizations(relations) {
        const suggestions = [];
        const relationCount = new Map();
        for (const relation of relations) {
            const key = `${relation.fromTable}-${relation.toTable}`;
            relationCount.set(key, (relationCount.get(key) || 0) + 1);
        }
        for (const [key, count] of relationCount.entries()) {
            if (count > 1) {
                suggestions.push(`Multiple relations between ${key}. Consider consolidating into a single relation.`);
            }
        }
        const manyToMany = relations.filter(r => r.type === 'many-to-many');
        if (manyToMany.length > 0) {
            suggestions.push(`Found ${manyToMany.length} many-to-many relations. Ensure junction tables are properly defined.`);
        }
        return suggestions;
    }
}
exports.RelationParser = RelationParser;
