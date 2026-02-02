import { DesignParser } from '../figma-postgres-shared/parsers';
import { SchemaValidator } from '../figma-postgres-shared/validators';
import { PluginCommunication } from '../figma-postgres-shared/utils/communication';
import { ConfigManager } from '../figma-postgres-shared/config/config-manager';
import { DatabaseSchema, ValidationResult } from '../figma-postgres-shared/types';

let currentSchema: DatabaseSchema | null = null;
let validationResults: ValidationResult | null = null;

figma.showUI(__html__, { width: 480, height: 640 });

figma.on('selectionchange', async () => {
  const selection = figma.currentPage.selection;
  
  if (selection.length > 0) {
    const schema = await getSchemaFromSelection();
    if (schema) {
      currentSchema = schema;
      await PluginCommunication.saveSchema(schema);
      
      figma.ui.postMessage({
        type: 'selection-changed',
        data: {
          count: selection.length,
          schema: schema
        }
      });
      
      await validateCurrentSchema();
    }
  } else {
    figma.ui.postMessage({
      type: 'selection-changed',
      data: {
        count: 0,
        schema: null
      }
    });
  }
});

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'validate':
      await validateCurrentSchema();
      break;
      
    case 'validate-design':
      await validateDesign();
      break;
      
    case 'fix-issue':
      await fixIssue(msg.issueId);
      break;
      
    case 'export-report':
      await exportValidationReport(msg.format);
      break;
      
    case 'load-config':
      await loadAndSendConfig();
      break;
      
    case 'save-config':
      await saveConfig(msg.config);
      break;
      
    case 'close':
      figma.closePlugin();
      break;
  }
};

async function getSchemaFromSelection(): Promise<DatabaseSchema | null> {
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
    console.error('Error getting schema from selection:', error);
    return null;
  }
}

async function validateCurrentSchema() {
  if (!currentSchema) {
    figma.ui.postMessage({
      type: 'validation-error',
      data: {
        message: 'No schema to validate. Please select a design element.'
      }
    });
    return;
  }
  
  try {
    const config = await ConfigManager.load();
    const validator = new SchemaValidator(config.validation);
    validationResults = validator.validateSchema(currentSchema);
    
    figma.ui.postMessage({
      type: 'validation-complete',
      data: validationResults
    });
    
    await PluginCommunication.saveValidationResults(validationResults);
    
    highlightValidationIssues(validationResults);
  } catch (error) {
    console.error('Validation error:', error);
    figma.ui.postMessage({
      type: 'validation-error',
      data: {
        message: `Validation error: ${error.message}`
      }
    });
  }
}

async function validateDesign() {
  try {
    const parser = new DesignParser();
    const parsedDesign = await parser.parseFromSelection();
    
    if (parsedDesign.tables.length === 0) {
      figma.ui.postMessage({
        type: 'validation-error',
        data: {
          message: 'No database tables found in selection.'
        }
      });
      return;
    }
    
    const { SchemaParser } = await import('../figma-postgres-shared/parsers');
    const schemaParser = new SchemaParser();
    const schema = schemaParser.parseFromJSON(JSON.stringify(parsedDesign));
    
    currentSchema = schema;
    await PluginCommunication.saveDesignSchema(parsedDesign);
    await PluginCommunication.saveSchema(schema);
    
    await validateCurrentSchema();
  } catch (error) {
    console.error('Design validation error:', error);
    figma.ui.postMessage({
      type: 'validation-error',
      data: {
        message: `Design validation error: ${error.message}`
      }
    });
  }
}

async function fixIssue(issueId: string) {
  if (!validationResults) {
    return;
  }
  
  const issue = validationResults.issues.find(i => i.id === issueId);
  if (!issue) {
    return;
  }
  
  try {
    switch (issue.code) {
      case 'NAMING_TABLE_INVALID':
        await fixTableNaming(issue);
        break;
      case 'NAMING_COLUMN_INVALID':
        await fixColumnNaming(issue);
        break;
      case 'PERFORMANCE_TOO_MANY_COLUMNS':
        await fixTooManyColumns(issue);
        break;
      case 'PERFORMANCE_MISSING_INDEX':
        await fixMissingIndex(issue);
        break;
      case 'SECURITY_SENSITIVE_DATA':
        await fixSensitiveData(issue);
        break;
      default:
        figma.ui.postMessage({
          type: 'fix-error',
          data: {
            issueId,
            message: 'Auto-fix not available for this issue type.'
          }
        });
    }
    
    await validateCurrentSchema();
  } catch (error) {
    console.error('Fix error:', error);
    figma.ui.postMessage({
      type: 'fix-error',
      data: {
        issueId,
        message: `Error fixing issue: ${error.message}`
      }
    });
  }
}

async function fixTableNaming(issue: any) {
  const tableName = issue.context.tableName;
  const fixedName = toSnakeCase(tableName);
  
  const selection = figma.currentPage.selection;
  for (const node of selection) {
    if (node.type === 'FRAME' && node.name === tableName) {
      await figma.loadFontAsync(node.fontName as FontName);
      node.name = fixedName;
      break;
    }
  }
  
  figma.notify(`Renamed table '${tableName}' to '${fixedName}'`);
}

async function fixColumnNaming(issue: any) {
  const columnName = issue.context.columnName;
  const fixedName = toSnakeCase(columnName);
  
  const selection = figma.currentPage.selection;
  for (const node of selection) {
    if (node.type === 'FRAME') {
      for (const child of node.children) {
        if (child.type === 'TEXT' && child.name === columnName) {
          await figma.loadFontAsync(child.fontName as FontName);
          child.name = fixedName;
          break;
        }
      }
    }
  }
  
  figma.notify(`Renamed column '${columnName}' to '${fixedName}'`);
}

async function fixTooManyColumns(issue: any) {
  figma.notify('Please review table structure and consider splitting into multiple tables.');
}

async function fixMissingIndex(issue: any) {
  figma.notify('Please add an index for this column to improve query performance.');
}

async function fixSensitiveData(issue: any) {
  figma.notify('Please ensure sensitive data is properly encrypted and protected.');
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

async function highlightValidationIssues(results: ValidationResult) {
  const selection = figma.currentPage.selection;
  
  for (const node of selection) {
    if (node.type === 'FRAME') {
      const tableIssues = results.issues.filter(
        i => i.context?.tableName === node.name
      );
      
      if (tableIssues.length > 0) {
        const hasErrors = tableIssues.some(i => i.severity === 'error');
        const hasWarnings = tableIssues.some(i => i.severity === 'warning');
        
        if (hasErrors) {
          node.fills = [{ type: 'SOLID', color: { r: 1, g: 0.9, b: 0.9 } }];
        } else if (hasWarnings) {
          node.fills = [{ type: 'SOLID', color: { r: 1, g: 0.98, b: 0.9 } }];
        }
      }
    }
  }
}

async function exportValidationReport(format: string) {
  if (!validationResults) {
    figma.notify('No validation results to export.');
    return;
  }
  
  let content = '';
  let filename = '';
  
  if (format === 'json') {
    content = JSON.stringify(validationResults, null, 2);
    filename = 'validation-report.json';
  } else if (format === 'md') {
    content = generateMarkdownReport(validationResults);
    filename = 'validation-report.md';
  } else if (format === 'txt') {
    content = generateTextReport(validationResults);
    filename = 'validation-report.txt';
  }
  
  figma.ui.postMessage({
    type: 'export-ready',
    data: {
      content,
      filename
    }
  });
}

function generateMarkdownReport(results: ValidationResult): string {
  let report = '# PostgreSQL Schema Validation Report\n\n';
  report += `**Score:** ${results.score}/100\n\n`;
  report += `**Date:** ${new Date().toISOString()}\n\n`;
  
  report += '## Summary\n\n';
  report += `- Errors: ${results.summary.errors}\n`;
  report += `- Warnings: ${results.summary.warnings}\n`;
  report += `- Infos: ${results.summary.infos}\n\n`;
  
  if (results.issues.length === 0) {
    report += '✅ No issues found! Schema is valid.\n';
    return report;
  }
  
  report += '## Issues\n\n';
  
  const grouped = {
    error: results.issues.filter(i => i.severity === 'error'),
    warning: results.issues.filter(i => i.severity === 'warning'),
    info: results.issues.filter(i => i.severity === 'info')
  };
  
  if (grouped.error.length > 0) {
    report += '### Errors\n\n';
    grouped.error.forEach(issue => {
      report += `#### ${issue.code}\n`;
      report += `**Message:** ${issue.message}\n\n`;
      report += `**Description:** ${issue.description}\n\n`;
      if (issue.context) {
        report += `**Context:** ${JSON.stringify(issue.context)}\n\n`;
      }
      report += `**Auto-fix:** ${issue.autoFix ? 'Available' : 'Not available'}\n\n`;
    });
  }
  
  if (grouped.warning.length > 0) {
    report += '### Warnings\n\n';
    grouped.warning.forEach(issue => {
      report += `#### ${issue.code}\n`;
      report += `**Message:** ${issue.message}\n\n`;
      report += `**Description:** ${issue.description}\n\n`;
      if (issue.context) {
        report += `**Context:** ${JSON.stringify(issue.context)}\n\n`;
      }
    });
  }
  
  if (grouped.info.length > 0) {
    report += '### Information\n\n';
    grouped.info.forEach(issue => {
      report += `#### ${issue.code}\n`;
      report += `**Message:** ${issue.message}\n\n`;
      report += `**Description:** ${issue.description}\n\n`;
    });
  }
  
  return report;
}

function generateTextReport(results: ValidationResult): string {
  let report = 'PostgreSQL Schema Validation Report\n';
  report += '='.repeat(50) + '\n\n';
  report += `Score: ${results.score}/100\n`;
  report += `Date: ${new Date().toISOString()}\n\n`;
  
  report += 'Summary:\n';
  report += `  Errors: ${results.summary.errors}\n`;
  report += `  Warnings: ${results.summary.warnings}\n`;
  report += `  Infos: ${results.summary.infos}\n\n`;
  
  if (results.issues.length === 0) {
    report += 'No issues found! Schema is valid.\n';
    return report;
  }
  
  report += 'Issues:\n\n';
  results.issues.forEach((issue, index) => {
    report += `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.code}\n`;
    report += `   Message: ${issue.message}\n`;
    report += `   Description: ${issue.description}\n`;
    if (issue.context) {
      report += `   Context: ${JSON.stringify(issue.context)}\n`;
    }
    report += '\n';
  });
  
  return report;
}

async function loadAndSendConfig() {
  const config = await ConfigManager.load();
  figma.ui.postMessage({
    type: 'config-loaded',
    data: config
  });
}

async function saveConfig(config: any) {
  await ConfigManager.save(config);
  figma.notify('Configuration saved.');
}
