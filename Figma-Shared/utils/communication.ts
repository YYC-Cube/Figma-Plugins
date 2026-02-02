import { DatabaseSchema, DesignSchema, Table, DesignTable } from '../types';
import { getFigma } from './figma-adapter';

export class PluginCommunication {
  private static readonly STORAGE_PREFIX = 'figma-postgres-';
  private static readonly CHANNEL_PREFIX = 'figma-postgres-';

  static async saveSchema(schema: DatabaseSchema): Promise<void> {
    const figma = getFigma();
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}schema`,
      JSON.stringify(schema)
    );
  }

  static async loadSchema(): Promise<DatabaseSchema | null> {
    const figma = getFigma();
    const data = await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}schema`);
    if (!data) return null;
    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }

  static async saveDesignSchema(designSchema: DesignSchema): Promise<void> {
    const figma = getFigma();
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}design-schema`,
      JSON.stringify(designSchema)
    );
  }

  static async loadDesignSchema(): Promise<DesignSchema | null> {
    const figma = getFigma();
    const data = await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}design-schema`);
    if (!data) return null;
    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }

  static async saveValidationResult(result: any): Promise<void> {
    const figma = getFigma();
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}validation`,
      JSON.stringify(result)
    );
  }

  static async loadValidationResult(): Promise<any | null> {
    const figma = getFigma();
    const data = await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}validation`);
    if (!data) return null;
    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }

  static async saveGeneratedCode(code: string, type: string): Promise<void> {
    const figma = getFigma();
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}code-${type}`,
      code
    );
  }

  static async loadGeneratedCode(type: string): Promise<string | null> {
    const figma = getFigma();
    return await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}code-${type}`) as string | null;
  }

  static async saveConfig(config: Record<string, any>): Promise<void> {
    const figma = getFigma();
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}config`,
      JSON.stringify(config)
    );
  }

  static async loadConfig(): Promise<Record<string, any> | null> {
    const figma = getFigma();
    const data = await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}config`);
    if (!data) return null;
    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }

  static async clearAllData(): Promise<void> {
    const figma = getFigma();
    const keys = await figma.clientStorage.keysAsync();
    const postgresKeys = keys.filter((key: string) => key.startsWith(this.STORAGE_PREFIX));
    
    for (const key of postgresKeys) {
      await figma.clientStorage.setAsync(key, undefined);
    }
  }

  static broadcastMessage(type: string, data: any): void {
    const figma = getFigma();
    figma.ui.postMessage({
      channel: `${this.CHANNEL_PREFIX}${type}`,
      data,
      timestamp: Date.now()
    });
  }

  static setupMessageHandler(handler: (message: any) => void): void {
    const figma = getFigma();
    figma.ui.onmessage = (message: any) => {
      if (message.channel && message.channel.startsWith(this.CHANNEL_PREFIX)) {
        handler(message);
      }
    };
  }

  static async saveTableMapping(mapping: Record<string, string>): Promise<void> {
    const figma = getFigma();
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}table-mapping`,
      JSON.stringify(mapping)
    );
  }

  static async loadTableMapping(): Promise<Record<string, string> | null> {
    const figma = getFigma();
    const data = await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}table-mapping`);
    if (!data) return null;
    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }

  static async saveRecentFiles(files: string[]): Promise<void> {
    const figma = getFigma();
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}recent-files`,
      JSON.stringify(files)
    );
  }

  static async loadRecentFiles(): Promise<string[]> {
    const figma = getFigma();
    const data = await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}recent-files`);
    if (!data) return [];
    try {
      return JSON.parse(data as string);
    } catch {
      return [];
    }
  }

  static async addToRecentFiles(filePath: string): Promise<void> {
    const recent = await this.loadRecentFiles();
    const filtered = recent.filter(f => f !== filePath);
    filtered.unshift(filePath);
    await this.saveRecentFiles(filtered.slice(0, 10));
  }

  static async saveConnection(connection: any): Promise<void> {
    const figma = getFigma();
    const connections = await this.loadConnections();
    connections[connection.name] = connection;
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}connections`,
      JSON.stringify(connections)
    );
  }

  static async loadConnections(): Promise<Record<string, any>> {
    const figma = getFigma();
    const data = await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}connections`);
    if (!data) return {};
    try {
      return JSON.parse(data as string);
    } catch {
      return {};
    }
  }

  static async deleteConnection(name: string): Promise<void> {
    const figma = getFigma();
    const connections = await this.loadConnections();
    delete connections[name];
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}connections`,
      JSON.stringify(connections)
    );
  }

  static async saveExportSettings(settings: Record<string, any>): Promise<void> {
    const figma = getFigma();
    await figma.clientStorage.setAsync(
      `${this.STORAGE_PREFIX}export-settings`,
      JSON.stringify(settings)
    );
  }

  static async loadExportSettings(): Promise<Record<string, any> | null> {
    const figma = getFigma();
    const data = await figma.clientStorage.getAsync(`${this.STORAGE_PREFIX}export-settings`);
    if (!data) return null;
    try {
      return JSON.parse(data as string);
    } catch {
      return null;
    }
  }
}
