# PostgreSQL Data Manager

> ***YanYuCloudCube***
> 言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> 万象归元于云枢 | 深栈智启新纪元
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

> Manage, version, and export PostgreSQL database schemas directly in Figma

## Overview

PostgreSQL Data Manager is a comprehensive Figma plugin that provides a complete solution for managing database schemas within the Figma design environment. It serves as the central hub for the PostgreSQL plugin ecosystem, enabling schema management, version control, import/export capabilities, and seamless integration with other PostgreSQL plugins.

## Features

### Schema Management
- Load and parse database schemas from Figma design elements
- Save and manage schema metadata
- View schema statistics (tables, columns, relations)
- Real-time schema validation

### Version Control
- Create and manage multiple schema versions
- Compare different versions to identify changes
- Merge schema versions
- Track version history with descriptions

### Import/Export
- Import schemas from SQL, JSON, or Prisma formats
- Export schemas to multiple formats
- Load schemas from local files
- Seamless integration with external tools

### Validation
- Comprehensive schema validation
- Real-time feedback on design compliance
- Performance and security checks
- Detailed validation reports

### Integration
- Seamless communication with other PostgreSQL plugins
- Shared type definitions and utilities
- Configurable settings and preferences
- Plugin ecosystem support

## Installation

1. Clone this repository or download the plugin files
2. Navigate to the plugin directory:
   ```bash
   cd figma-postgres-plugin
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the shared library:
   ```bash
   npm run build:shared
   ```
5. Build the plugin:
   ```bash
   npm run build
   ```
6. In Figma, go to Plugins > Development > Import plugin from manifest...
7. Select the `manifest.json` file in this directory

## Usage

### Loading a Schema

1. Open the plugin in Figma
2. Select design elements that represent your database schema
3. Click "Load Schema" in the Schema tab
4. The plugin will parse and display schema information

### Creating a Version

1. Load or create a schema
2. Go to the Versions tab
3. Click "Create Version"
4. Enter a name and description
5. Click "Create" to save the version

### Importing a Schema

1. Go to the Import tab
2. Select the import format (SQL, JSON, or Prisma)
3. Paste the schema content or load from a file
4. Click "Import Schema"

### Exporting a Schema

1. Load or create a schema
2. Go to the Export tab
3. Select the export format
4. Click "Export Schema"
5. The file will be downloaded automatically

### Validating a Schema

1. Load or create a schema
2. Go to the Validate tab
3. Click "Run Validation"
4. Review the validation results and recommendations

## Plugin Ecosystem

This plugin is part of the PostgreSQL plugin ecosystem:

- **figma-postgres**: Design visualization tool
- **figma-postgres-Code**: Code generation plugin
- **figma-postgres-check**: Design specification checker
- **figma-postgres-plugin**: Data management panel (this plugin)

All plugins share a common library (`figma-postgres-shared`) for consistent type definitions, parsers, generators, and validators.

## Development

### Project Structure

```
figma-postgres-plugin/
├── manifest.json          # Plugin manifest
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── code.ts                 # Main plugin logic
├── ui.html                 # Plugin UI
└── README.md              # This file
```

### Building

```bash
# Build the shared library first
npm run build:shared

# Build the plugin
npm run build

# Watch for changes
npm run watch

# Development mode (builds shared lib and watches)
npm run dev
```

### Linting

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Configuration

The plugin supports configurable settings:

- **Default Export Format**: Choose between SQL, JSON, or Prisma
- **Auto-save Schema**: Enable automatic schema saving

Settings are accessible from the Settings tab in the plugin UI.

## API Reference

### Message Types

The plugin communicates with the UI using the following message types:

- `load-schema`: Load schema from current selection
- `save-schema`: Save current schema with metadata
- `import-schema`: Import schema from content
- `export-schema`: Export schema to specified format
- `create-version`: Create a new schema version
- `load-version`: Load a specific version
- `delete-version`: Delete a version
- `list-versions`: List all versions
- `compare-versions`: Compare two versions
- `merge-versions`: Merge two versions
- `validate-schema`: Run schema validation
- `visualize-schema`: Visualize schema in design
- `load-config`: Load plugin configuration
- `save-config`: Save plugin configuration
- `close`: Close the plugin

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please contact the YYC³ team.

---

<div align="center">

> **YanYuCloudCube**
> **言启象限 | 语枢未来**
> **Words Initiate Quadrants, Language Serves as Core for the Future**
> **万象归元于云枢 | 深栈智启新纪元**
> **All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence**

</div>
