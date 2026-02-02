import { MappingConfig, ValidationConfig } from '../types';
import { getFigma } from '../utils/figma-adapter';

export interface AppConfig {
  database?: {
    defaultConnection?: string;
    timeout?: number;
    poolSize?: number;
  };
  codegen?: {
    defaultORM?: 'prisma' | 'typeorm' | 'sequelize' | 'drizzle';
    defaultFramework?: 'express' | 'fastify' | 'nestjs' | 'nextjs' | 'hono';
    generateTypes?: boolean;
    generateValidation?: boolean;
    generateDocumentation?: boolean;
  };
  validation?: ValidationConfig;
  mapping?: MappingConfig;
  ui?: {
    theme?: 'light' | 'dark' | 'auto';
    language?: 'en' | 'zh' | 'ja';
    fontSize?: number;
  };
  export?: {
    format?: 'sql' | 'json' | 'yaml';
    includeComments?: boolean;
    includeIndexes?: boolean;
  };
}

export class ConfigManager {
  private static readonly CONFIG_KEY = 'figma-postgres-config';
  private static readonly DEFAULT_CONFIG: AppConfig = {
    database: {
      timeout: 30000,
      poolSize: 10
    },
    codegen: {
      defaultORM: 'prisma',
      defaultFramework: 'express',
      generateTypes: true,
      generateValidation: true,
      generateDocumentation: true
    },
    validation: {
      enabledRules: ['*'],
      severityOverrides: {},
      namingConventions: {
        tables: { pattern: /^[a-z][a-z0-9_]*$/, description: 'snake_case', examples: { valid: ['users', 'user_profiles'], invalid: ['Users', 'userProfiles'] } },
        columns: { pattern: /^[a-z][a-z0-9_]*$/, description: 'snake_case', examples: { valid: ['user_id', 'created_at'], invalid: ['userId', 'createdAt'] } },
        indexes: { pattern: /^idx_[a-z][a-z0-9_]*$/, description: 'idx_table_column', examples: { valid: ['idx_users_email'], invalid: ['users_email_idx'] } },
        foreignKeys: { pattern: /^fk_[a-z][a-z0-9_]*$/, description: 'fk_table_column', examples: { valid: ['fk_posts_user_id'], invalid: ['posts_user_id_fk'] } }
      },
      performanceThresholds: {
        maxColumnsPerTable: 100,
        maxForeignKeysPerTable: 50,
        maxIndexColumns: 5
      },
      securityChecks: {
        checkForSensitiveData: true,
        checkForEncryption: true,
        checkForPermissions: true
      }
    },
    mapping: {
      typeMappings: [
        { designType: 'text', postgresType: 'character varying', priority: 1 },
        { designType: 'number', postgresType: 'integer', priority: 1 },
        { designType: 'date', postgresType: 'date', priority: 1 },
        { designType: 'datetime', postgresType: 'timestamp', priority: 1 },
        { designType: 'boolean', postgresType: 'boolean', priority: 1 },
        { designType: 'email', postgresType: 'character varying', priority: 1 },
        { designType: 'url', postgresType: 'character varying', priority: 1 },
        { designType: 'phone', postgresType: 'character varying', priority: 1 },
        { designType: 'image', postgresType: 'text', priority: 1 },
        { designType: 'file', postgresType: 'text', priority: 1 },
        { designType: 'json', postgresType: 'jsonb', priority: 1 },
        { designType: 'array', postgresType: 'jsonb', priority: 1 },
        { designType: 'object', postgresType: 'jsonb', priority: 1 }
      ],
      namingConventions: {
        table: 'snake_case',
        column: 'snake_case',
        index: 'idx_{table}_{column}',
        foreignKey: 'fk_{table}_{column}'
      },
      validationRules: [],
      defaultValues: {
        nullable: true,
        createTimestamp: true,
        updateTimestamp: true,
        softDelete: false
      }
    },
    ui: {
      theme: 'auto',
      language: 'en',
      fontSize: 14
    },
    export: {
      format: 'sql',
      includeComments: true,
      includeIndexes: true
    }
  };

  private static config: AppConfig | null = null;

  static async load(): Promise<AppConfig> {
    if (this.config) {
      return this.config;
    }

    const figma = getFigma();
    const stored = await figma.clientStorage.getAsync(this.CONFIG_KEY);
    if (stored) {
      try {
        this.config = this.mergeConfigs(this.DEFAULT_CONFIG, JSON.parse(stored as string));
      } catch {
        this.config = { ...this.DEFAULT_CONFIG };
      }
    } else {
      this.config = { ...this.DEFAULT_CONFIG };
    }

    return this.config;
  }

  static async save(config: Partial<AppConfig>): Promise<void> {
    const current = await this.load();
    this.config = this.mergeConfigs(current, config);
    const figma = getFigma();
    await figma.clientStorage.setAsync(this.CONFIG_KEY, JSON.stringify(this.config));
  }

  static async reset(): Promise<void> {
    this.config = { ...this.DEFAULT_CONFIG };
    const figma = getFigma();
    await figma.clientStorage.setAsync(this.CONFIG_KEY, JSON.stringify(this.config));
  }

  static async get<K extends keyof AppConfig>(key: K): Promise<AppConfig[K]> {
    const config = await this.load();
    return config[key];
  }

  static async set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): Promise<void> {
    const config = await this.load();
    config[key] = value;
    await this.save(config);
  }

  static async updateValidationConfig(config: Partial<ValidationConfig>): Promise<void> {
    const current = await this.load();
    current.validation = {
      ...current.validation,
      ...config,
      enabledRules: config.enabledRules ?? current.validation?.enabledRules ?? ['*'],
      severityOverrides: config.severityOverrides ?? current.validation?.severityOverrides ?? {},
      namingConventions: config.namingConventions ?? current.validation?.namingConventions ?? {
        tables: { pattern: /^[a-z][a-z0-9_]*$/, description: 'snake_case', examples: { valid: ['users', 'user_profiles'], invalid: ['Users', 'userProfiles'] } },
        columns: { pattern: /^[a-z][a-z0-9_]*$/, description: 'snake_case', examples: { valid: ['user_id', 'created_at'], invalid: ['userId', 'createdAt'] } },
        indexes: { pattern: /^idx_[a-z][a-z0-9_]*$/, description: 'idx_table_column', examples: { valid: ['idx_users_email'], invalid: ['users_email_idx'] } },
        foreignKeys: { pattern: /^fk_[a-z][a-z0-9_]*$/, description: 'fk_table_column_ref', examples: { valid: ['fk_users_profile_id'], invalid: ['users_profile_id_fk'] } }
      },
      performanceThresholds: config.performanceThresholds ?? current.validation?.performanceThresholds ?? {
        maxColumnsPerTable: 50,
        maxForeignKeysPerTable: 10,
        maxIndexColumns: 5
      },
      securityChecks: config.securityChecks ?? current.validation?.securityChecks ?? {
        checkForSensitiveData: true,
        checkForEncryption: true,
        checkForPermissions: true
      }
    };
    await this.save(current);
  }

  static async updateMappingConfig(config: Partial<MappingConfig>): Promise<void> {
    const current = await this.load();
    current.mapping = {
      ...current.mapping,
      ...config,
      typeMappings: config.typeMappings ?? current.mapping?.typeMappings ?? [],
      namingConventions: config.namingConventions ?? current.mapping?.namingConventions ?? {
        table: 'snake_case',
        column: 'snake_case',
        index: 'idx_{table}_{column}',
        foreignKey: 'fk_{table}_{column}_ref'
      },
      validationRules: config.validationRules ?? current.mapping?.validationRules ?? [],
      defaultValues: config.defaultValues ?? current.mapping?.defaultValues ?? {
        nullable: false,
        createTimestamp: true,
        updateTimestamp: true,
        softDelete: false
      }
    };
    await this.save(current);
  }

  static async exportConfig(): Promise<string> {
    const config = await this.load();
    return JSON.stringify(config, null, 2);
  }

  static async importConfig(configJson: string): Promise<void> {
    try {
      const imported = JSON.parse(configJson);
      const config = this.mergeConfigs(this.DEFAULT_CONFIG, imported);
      await this.save(config);
    } catch (error: any) {
      throw new Error(`Failed to import config: ${error?.message || 'Unknown error'}`);
    }
  }

  static async validateConfig(config: Partial<AppConfig>): Promise<string[]> {
    const errors: string[] = [];

    if (config.database) {
      if (config.database.timeout && config.database.timeout < 1000) {
        errors.push('Database timeout must be at least 1000ms');
      }
      if (config.database.poolSize && (config.database.poolSize < 1 || config.database.poolSize > 100)) {
        errors.push('Database pool size must be between 1 and 100');
      }
    }

    if (config.codegen) {
      const validORMs = ['prisma', 'typeorm', 'sequelize', 'drizzle'];
      if (config.codegen.defaultORM && !validORMs.includes(config.codegen.defaultORM)) {
        errors.push(`Invalid ORM: ${config.codegen.defaultORM}. Valid options: ${validORMs.join(', ')}`);
      }

      const validFrameworks = ['express', 'fastify', 'nestjs', 'nextjs', 'hono'];
      if (config.codegen.defaultFramework && !validFrameworks.includes(config.codegen.defaultFramework)) {
        errors.push(`Invalid framework: ${config.codegen.defaultFramework}. Valid options: ${validFrameworks.join(', ')}`);
      }
    }

    if (config.ui) {
      const validThemes = ['light', 'dark', 'auto'];
      if (config.ui.theme && !validThemes.includes(config.ui.theme)) {
        errors.push(`Invalid theme: ${config.ui.theme}. Valid options: ${validThemes.join(', ')}`);
      }

      const validLanguages = ['en', 'zh', 'ja'];
      if (config.ui.language && !validLanguages.includes(config.ui.language)) {
        errors.push(`Invalid language: ${config.ui.language}. Valid options: ${validLanguages.join(', ')}`);
      }

      if (config.ui.fontSize && (config.ui.fontSize < 10 || config.ui.fontSize > 24)) {
        errors.push('Font size must be between 10 and 24');
      }
    }

    if (config.export) {
      const validFormats = ['sql', 'json', 'yaml'];
      if (config.export.format && !validFormats.includes(config.export.format)) {
        errors.push(`Invalid export format: ${config.export.format}. Valid options: ${validFormats.join(', ')}`);
      }
    }

    return errors;
  }

  private static mergeConfigs<T>(base: T, override: Partial<T>): T {
    const result = { ...base };

    for (const key in override) {
      if (override[key] !== undefined) {
        if (typeof override[key] === 'object' && !Array.isArray(override[key])) {
          result[key] = this.mergeConfigs((base[key] as any) || {}, override[key] as any) as any;
        } else {
          result[key] = override[key] as any;
        }
      }
    }

    return result;
  }

  static getDefaultConfig(): AppConfig {
    return { ...this.DEFAULT_CONFIG };
  }

  static async clear(): Promise<void> {
    this.config = null;
    const figma = getFigma();
    await figma.clientStorage.setAsync(this.CONFIG_KEY, undefined);
  }
}
