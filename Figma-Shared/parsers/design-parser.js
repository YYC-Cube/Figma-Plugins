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
exports.DesignParser = void 0;
const figma_adapter_1 = require("../utils/figma-adapter");
class DesignParser {
    constructor() {
        this.nodeCache = new Map();
        this.tablePatterns = [
            /table/i,
            /entity/i,
            /model/i,
            /schema/i,
            /collection/i
        ];
        this.fieldPatterns = [
            /field/i,
            /column/i,
            /property/i,
            /attribute/i
        ];
        this.initializeCache();
    }
    initializeCache() {
        const figma = (0, figma_adapter_1.getFigma)();
        const selection = figma.currentPage.selection;
        selection.forEach((node) => {
            this.nodeCache.set(node.id, node);
        });
    }
    parseFromSelection() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = (0, figma_adapter_1.getFigma)();
            const selection = figma.currentPage.selection;
            const tables = [];
            const relations = [];
            for (const node of selection) {
                const parsed = yield this.parseNode(node);
                if (parsed) {
                    tables.push(...parsed.tables);
                    relations.push(...parsed.relations);
                }
            }
            return {
                id: `schema-${Date.now()}`,
                name: 'Parsed Schema',
                tables,
                relations,
                metadata: {
                    version: '1.0.0',
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }
            };
        });
    }
    parseFromPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = (0, figma_adapter_1.getFigma)();
            const page = figma.currentPage;
            const tables = [];
            const relations = [];
            const parsed = yield this.parseNode(page);
            if (parsed) {
                tables.push(...parsed.tables);
                relations.push(...parsed.relations);
            }
            return {
                id: `schema-${Date.now()}`,
                name: page.name,
                tables,
                relations,
                metadata: {
                    version: '1.0.0',
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }
            };
        });
    }
    parseNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = { tables: [], relations: [] };
            if (this.isTableNode(node)) {
                const table = yield this.parseTable(node);
                if (table) {
                    result.tables.push(table);
                }
            }
            if ('children' in node && node.children) {
                for (const child of node.children) {
                    const childResult = yield this.parseNode(child);
                    if (childResult) {
                        result.tables.push(...childResult.tables);
                        result.relations.push(...childResult.relations);
                    }
                }
            }
            return result.tables.length > 0 || result.relations.length > 0 ? result : null;
        });
    }
    isTableNode(node) {
        if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
            const name = node.name.toLowerCase();
            return this.tablePatterns.some(pattern => pattern.test(name));
        }
        return false;
    }
    parseTable(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = [];
            const relations = [];
            if ('children' in node && node.children) {
                for (const child of node.children) {
                    if (child.type === 'TEXT') {
                        const field = this.parseField(child);
                        if (field) {
                            fields.push(field);
                        }
                    }
                    else if (this.isRelationNode(child)) {
                        const relation = yield this.parseRelation(child);
                        if (relation) {
                            relations.push(relation);
                        }
                    }
                }
            }
            if (fields.length === 0) {
                return null;
            }
            return {
                id: node.id,
                name: this.sanitizeTableName(node.name),
                fields,
                relations,
                metadata: {
                    description: this.extractDescription(node)
                }
            };
        });
    }
    parseField(node) {
        const text = node.name || node.characters;
        if (!text)
            return null;
        const parts = text.split(/[:|]/).map((p) => p.trim());
        const fieldName = this.sanitizeFieldName(parts[0]);
        if (!fieldName)
            return null;
        const fieldType = this.inferFieldType(parts[1] || '', text);
        const required = text.toLowerCase().includes('*') || text.toLowerCase().includes('required');
        return {
            name: fieldName,
            type: fieldType,
            required,
            validation: this.extractValidation(text),
            description: parts.length > 2 ? parts.slice(2).join(' ') : undefined
        };
    }
    inferFieldType(typeHint, fullText) {
        const hint = typeHint.toLowerCase();
        const text = fullText.toLowerCase();
        if (hint.includes('int') || hint.includes('number') || hint.includes('decimal')) {
            return 'number';
        }
        if (hint.includes('bool') || hint.includes('boolean')) {
            return 'boolean';
        }
        if (hint.includes('date') && !hint.includes('time')) {
            return 'date';
        }
        if (hint.includes('datetime') || hint.includes('timestamp')) {
            return 'datetime';
        }
        if (hint.includes('email')) {
            return 'email';
        }
        if (hint.includes('url')) {
            return 'url';
        }
        if (hint.includes('phone')) {
            return 'phone';
        }
        if (hint.includes('image') || hint.includes('img')) {
            return 'image';
        }
        if (hint.includes('file') || hint.includes('attachment')) {
            return 'file';
        }
        if (hint.includes('json')) {
            return 'json';
        }
        if (hint.includes('array') || hint.includes('list')) {
            return 'array';
        }
        if (hint.includes('object') || hint.includes('struct')) {
            return 'object';
        }
        return 'text';
    }
    extractValidation(text) {
        const validation = {};
        const lowerText = text.toLowerCase();
        const minMatch = text.match(/min:\s*(\d+)/i);
        if (minMatch) {
            validation.min = parseInt(minMatch[1]);
        }
        const maxMatch = text.match(/max:\s*(\d+)/i);
        if (maxMatch) {
            validation.max = parseInt(maxMatch[1]);
        }
        const patternMatch = text.match(/pattern:\s*([^\s,]+)/i);
        if (patternMatch) {
            validation.pattern = patternMatch[1];
        }
        const optionsMatch = text.match(/\[([^\]]+)\]/);
        if (optionsMatch) {
            validation.options = optionsMatch[1].split(',').map(o => o.trim());
        }
        return Object.keys(validation).length > 0 ? validation : undefined;
    }
    isRelationNode(node) {
        return node.name.toLowerCase().includes('relation') ||
            node.name.toLowerCase().includes('foreign') ||
            node.name.toLowerCase().includes('ref');
    }
    parseRelation(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = node.name;
            const match = text.match(/(\w+)\s*->\s*(\w+)/i);
            if (!match)
                return null;
            const [, from, to] = match;
            const fromParts = from.split('.');
            const toParts = to.split('.');
            return {
                id: node.id,
                fromTable: fromParts[0] || '',
                fromField: fromParts[1] || 'id',
                toTable: toParts[0] || '',
                toField: toParts[1] || 'id',
                type: this.inferRelationType(text)
            };
        });
    }
    inferRelationType(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('1:1') || lowerText.includes('one-to-one')) {
            return 'one-to-one';
        }
        if (lowerText.includes('1:n') || lowerText.includes('one-to-many')) {
            return 'one-to-many';
        }
        if (lowerText.includes('n:n') || lowerText.includes('many-to-many')) {
            return 'many-to-many';
        }
        return 'one-to-many';
    }
    sanitizeTableName(name) {
        return name
            .replace(/[^a-zA-Z0-9_]/g, '_')
            .replace(/^[0-9]/, '_$&')
            .toLowerCase();
    }
    sanitizeFieldName(name) {
        return name
            .replace(/[^a-zA-Z0-9_]/g, '_')
            .replace(/^[0-9]/, '_$&')
            .toLowerCase();
    }
    extractDescription(node) {
        if ('description' in node && typeof node.description === 'string') {
            return node.description;
        }
        return undefined;
    }
    createDesignLayer(node) {
        const layer = {
            id: node.id,
            name: node.name,
            type: node.type,
            properties: this.extractNodeProperties(node)
        };
        if (this.isTableNode(node)) {
            layer.annotations = {
                isTable: true,
                tableName: this.sanitizeTableName(node.name)
            };
        }
        if ('children' in node && node.children) {
            layer.children = node.children.map((child) => this.createDesignLayer(child));
        }
        return layer;
    }
    extractNodeProperties(node) {
        const props = {
            id: node.id,
            name: node.name,
            type: node.type
        };
        if ('width' in node)
            props.width = node.width;
        if ('height' in node)
            props.height = node.height;
        if ('x' in node)
            props.x = node.x;
        if ('y' in node)
            props.y = node.y;
        return props;
    }
}
exports.DesignParser = DesignParser;
