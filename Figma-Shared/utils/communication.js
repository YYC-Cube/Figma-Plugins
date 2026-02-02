var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getFigma } from './figma-adapter';
export class PluginCommunication {
    static saveSchema(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}schema`, JSON.stringify(schema));
        });
    }
    static loadSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const data = yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}schema`);
            if (!data)
                return null;
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return null;
            }
        });
    }
    static saveDesignSchema(designSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}design-schema`, JSON.stringify(designSchema));
        });
    }
    static loadDesignSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const data = yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}design-schema`);
            if (!data)
                return null;
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return null;
            }
        });
    }
    static saveValidationResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}validation`, JSON.stringify(result));
        });
    }
    static loadValidationResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const data = yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}validation`);
            if (!data)
                return null;
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return null;
            }
        });
    }
    static saveGeneratedCode(code, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}code-${type}`, code);
        });
    }
    static loadGeneratedCode(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            return yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}code-${type}`);
        });
    }
    static saveConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}config`, JSON.stringify(config));
        });
    }
    static loadConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const data = yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}config`);
            if (!data)
                return null;
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return null;
            }
        });
    }
    static clearAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const keys = yield figma.clientStorage.keysAsync();
            const postgresKeys = keys.filter((key) => key.startsWith(this.STORAGE_PREFIX));
            for (const key of postgresKeys) {
                yield figma.clientStorage.setAsync(key, undefined);
            }
        });
    }
    static broadcastMessage(type, data) {
        const figma = getFigma();
        figma.ui.postMessage({
            channel: `${this.CHANNEL_PREFIX}${type}`,
            data,
            timestamp: Date.now()
        });
    }
    static setupMessageHandler(handler) {
        const figma = getFigma();
        figma.ui.onmessage = (message) => {
            if (message.channel && message.channel.startsWith(this.CHANNEL_PREFIX)) {
                handler(message);
            }
        };
    }
    static saveTableMapping(mapping) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}table-mapping`, JSON.stringify(mapping));
        });
    }
    static loadTableMapping() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const data = yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}table-mapping`);
            if (!data)
                return null;
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return null;
            }
        });
    }
    static saveRecentFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}recent-files`, JSON.stringify(files));
        });
    }
    static loadRecentFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const data = yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}recent-files`);
            if (!data)
                return [];
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return [];
            }
        });
    }
    static addToRecentFiles(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const recent = yield this.loadRecentFiles();
            const filtered = recent.filter(f => f !== filePath);
            filtered.unshift(filePath);
            yield this.saveRecentFiles(filtered.slice(0, 10));
        });
    }
    static saveConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const connections = yield this.loadConnections();
            connections[connection.name] = connection;
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}connections`, JSON.stringify(connections));
        });
    }
    static loadConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const data = yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}connections`);
            if (!data)
                return {};
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return {};
            }
        });
    }
    static deleteConnection(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const connections = yield this.loadConnections();
            delete connections[name];
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}connections`, JSON.stringify(connections));
        });
    }
    static saveExportSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            yield figma.clientStorage.setAsync(`${this.STORAGE_PREFIX}export-settings`, JSON.stringify(settings));
        });
    }
    static loadExportSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const figma = getFigma();
            const data = yield figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}export-settings`);
            if (!data)
                return null;
            try {
                return JSON.parse(data);
            }
            catch (_a) {
                return null;
            }
        });
    }
}
PluginCommunication.STORAGE_PREFIX = 'figma-postgres-';
PluginCommunication.CHANNEL_PREFIX = 'figma-postgres-';
