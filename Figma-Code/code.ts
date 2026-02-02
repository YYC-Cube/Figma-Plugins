import { DesignParser } from '../figma-postgres-shared/parsers';
import { SQLGenerator } from '../figma-postgres-shared/generators';
import { ORMGenerator } from '../figma-postgres-shared/generators';
import { APIGenerator } from '../figma-postgres-shared/generators';
import { PluginCommunication } from '../figma-postgres-shared/utils/communication';
import { ConfigManager } from '../figma-postgres-shared/config/config-manager';
import { DatabaseSchema } from '../figma-postgres-shared/types';

figma.codegen.on('generate', async (event) => {
  try {
    const language = event.node.document?.codegenLanguage || 'sql';
    
    let code = '';
    let title = 'Generated Code';
    
    switch (language) {
      case 'sql':
        code = await generateSQLCode(event);
        title = 'PostgreSQL SQL';
        break;
      case 'prisma':
        code = await generatePrismaCode(event);
        title = 'Prisma ORM';
        break;
      case 'typeorm':
        code = await generateTypeORMCode(event);
        title = 'TypeORM';
        break;
      case 'sequelize':
        code = await generateSequelizeCode(event);
        title = 'Sequelize';
        break;
      case 'drizzle':
        code = await generateDrizzleCode(event);
        title = 'Drizzle ORM';
        break;
      case 'express':
        code = await generateExpressAPI(event);
        title = 'Express API';
        break;
      case 'fastify':
        code = await generateFastifyAPI(event);
        title = 'Fastify API';
        break;
      case 'nestjs':
        code = await generateNestJSAPI(event);
        title = 'NestJS API';
        break;
      case 'nextjs':
        code = await generateNextJSAPI(event);
        title = 'Next.js API';
        break;
      case 'hono':
        code = await generateHonoAPI(event);
        title = 'Hono API';
        break;
      default:
        code = `// Unsupported language: ${language}`;
        title = 'Error';
    }
    
    return [
      {
        language: language.toUpperCase(),
        code: code,
        title: title,
      },
    ];
  } catch (error) {
    console.error('Code generation error:', error);
    return [
      {
        language: 'PLAINTEXT',
        code: `// Error generating code: ${error.message}`,
        title: 'Error',
      },
    ];
  }
});

async function generateSQLCode(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `-- No database schema found for node: ${event.node.name}`;
  }
  
  const generator = new SQLGenerator();
  return generator.generateFullSchemaSQL(schema);
}

async function generatePrismaCode(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new ORMGenerator({
    type: 'prisma',
    generateRelations: config.codegen?.generateRelations,
    generateValidation: config.codegen?.generateValidation
  });
  
  return generator.generate(schema);
}

async function generateTypeORMCode(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new ORMGenerator({
    type: 'typeorm',
    generateRelations: config.codegen?.generateRelations,
    generateValidation: config.codegen?.generateValidation
  });
  
  return generator.generate(schema);
}

async function generateSequelizeCode(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new ORMGenerator({
    type: 'sequelize',
    generateRelations: config.codegen?.generateRelations,
    generateValidation: config.codegen?.generateValidation
  });
  
  return generator.generate(schema);
}

async function generateDrizzleCode(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new ORMGenerator({
    type: 'drizzle',
    generateRelations: config.codegen?.generateRelations,
    generateValidation: config.codegen?.generateValidation
  });
  
  return generator.generate(schema);
}

async function generateExpressAPI(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new APIGenerator({
    framework: 'express',
    generateCRUD: config.codegen?.generateTypes,
    generateValidation: config.codegen?.generateValidation,
    generateTypes: config.codegen?.generateTypes
  });
  
  const files = generator.generate(schema);
  
  return formatGeneratedFiles(files);
}

async function generateFastifyAPI(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new APIGenerator({
    framework: 'fastify',
    generateCRUD: config.codegen?.generateTypes,
    generateValidation: config.codegen?.generateValidation,
    generateTypes: config.codegen?.generateTypes
  });
  
  const files = generator.generate(schema);
  
  return formatGeneratedFiles(files);
}

async function generateNestJSAPI(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new APIGenerator({
    framework: 'nestjs',
    generateCRUD: config.codegen?.generateTypes,
    generateValidation: config.codegen?.generateValidation,
    generateTypes: config.codegen?.generateTypes
  });
  
  const files = generator.generate(schema);
  
  return formatGeneratedFiles(files);
}

async function generateNextJSAPI(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new APIGenerator({
    framework: 'nextjs',
    generateCRUD: config.codegen?.generateTypes,
    generateValidation: config.codegen?.generateValidation,
    generateTypes: config.codegen?.generateTypes
  });
  
  const files = generator.generate(schema);
  
  return formatGeneratedFiles(files);
}

async function generateHonoAPI(event: any): Promise<string> {
  const schema = await getSchemaFromNode(event.node);
  
  if (!schema || schema.tables.length === 0) {
    return `// No database schema found for node: ${event.node.name}`;
  }
  
  const config = await ConfigManager.load();
  const generator = new APIGenerator({
    framework: 'hono',
    generateCRUD: config.codegen?.generateTypes,
    generateValidation: config.codegen?.generateValidation,
    generateTypes: config.codegen?.generateTypes
  });
  
  const files = generator.generate(schema);
  
  return formatGeneratedFiles(files);
}

async function getSchemaFromNode(node: any): Promise<DatabaseSchema | null> {
  try {
    const designSchema = await PluginCommunication.loadDesignSchema();
    
    if (designSchema) {
      const { SchemaParser } = await import('../figma-postgres-shared/parsers');
      const parser = new SchemaParser();
      return parser.parseFromJSON(JSON.stringify(designSchema));
    }
    
    const parser = new DesignParser();
    const parsedDesign = await parser.parseFromSelection();
    
    if (parsedDesign.tables.length > 0) {
      await PluginCommunication.saveDesignSchema(parsedDesign);
      
      const { SchemaParser } = await import('../figma-postgres-shared/parsers');
      const schemaParser = new SchemaParser();
      return schemaParser.parseFromJSON(JSON.stringify(parsedDesign));
    }
    
    return null;
  } catch (error) {
    console.error('Error getting schema from node:', error);
    return null;
  }
}

function formatGeneratedFiles(files: Map<string, string>): string {
  let output = '// Generated API Files\n\n';
  
  for (const [path, content] of files.entries()) {
    output += `// File: ${path}\n`;
    output += '// '.repeat(50) + '\n\n';
    output += content;
    output += '\n\n';
  }
  
  return output;
}

figma.on('selectionchange', async () => {
  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    const schema = await getSchemaFromNode(selection[0]);
    if (schema) {
      await PluginCommunication.saveSchema(schema);
    }
  }
});
