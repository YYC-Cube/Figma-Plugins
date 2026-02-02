export type DesignElementType = 
  | 'FRAME'
  | 'GROUP'
  | 'COMPONENT'
  | 'INSTANCE'
  | 'RECTANGLE'
  | 'TEXT'
  | 'LINE'
  | 'ELLIPSE'
  | 'POLYGON'
  | 'STAR'
  | 'VECTOR'
  | 'BOOLEAN_OPERATION';

export type FieldType = 
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'email'
  | 'url'
  | 'phone'
  | 'image'
  | 'file'
  | 'json'
  | 'enum'
  | 'array'
  | 'object';

export interface DesignField {
  name: string;
  type: FieldType;
  required: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  description?: string;
}

export interface DesignTable {
  id: string;
  name: string;
  fields: DesignField[];
  relations: DesignRelation[];
  metadata?: {
    icon?: string;
    color?: string;
    description?: string;
  };
}

export interface DesignRelation {
  id: string;
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  name?: string;
}

export interface DesignSchema {
  id: string;
  name: string;
  tables: DesignTable[];
  relations: DesignRelation[];
  metadata?: {
    version: string;
    description?: string;
    author?: string;
    createdAt: number;
    updatedAt: number;
  };
}

export interface DesignNodeMapping {
  figmaNodeId: string;
  databaseType: 'table' | 'column' | 'relation' | 'index';
  databaseId?: string;
  designElement?: DesignTable | DesignField | DesignRelation;
}

export interface DesignLayer {
  id: string;
  name: string;
  type: DesignElementType;
  children?: DesignLayer[];
  properties: Record<string, any>;
  annotations?: {
    isTable?: boolean;
    tableName?: string;
    fields?: DesignField[];
    relations?: DesignRelation[];
  };
}
