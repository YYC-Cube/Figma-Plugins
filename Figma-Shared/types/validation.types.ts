import { Table, Column, PostgreSQLDataType } from './database.types';
import { DesignTable, DesignField, DesignRelation } from './design.types';

export type ValidationSeverity = 'error' | 'warning' | 'info' | 'success';

export type ValidationCategory = 
  | 'naming'
  | 'type'
  | 'constraint'
  | 'performance'
  | 'security'
  | 'best_practice'
  | 'consistency';

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  category: ValidationCategory;
  code: string;
  message: string;
  description: string;
  suggestion?: string;
  location?: {
    table?: string;
    column?: string;
    relation?: string;
    line?: number;
  };
  autoFixable: boolean;
  fix?: () => Promise<void>;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    infos: number;
  };
  score: number;
}

export interface NamingConventionRule {
  pattern: RegExp;
  description: string;
  examples: {
    valid: string[];
    invalid: string[];
  };
}

export interface TypeCompatibilityRule {
  designType: string;
  postgresTypes: PostgreSQLDataType[];
  recommended: PostgreSQLDataType;
  reasoning: string;
}

export interface PerformanceRule {
  name: string;
  description: string;
  check: (table: Table, schema: Table[]) => ValidationIssue[];
  suggestion: string;
}

export interface SecurityRule {
  name: string;
  description: string;
  check: (table: Table) => ValidationIssue[];
  suggestion: string;
}

export interface ValidationConfig {
  enabledRules: string[];
  severityOverrides: Record<string, ValidationSeverity>;
  namingConventions: {
    tables: NamingConventionRule;
    columns: NamingConventionRule;
    indexes: NamingConventionRule;
    foreignKeys: NamingConventionRule;
  };
  performanceThresholds: {
    maxColumnsPerTable: number;
    maxForeignKeysPerTable: number;
    maxIndexColumns: number;
  };
  securityChecks: {
    checkForSensitiveData: boolean;
    checkForEncryption: boolean;
    checkForPermissions: boolean;
  };
}
