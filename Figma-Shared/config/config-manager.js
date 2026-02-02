var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getFigma } from '../utils/figma-adapter';
export class ConfigManager {
    static load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.config) {
                return this.config;
            }
            const figma = getFigma();
            const stored = yield figma.clientStorage.getAsync(this.CONFIG_KEY);
            if (stored) {
                try {
                    this.config = this.mergeConfigs(this.DEFAULT_CONFIG, JSON.parse(stored));
                }
                catch (_a) {
                    this.config = Object.assign({}, this.DEFAULT_CONFIG);
                }
            }
            else {
                this.config = Object.assign({}, this.DEFAULT_CONFIG);
            }
            return this.config;
        });
    }
    static save(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const current = yield this.load();
            this.config = this.mergeConfigs(current, config);
            const figma = getFigma();
            yield figma.clientStorage.setAsync(this.CONFIG_KEY, JSON.stringify(this.config));
        });
    }
    static reset() {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = Object.assign({}, this.DEFAULT_CONFIG);
            const figma = getFigma();
            yield figma.clientStorage.setAsync(this.CONFIG_KEY, JSON.stringify(this.config));
        });
    }
    static get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.load();
            return config[key];
        });
    }
    static set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.load();
            config[key] = value;
            yield this.save(config);
        });
    }
    static updateValidationConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            const current = yield this.load();
            current.validation = Object.assign(Object.assign(Object.assign({}, current.validation), config), { enabledRules: (_c = (_a = config.enabledRules) !== null && _a !== void 0 ? _a : (_b = current.validation) === null || _b === void 0 ? void 0 : _b.enabledRules) !== null && _c !== void 0 ? _c : ['*'], severityOverrides: (_f = (_d = config.severityOverrides) !== null && _d !== void 0 ? _d : (_e = current.validation) === null || _e === void 0 ? void 0 : _e.severityOverrides) !== null && _f !== void 0 ? _f : {}, namingConventions: (_j = (_g = config.namingConventions) !== null && _g !== void 0 ? _g : (_h = current.validation) === null || _h === void 0 ? void 0 : _h.namingConventions) !== null && _j !== void 0 ? _j : {
                    tables: { pattern: /^[a-z][a-z0-9_]*$/, description: 'snake_case', examples: { valid: ['users', 'user_profiles'], invalid: ['Users', 'userProfiles'] } },
                    columns: { pattern: /^[a-z][a-z0-9_]*$/, description: 'snake_case', examples: { valid: ['user_id', 'created_at'], invalid: ['userId', 'createdAt'] } },
                    indexes: { pattern: /^idx_[a-z][a-z0-9_]*$/, description: 'idx_table_column', examples: { valid: ['idx_users_email'], invalid: ['users_email_idx'] } },
                    foreignKeys: { pattern: /^fk_[a-z][a-z0-9_]*$/, description: 'fk_table_column_ref', examples: { valid: ['fk_users_profile_id'], invalid: ['users_profile_id_fk'] } }
                }, performanceThresholds: (_m = (_k = config.performanceThresholds) !== null && _k !== void 0 ? _k : (_l = current.validation) === null || _l === void 0 ? void 0 : _l.performanceThresholds) !== null && _m !== void 0 ? _m : {
                    maxColumnsPerTable: 50,
                    maxForeignKeysPerTable: 10,
                    maxIndexColumns: 5
                }, securityChecks: (_q = (_o = config.securityChecks) !== null && _o !== void 0 ? _o : (_p = current.validation) === null || _p === void 0 ? void 0 : _p.securityChecks) !== null && _q !== void 0 ? _q : {
                    checkForSensitiveData: true,
                    checkForEncryption: true,
                    checkForPermissions: true
                } });
            yield this.save(current);
        });
    }
    static updateMappingConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            const current = yield this.load();
            current.mapping = Object.assign(Object.assign(Object.assign({}, current.mapping), config), { typeMappings: (_c = (_a = config.typeMappings) !== null && _a !== void 0 ? _a : (_b = current.mapping) === null || _b === void 0 ? void 0 : _b.typeMappings) !== null && _c !== void 0 ? _c : [], namingConventions: (_f = (_d = config.namingConventions) !== null && _d !== void 0 ? _d : (_e = current.mapping) === null || _e === void 0 ? void 0 : _e.namingConventions) !== null && _f !== void 0 ? _f : {
                    table: 'snake_case',
                    column: 'snake_case',
                    index: 'idx_{table}_{column}',
                    foreignKey: 'fk_{table}_{column}_ref'
                }, validationRules: (_j = (_g = config.validationRules) !== null && _g !== void 0 ? _g : (_h = current.mapping) === null || _h === void 0 ? void 0 : _h.validationRules) !== null && _j !== void 0 ? _j : [], defaultValues: (_m = (_k = config.defaultValues) !== null && _k !== void 0 ? _k : (_l = current.mapping) === null || _l === void 0 ? void 0 : _l.defaultValues) !== null && _m !== void 0 ? _m : {
                    nullable: false,
                    createTimestamp: true,
                    updateTimestamp: true,
                    softDelete: false
                } });
            yield this.save(current);
        });
    }
    static exportConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.load();
            return JSON.stringify(config, null, 2);
        });
    }
    static importConfig(configJson) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const imported = JSON.parse(configJson);
                const config = this.mergeConfigs(this.DEFAULT_CONFIG, imported);
                yield this.save(config);
            }
            catch (error) {
                throw new Error(`Failed to import config: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`);
            }
        });
    }
    static validateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
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
        });
    }
    static mergeConfigs(base, override) {
        const result = Object.assign({}, base);
        for (const key in override) {
            if (override[key] !== undefined) {
                if (typeof override[key] === 'object' && !Array.isArray(override[key])) {
                    result[key] = this.mergeConfigs(base[key] || {}, override[key]);
                }
                else {
                    result[key] = override[key];
                }
            }
        }
        return result;
    }
    static getDefaultConfig() {
        return Object.assign({}, this.DEFAULT_CONFIG);
    }
    static clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = null;
            const figma = getFigma();
            yield figma.clientStorage.setAsync(this.CONFIG_KEY, undefined);
        });
    }
}
ConfigManager.CONFIG_KEY = 'figma-postgres-config';
ConfigManager.DEFAULT_CONFIG = {
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
ConfigManager.config = null;
