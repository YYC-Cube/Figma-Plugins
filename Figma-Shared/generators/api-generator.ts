import { DatabaseSchema, Table, Column } from '../types/database.types';

export type APIFramework = 'express' | 'fastify' | 'nestjs' | 'nextjs' | 'hono';

export interface APIGeneratorConfig {
  framework: APIFramework;
  generateCRUD?: boolean;
  generateValidation?: boolean;
  generateTypes?: boolean;
  basePath?: string;
  indent?: string;
}

export class APIGenerator {
  private config: APIGeneratorConfig;

  constructor(config: APIGeneratorConfig) {
    this.config = {
      generateCRUD: true,
      generateValidation: true,
      generateTypes: true,
      basePath: '/api',
      indent: '  ',
      ...config
    };
  }

  generate(schema: DatabaseSchema): Map<string, string> {
    const files = new Map<string, string>();

    for (const table of schema.tables) {
      const tableName = table.name;
      const resourceName = this.toPascalCase(tableName);

      if (this.config.generateTypes) {
        files.set(`types/${tableName}.types.ts`, this.generateTypes(table));
      }

      if (this.config.generateCRUD) {
        switch (this.config.framework) {
          case 'express':
            files.set(`routes/${tableName}.routes.ts`, this.generateExpressRoutes(table));
            files.set(`controllers/${tableName}.controller.ts`, this.generateExpressController(table));
            break;
          case 'fastify':
            files.set(`routes/${tableName}.routes.ts`, this.generateFastifyRoutes(table));
            files.set(`controllers/${tableName}.controller.ts`, this.generateFastifyController(table));
            break;
          case 'nestjs':
            files.set(`modules/${tableName}/${tableName}.module.ts`, this.generateNestJSModule(table));
            files.set(`modules/${tableName}/${tableName}.controller.ts`, this.generateNestJSController(table));
            files.set(`modules/${tableName}/${tableName}.service.ts`, this.generateNestJSService(table));
            break;
          case 'nextjs':
            files.set(`app/${this.config.basePath}/${tableName}/route.ts`, this.generateNextJSRoute(table));
            break;
          case 'hono':
            files.set(`routes/${tableName}.routes.ts`, this.generateHonoRoutes(table));
            break;
        }
      }
    }

    return files;
  }

  private generateTypes(table: Table): string {
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`export interface ${this.toPascalCase(table.name)} {`);

    for (const column of table.columns) {
      const tsType = this.mapToTypeScriptType(column);
      const optional = column.nullable ? '?' : '';
      lines.push(`${indent}${column.name}${optional}: ${tsType};`);
    }

    lines.push('}');
    lines.push('');

    lines.push(`export interface Create${this.toPascalCase(table.name)} {`);

    for (const column of table.columns) {
      if (!table.primaryKeys.includes(column.name)) {
        const tsType = this.mapToTypeScriptType(column);
        const optional = column.nullable ? '?' : '';
        lines.push(`${indent}${column.name}${optional}: ${tsType};`);
      }
    }

    lines.push('}');
    lines.push('');

    lines.push(`export interface Update${this.toPascalCase(table.name)} {`);

    for (const column of table.columns) {
      if (!table.primaryKeys.includes(column.name)) {
        const tsType = this.mapToTypeScriptType(column);
        lines.push(`${indent}${column.name}?: ${tsType};`);
      }
    }

    lines.push('}');

    return lines.join('\n');
  }

  private generateExpressRoutes(table: Table): string {
    const tableName = table.name;
    const basePath = `${this.config.basePath}/${tableName}`;
    const lines: string[] = [];

    lines.push('import { Router } from "express";');
    lines.push(`import { ${this.toPascalCase(tableName)}Controller } from "../controllers/${tableName}.controller";`);
    lines.push('');
    lines.push(`const router = Router();`);
    lines.push(`const controller = new ${this.toPascalCase(tableName)}Controller();`);
    lines.push('');
    lines.push(`router.get("/", controller.getAll.bind(controller));`);
    lines.push(`router.get("/:id", controller.getById.bind(controller));`);
    lines.push(`router.post("/", controller.create.bind(controller));`);
    lines.push(`router.put("/:id", controller.update.bind(controller));`);
    lines.push(`router.delete("/:id", controller.delete.bind(controller));`);
    lines.push('');
    lines.push(`export default router;`);

    return lines.join('\n');
  }

  private generateExpressController(table: Table): string {
    const tableName = table.name;
    const resourceName = this.toPascalCase(tableName);
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`import { Request, Response } from "express";`);
    lines.push(`import { ${resourceName}, Create${resourceName}, Update${resourceName} } from "../types/${tableName}.types";`);
    lines.push('');

    lines.push(`export class ${resourceName}Controller {`);
    lines.push(`${indent}async getAll(req: Request, res: Response): Promise<void> {`);
    lines.push(`${indent}${indent}try {`);
    lines.push(`${indent}${indent}${indent}const items: ${resourceName}[] = [];`);
    lines.push(`${indent}${indent}${indent}res.json(items);`);
    lines.push(`${indent}${indent}} catch (error) {`);
    lines.push(`${indent}${indent}${indent}res.status(500).json({ error: "Internal server error" });`);
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async getById(req: Request, res: Response): Promise<void> {`);
    lines.push(`${indent}${indent}try {`);
    lines.push(`${indent}${indent}${indent}const { id } = req.params;`);
    lines.push(`${indent}${indent}${indent}const item: ${resourceName} | null = null;`);
    lines.push(`${indent}${indent}${indent}if (!item) {`);
    lines.push(`${indent}${indent}${indent}${indent}res.status(404).json({ error: "Not found" });`);
    lines.push(`${indent}${indent}${indent}${indent}return;`);
    lines.push(`${indent}${indent}${indent}}`);
    lines.push(`${indent}${indent}${indent}res.json(item);`);
    lines.push(`${indent}${indent}} catch (error) {`);
    lines.push(`${indent}${indent}${indent}res.status(500).json({ error: "Internal server error" });`);
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async create(req: Request, res: Response): Promise<void> {`);
    lines.push(`${indent}${indent}try {`);
    lines.push(`${indent}${indent}${indent}const data: Create${resourceName} = req.body;`);
    lines.push(`${indent}${indent}${indent}const newItem: ${resourceName} = {} as any;`);
    lines.push(`${indent}${indent}${indent}res.status(201).json(newItem);`);
    lines.push(`${indent}${indent}} catch (error) {`);
    lines.push(`${indent}${indent}${indent}res.status(500).json({ error: "Internal server error" });`);
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async update(req: Request, res: Response): Promise<void> {`);
    lines.push(`${indent}${indent}try {`);
    lines.push(`${indent}${indent}${indent}const { id } = req.params;`);
    lines.push(`${indent}${indent}${indent}const data: Update${resourceName} = req.body;`);
    lines.push(`${indent}${indent}${indent}const updatedItem: ${resourceName} | null = null;`);
    lines.push(`${indent}${indent}${indent}if (!updatedItem) {`);
    lines.push(`${indent}${indent}${indent}${indent}res.status(404).json({ error: "Not found" });`);
    lines.push(`${indent}${indent}${indent}${indent}return;`);
    lines.push(`${indent}${indent}${indent}}`);
    lines.push(`${indent}${indent}${indent}res.json(updatedItem);`);
    lines.push(`${indent}${indent}} catch (error) {`);
    lines.push(`${indent}${indent}${indent}res.status(500).json({ error: "Internal server error" });`);
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async delete(req: Request, res: Response): Promise<void> {`);
    lines.push(`${indent}${indent}try {`);
    lines.push(`${indent}${indent}${indent}const { id } = req.params;`);
    lines.push(`${indent}${indent}${indent}await this.deleteById(id);`);
    lines.push(`${indent}${indent}${indent}res.status(204).send();`);
    lines.push(`${indent}${indent}} catch (error) {`);
    lines.push(`${indent}${indent}${indent}res.status(500).json({ error: "Internal server error" });`);
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}private async deleteById(id: string): Promise<void> {`);
    lines.push(`${indent}${indent}`);
    lines.push(`${indent}}`);
    lines.push('}');

    return lines.join('\n');
  }

  private generateFastifyRoutes(table: Table): string {
    const tableName = table.name;
    const lines: string[] = [];

    lines.push('import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";');
    lines.push(`import { ${this.toPascalCase(tableName)}Controller } from "../controllers/${tableName}.controller";`);
    lines.push('');
    lines.push(`export async function ${this.toCamelCase(tableName)}Routes(fastify: FastifyInstance) {`);
    lines.push(`  const controller = new ${this.toPascalCase(tableName)}Controller();`);
    lines.push('');
    lines.push(`  fastify.get("/", { onRequest: [] }, controller.getAll.bind(controller));`);
    lines.push(`  fastify.get("/:id", { onRequest: [] }, controller.getById.bind(controller));`);
    lines.push(`  fastify.post("/", { onRequest: [] }, controller.create.bind(controller));`);
    lines.push(`  fastify.put("/:id", { onRequest: [] }, controller.update.bind(controller));`);
    lines.push(`  fastify.delete("/:id", { onRequest: [] }, controller.delete.bind(controller));`);
    lines.push('}');

    return lines.join('\n');
  }

  private generateFastifyController(table: Table): string {
    const tableName = table.name;
    const resourceName = this.toPascalCase(tableName);
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`import { FastifyRequest, FastifyReply } from "fastify";`);
    lines.push(`import { ${resourceName}, Create${resourceName}, Update${resourceName} } from "../types/${tableName}.types";`);
    lines.push('');

    lines.push(`export class ${resourceName}Controller {`);
    lines.push(`${indent}async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {`);
    lines.push(`${indent}${indent}const items: ${resourceName}[] = [];`);
    lines.push(`${indent}${indent}reply.send(items);`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {`);
    lines.push(`${indent}${indent}const { id } = request.params as { id: string };`);
    lines.push(`${indent}${indent}const item: ${resourceName} | null = null;`);
    lines.push(`${indent}${indent}if (!item) {`);
    lines.push(`${indent}${indent}${indent}reply.status(404).send({ error: "Not found" });`);
    lines.push(`${indent}${indent}${indent}return;`);
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}${indent}reply.send(item);`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {`);
    lines.push(`${indent}${indent}const data: Create${resourceName} = request.body as Create${resourceName};`);
    lines.push(`${indent}${indent}const newItem: ${resourceName} = {} as any;`);
    lines.push(`${indent}${indent}reply.status(201).send(newItem);`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {`);
    lines.push(`${indent}${indent}const { id } = request.params as { id: string };`);
    lines.push(`${indent}${indent}const data: Update${resourceName} = request.body as Update${resourceName};`);
    lines.push(`${indent}${indent}const updatedItem: ${resourceName} | null = null;`);
    lines.push(`${indent}${indent}if (!updatedItem) {`);
    lines.push(`${indent}${indent}${indent}reply.status(404).send({ error: "Not found" });`);
    lines.push(`${indent}${indent}${indent}return;`);
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}${indent}reply.send(updatedItem);`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {`);
    lines.push(`${indent}${indent}const { id } = request.params as { id: string };`);
    lines.push(`${indent}${indent}await this.deleteById(id);`);
    lines.push(`${indent}${indent}reply.status(204).send();`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}private async deleteById(id: string): Promise<void> {`);
    lines.push(`${indent}${indent}`);
    lines.push(`${indent}}`);
    lines.push('}');

    return lines.join('\n');
  }

  private generateNestJSModule(table: Table): string {
    const tableName = table.name;
    const resourceName = this.toPascalCase(tableName);
    const camelName = this.toCamelCase(tableName);
    const lines: string[] = [];

    lines.push(`import { Module } from '@nestjs/common';`);
    lines.push(`import { ${resourceName}Controller } from './${tableName}.controller';`);
    lines.push(`import { ${resourceName}Service } from './${tableName}.service';`);
    lines.push('');
    lines.push(`@Module({`);
    lines.push(`  controllers: [${resourceName}Controller],`);
    lines.push(`  providers: [${resourceName}Service],`);
    lines.push(`  exports: [${resourceName}Service],`);
    lines.push('})');
    lines.push(`export class ${resourceName}Module {}`);

    return lines.join('\n');
  }

  private generateNestJSController(table: Table): string {
    const tableName = table.name;
    const resourceName = this.toPascalCase(tableName);
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus } from '@nestjs/common';`);
    lines.push(`import { ${resourceName}, Create${resourceName}, Update${resourceName} } from './${tableName}.types';`);
    lines.push(`import { ${resourceName}Service } from './${tableName}.service';`);
    lines.push('');

    lines.push(`@Controller('${tableName}')`);
    lines.push(`export class ${resourceName}Controller {`);
    lines.push(`${indent}constructor(private readonly ${this.toCamelCase(resourceName)}Service: ${resourceName}Service) {}`);
    lines.push('');
    lines.push(`${indent}@Get()`);
    lines.push(`${indent}async findAll(): Promise<${resourceName}[]> {`);
    lines.push(`${indent}${indent}return this.${this.toCamelCase(resourceName)}Service.findAll();`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}@Get(':id')`);
    lines.push(`${indent}async findOne(@Param('id') id: string): Promise<${resourceName}> {`);
    lines.push(`${indent}${indent}return this.${this.toCamelCase(resourceName)}Service.findOne(id);`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}@Post()`);
    lines.push(`${indent}async create(@Body() create${resourceName}: Create${resourceName}): Promise<${resourceName}> {`);
    lines.push(`${indent}${indent}return this.${this.toCamelCase(resourceName)}Service.create(create${resourceName});`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}@Put(':id')`);
    lines.push(`${indent}async update(@Param('id') id: string, @Body() update${resourceName}: Update${resourceName}): Promise<${resourceName}> {`);
    lines.push(`${indent}${indent}return this.${this.toCamelCase(resourceName)}Service.update(id, update${resourceName});`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}@Delete(':id')`);
    lines.push(`${indent}async delete(@Param('id') id: string): Promise<void> {`);
    lines.push(`${indent}${indent}return this.${this.toCamelCase(resourceName)}Service.delete(id);`);
    lines.push(`${indent}}`);
    lines.push('}');

    return lines.join('\n');
  }

  private generateNestJSService(table: Table): string {
    const tableName = table.name;
    const resourceName = this.toPascalCase(tableName);
    const lines: string[] = [];
    const indent = this.config.indent!;

    lines.push(`import { Injectable, NotFoundException } from '@nestjs/common';`);
    lines.push(`import { ${resourceName}, Create${resourceName}, Update${resourceName} } from './${tableName}.types';`);
    lines.push('');

    lines.push(`@Injectable()`);
    lines.push(`export class ${resourceName}Service {`);
    lines.push(`${indent}async findAll(): Promise<${resourceName}[]> {`);
    lines.push(`${indent}${indent}return [];`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async findOne(id: string): Promise<${resourceName}> {`);
    lines.push(`${indent}${indent}const item = null;`);
    lines.push(`${indent}${indent}if (!item) {`);
    lines.push(`${indent}${indent}${indent}throw new NotFoundException('${resourceName} not found');`);
    lines.push(`${indent}${indent}}`);
    lines.push(`${indent}${indent}return item;`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async create(create${resourceName}: Create${resourceName}): Promise<${resourceName}> {`);
    lines.push(`${indent}${indent}return {} as any;`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async update(id: string, update${resourceName}: Update${resourceName}): Promise<${resourceName}> {`);
    lines.push(`${indent}${indent}const item = await this.findOne(id);`);
    lines.push(`${indent}${indent}return { ...item, ...update${resourceName} };`);
    lines.push(`${indent}}`);
    lines.push('');
    lines.push(`${indent}async delete(id: string): Promise<void> {`);
    lines.push(`${indent}${indent}await this.findOne(id);`);
    lines.push(`${indent}}`);
    lines.push('}');

    return lines.join('\n');
  }

  private generateNextJSRoute(table: Table): string {
    const tableName = table.name;
    const resourceName = this.toPascalCase(tableName);
    const lines: string[] = [];

    lines.push(`import { NextRequest, NextResponse } from 'next/server';`);
    lines.push(`import { ${resourceName}, Create${resourceName}, Update${resourceName} } from '../../types/${tableName}.types';`);
    lines.push('');

    lines.push('export async function GET(request: NextRequest) {');
    lines.push('  try {');
    lines.push(`    const items: ${resourceName}[] = [];`);
    lines.push('    return NextResponse.json(items);');
    lines.push('  } catch (error) {');
    lines.push('    return NextResponse.json({ error: "Internal server error" }, { status: 500 });');
    lines.push('  }');
    lines.push('}');
    lines.push('');

    lines.push('export async function POST(request: NextRequest) {');
    lines.push('  try {');
    lines.push(`    const data: Create${resourceName} = await request.json();`);
    lines.push(`    const newItem: ${resourceName} = {} as any;`);
    lines.push('    return NextResponse.json(newItem, { status: 201 });');
    lines.push('  } catch (error) {');
    lines.push('    return NextResponse.json({ error: "Internal server error" }, { status: 500 });');
    lines.push('  }');
    lines.push('}');

    return lines.join('\n');
  }

  private generateHonoRoutes(table: Table): string {
    const tableName = table.name;
    const resourceName = this.toPascalCase(tableName);
    const lines: string[] = [];

    lines.push('import { Hono } from "hono";');
    lines.push(`import { ${resourceName}, Create${resourceName}, Update${resourceName} } from "../types/${tableName}.types";`);
    lines.push('');
    lines.push(`const ${this.toCamelCase(tableName)} = new Hono();`);
    lines.push('');
    lines.push(`${this.toCamelCase(tableName)}.get("/", async (c) => {`);
    lines.push(`  const items: ${resourceName}[] = [];`);
    lines.push(`  return c.json(items);`);
    lines.push('});');
    lines.push('');
    lines.push(`${this.toCamelCase(tableName)}.get("/:id", async (c) => {`);
    lines.push(`  const id = c.req.param("id");`);
    lines.push(`  const item: ${resourceName} | null = null;`);
    lines.push(`  if (!item) {`);
    lines.push(`    return c.json({ error: "Not found" }, 404);`);
    lines.push(`  }`);
    lines.push(`  return c.json(item);`);
    lines.push('});');
    lines.push('');
    lines.push(`${this.toCamelCase(tableName)}.post("/", async (c) => {`);
    lines.push(`  const data: Create${resourceName} = await c.req.json();`);
    lines.push(`  const newItem: ${resourceName} = {} as any;`);
    lines.push(`  return c.json(newItem, 201);`);
    lines.push('});');
    lines.push('');
    lines.push(`${this.toCamelCase(tableName)}.put("/:id", async (c) => {`);
    lines.push(`  const id = c.req.param("id");`);
    lines.push(`  const data: Update${resourceName} = await c.req.json();`);
    lines.push(`  const updatedItem: ${resourceName} | null = null;`);
    lines.push(`  if (!updatedItem) {`);
    lines.push(`    return c.json({ error: "Not found" }, 404);`);
    lines.push(`  }`);
    lines.push(`  return c.json(updatedItem);`);
    lines.push('});');
    lines.push('');
    lines.push(`${this.toCamelCase(tableName)}.delete("/:id", async (c) => {`);
    lines.push(`  const id = c.req.param("id");`);
    lines.push(`  await deleteById(id);`);
    lines.push(`  return c.text("", 204);`);
    lines.push('});');
    lines.push('');
    lines.push('async function deleteById(id: string): Promise<void> {');
    lines.push('  ');
    lines.push('}');
    lines.push('');
    lines.push(`export default ${this.toCamelCase(tableName)};`);

    return lines.join('\n');
  }

  private mapToTypeScriptType(column: Column): string {
    const typeMapping: Record<string, string> = {
      'smallint': 'number',
      'integer': 'number',
      'bigint': 'number',
      'decimal': 'number',
      'numeric': 'number',
      'real': 'number',
      'double precision': 'number',
      'character varying': 'string',
      'varchar': 'string',
      'character': 'string',
      'char': 'string',
      'text': 'string',
      'bytea': 'Buffer',
      'timestamp': 'Date',
      'timestamp with time zone': 'Date',
      'timestamp without time zone': 'Date',
      'date': 'Date',
      'time': 'Date',
      'time with time zone': 'Date',
      'time without time zone': 'Date',
      'interval': 'string',
      'boolean': 'boolean',
      'bool': 'boolean',
      'json': 'any',
      'jsonb': 'any',
      'xml': 'string',
      'uuid': 'string',
      'money': 'number'
    };

    const tsType = typeMapping[column.dataType] || 'any';
    return column.nullable ? `${tsType} | null` : tsType;
  }

  private toPascalCase(str: string): string {
    return str.replace(/(^|[_\s-])(\w)/g, (_, p1, p2) => p2.toUpperCase());
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }
}
