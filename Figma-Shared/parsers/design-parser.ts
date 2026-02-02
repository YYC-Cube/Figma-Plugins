import { DesignTable, DesignField, DesignRelation, DesignSchema, DesignLayer, FieldType } from '../types/design.types';
import { getFigma, FigmaPageAdapter } from '../utils/figma-adapter';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  visible?: boolean;
}

interface FigmaTextNode extends FigmaNode {
  characters?: string;
}

export class DesignParser {
  private nodeCache: Map<string, FigmaNode> = new Map();
  private tablePatterns: RegExp[] = [
    /table/i,
    /entity/i,
    /model/i,
    /schema/i,
    /collection/i
  ];
  private fieldPatterns: RegExp[] = [
    /field/i,
    /column/i,
    /property/i,
    /attribute/i
  ];

  constructor() {
    this.initializeCache();
  }

  private initializeCache(): void {
    const figma = getFigma();
    const selection = figma.currentPage.selection;
    selection.forEach((node: any) => {
      this.nodeCache.set(node.id, node as any);
    });
  }

  async parseFromSelection(): Promise<DesignSchema> {
    const figma = getFigma();
    const selection = figma.currentPage.selection;
    const tables: DesignTable[] = [];
    const relations: DesignRelation[] = [];

    for (const node of selection) {
      const parsed = await this.parseNode(node as any);
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
  }

  async parseFromPage(): Promise<DesignSchema> {
    const figma = getFigma();
    const page = figma.currentPage;
    const tables: DesignTable[] = [];
    const relations: DesignRelation[] = [];

    const parsed = await this.parseNode(page as any);
    if (parsed) {
      tables.push(...parsed.tables);
      relations.push(...parsed.relations);
    }

    return {
      id: `schema-${Date.now()}`,
      name: (page as any).name,
      tables,
      relations,
      metadata: {
        version: '1.0.0',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };
  }

  private async parseNode(node: FigmaNode): Promise<{ tables: DesignTable[]; relations: DesignRelation[] } | null> {
    const result = { tables: [] as DesignTable[], relations: [] as DesignRelation[] };

    if (this.isTableNode(node)) {
      const table = await this.parseTable(node as any);
      if (table) {
        result.tables.push(table);
      }
    }

    if ('children' in node && node.children) {
      for (const child of node.children) {
        const childResult = await this.parseNode(child);
        if (childResult) {
          result.tables.push(...childResult.tables);
          result.relations.push(...childResult.relations);
        }
      }
    }

    return result.tables.length > 0 || result.relations.length > 0 ? result : null;
  }

  private isTableNode(node: FigmaNode): boolean {
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
      const name = node.name.toLowerCase();
      return this.tablePatterns.some(pattern => pattern.test(name));
    }
    return false;
  }

  private async parseTable(node: FigmaNode): Promise<DesignTable | null> {
    const fields: DesignField[] = [];
    const relations: DesignRelation[] = [];

    if ('children' in node && node.children) {
      for (const child of node.children) {
        if (child.type === 'TEXT') {
          const field = this.parseField(child as FigmaTextNode);
          if (field) {
            fields.push(field);
          }
        } else if (this.isRelationNode(child)) {
          const relation = await this.parseRelation(child);
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
  }

  private parseField(node: FigmaTextNode): DesignField | null {
    const text = node.name || node.characters;
    if (!text) return null;

    const parts = text.split(/[:|]/).map((p: string) => p.trim());
    const fieldName = this.sanitizeFieldName(parts[0]);
    
    if (!fieldName) return null;

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

  private inferFieldType(typeHint: string, fullText: string): FieldType {
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

  private extractValidation(text: string): any {
    const validation: any = {};
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

  private isRelationNode(node: FigmaNode): boolean {
    return node.name.toLowerCase().includes('relation') || 
           node.name.toLowerCase().includes('foreign') ||
           node.name.toLowerCase().includes('ref');
  }

  private async parseRelation(node: FigmaNode): Promise<DesignRelation | null> {
    const text = node.name;
    const match = text.match(/(\w+)\s*->\s*(\w+)/i);
    
    if (!match) return null;

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
  }

  private inferRelationType(text: string): 'one-to-one' | 'one-to-many' | 'many-to-many' {
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

  private sanitizeTableName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/^[0-9]/, '_$&')
      .toLowerCase();
  }

  private sanitizeFieldName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/^[0-9]/, '_$&')
      .toLowerCase();
  }

  private extractDescription(node: FigmaNode): string | undefined {
    if ('description' in node && typeof node.description === 'string') {
      return node.description;
    }
    return undefined;
  }

  createDesignLayer(node: FigmaNode): DesignLayer {
    const layer: DesignLayer = {
      id: node.id,
      name: node.name,
      type: node.type as any,
      properties: this.extractNodeProperties(node)
    };

    if (this.isTableNode(node)) {
      layer.annotations = {
        isTable: true,
        tableName: this.sanitizeTableName(node.name)
      };
    }

    if ('children' in node && node.children) {
      layer.children = node.children.map((child: any) => this.createDesignLayer(child));
    }

    return layer;
  }

  private extractNodeProperties(node: FigmaNode): Record<string, any> {
    const props: Record<string, any> = {
      id: node.id,
      name: node.name,
      type: node.type
    };

    if ('width' in node) props.width = node.width;
    if ('height' in node) props.height = node.height;
    if ('x' in node) props.x = node.x;
    if ('y' in node) props.y = node.y;

    return props;
  }
}
