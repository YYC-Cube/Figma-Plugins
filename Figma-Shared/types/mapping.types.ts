import { PostgreSQLDataType, Column, Table } from './database.types';
import { FieldType, DesignField, DesignTable, DesignRelation } from './design.types';

export interface TypeMapping {
  designType: FieldType;
  postgresType: PostgreSQLDataType;
  length?: number;
  priority: number;
}

export interface FieldMapping {
  designField: DesignField;
  databaseColumn: Column;
  confidence: number;
}

export interface TableMapping {
  designTable: DesignTable;
  databaseTable: Table;
  fieldMappings: FieldMapping[];
  confidence: number;
}

export interface RelationMapping {
  designRelation: DesignRelation;
  foreignKey: {
    name: string;
    columns: string[];
    referenceTable: string;
    referenceColumns: string[];
  };
}

export interface SchemaMapping {
  designSchemaId: string;
  databaseSchema: string;
  tableMappings: TableMapping[];
  relationMappings: RelationMapping[];
  metadata: {
    mappedAt: number;
    confidence: number;
    warnings: string[];
  };
}

export interface MappingRule {
  name: string;
  description: string;
  appliesTo: 'field' | 'table' | 'relation';
  rule: (input: any) => boolean | Promise<boolean>;
  transform?: (input: any) => any;
}

export interface MappingConfig {
  typeMappings: TypeMapping[];
  namingConventions: {
    table: 'snake_case' | 'camelCase' | 'PascalCase';
    column: 'snake_case' | 'camelCase';
    index: string;
    foreignKey: string;
  };
  validationRules: MappingRule[];
  defaultValues: {
    nullable: boolean;
    createTimestamp: boolean;
    updateTimestamp: boolean;
    softDelete: boolean;
  };
}
