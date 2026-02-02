# PostgreSQL Schema Validator

> Validate database designs against best practices

## Overview

PostgreSQL Schema Validator is a Figma plugin that ensures your database designs follow industry best practices and PostgreSQL conventions. Validate naming conventions, check for performance issues, verify security practices, and get actionable suggestions to improve your schema design.

## Features

### ✅ Comprehensive Validation
- Naming convention checks (tables, columns, indexes)
- Performance optimization suggestions
- Security best practices verification
- Data type validation
- Relationship integrity checks

### 🔍 Real-time Validation
- Automatic validation on selection change
- Visual highlighting of issues in design
- Instant feedback and suggestions

### 🛠️ Auto-fix Capabilities
- Automatic naming convention fixes
- Quick fixes for common issues
- One-click problem resolution

### 📊 Detailed Reporting
- Validation scores (A-F grading)
- Issue categorization (errors, warnings, info)
- Export to JSON, Markdown, or Text
- Contextual issue descriptions

### ⚙️ Customizable Rules
- Enable/disable specific validation rules
- Adjust severity levels
- Configure naming patterns
- Set performance thresholds

## Quick Start

### Installation

1. Clone repository:
```bash
git clone https://github.com/your-org/figma-postgres.git
cd figma-postgres-check
```

2. Install dependencies:
```bash
npm install
```

3. Build the shared library:
```bash
cd ../figma-postgres-shared
npm install
npm run build
```

4. Build the plugin:
```bash
cd ../figma-postgres-check
npm run build
```

### Usage

1. **Open in Figma**: Load the plugin in Figma
2. **Select Design Element**: Choose a component representing a database table
3. **Validate**: The plugin automatically validates your design
4. **Review Issues**: Check the validation results and suggested fixes
5. **Fix Issues**: Use auto-fix or manually resolve issues
6. **Export Report**: Export validation results for documentation

## Validation Rules

### Naming Conventions

#### Table Naming
- Must use `snake_case` format
- Maximum 63 characters
- Must start with a letter
- No special characters except underscore

#### Column Naming
- Must use `snake_case` format
- Maximum 63 characters
- Must start with a letter
- No special characters except underscore

#### Index Naming
- Must follow pattern: `idx_table_column`
- Must be unique within schema
- Maximum 63 characters

#### Foreign Key Naming
- Must follow pattern: `fk_table_column`
- Must be unique within schema
- Maximum 63 characters

### Performance

#### Table Structure
- Maximum 100 columns per table
- Maximum 50 foreign keys per table
- Maximum 5 columns per index
- Index foreign key columns
- Avoid excessive NULL columns

#### Data Types
- Use appropriate data types
- Avoid TEXT for short strings
- Use INTEGER instead of BIGINT when possible
- Use BOOLEAN for flags

### Security

#### Sensitive Data
- Encrypt password fields
- Protect PII (Personally Identifiable Information)
- Implement row-level security
- Add audit columns for sensitive tables

#### Access Control
- Implement proper constraints
- Use CHECK constraints for data validation
- Add NOT NULL constraints where appropriate
- Implement UNIQUE constraints for unique data

### Data Integrity

#### Primary Keys
- Every table must have a primary key
- Primary key should be auto-increment or UUID
- Primary key should be immutable

#### Foreign Keys
- Foreign keys must reference existing tables
- Foreign keys should be indexed
- Cascade rules should be defined
- Circular references should be avoided

## Validation Scoring

The validator assigns a score from 0-100 based on the severity of issues found:

| Score | Grade | Description |
|-------|-------|-------------|
| 90-100 | A | Excellent - Follows all best practices |
| 80-89 | B | Good - Minor improvements possible |
| 70-79 | C | Acceptable - Some issues need attention |
| 60-69 | D | Needs Improvement - Major issues present |
| <60 | F | Poor - Significant redesign needed |

### Scoring Algorithm

- **Errors**: -10 points each
- **Warnings**: -5 points each
- **Infos**: -1 point each

Base score starts at 100 and decreases based on issues found.

## Issue Types

### Errors
Critical issues that must be fixed:

- `NAMING_TABLE_INVALID`: Table name violates naming conventions
- `NAMING_COLUMN_INVALID`: Column name violates naming conventions
- `PERFORMANCE_TOO_MANY_COLUMNS`: Table has too many columns
- `SECURITY_MISSING_ENCRYPTION`: Sensitive data not encrypted
- `INTEGRITY_MISSING_PRIMARY_KEY`: Table missing primary key

### Warnings
Issues that should be addressed:

- `PERFORMANCE_MISSING_INDEX`: Missing index on foreign key
- `PERFORMANCE_INEFFICIENT_TYPE`: Inefficient data type usage
- `NAMING_INCONSISTENT`: Inconsistent naming pattern
- `SECURITY_WEAK_PASSWORD`: Weak password policy

### Info
Suggestions for improvement:

- `PERFORMANCE_INDEX_SUGGESTION`: Suggested index for query optimization
- `NAMING_BETTER_NAME`: Suggested better naming
- `SECURITY_AUDIT_SUGGESTION`: Suggested audit column

## Auto-fix Features

The validator can automatically fix certain issues:

### Naming Fixes
- Convert camelCase to snake_case
- Remove special characters
- Fix capitalization
- Shorten overly long names

### Structure Fixes
- Add missing primary keys
- Add missing indexes
- Fix foreign key references

### Security Fixes
- Add encryption annotations
- Add audit columns
- Add constraint annotations

## Configuration

### Validation Config

```typescript
{
  validation: {
    enabledRules: ['*'],
    severityOverrides: {},
    namingConventions: {
      tables: { pattern: /^[a-z][a-z0-9_]*$/, maxLength: 63 },
      columns: { pattern: /^[a-z][a-z0-9_]*$/, maxLength: 63 },
      indexes: { pattern: /^idx_[a-z][a-z0-9_]*$/, maxLength: 63 },
      foreignKeys: { pattern: /^fk_[a-z][a-z0-9_]*$/, maxLength: 63 }
    },
    performanceThresholds: {
      maxColumnsPerTable: 100,
      maxForeignKeysPerTable: 50,
      maxColumnsPerIndex: 5
    },
    securityRules: {
      encryptSensitiveData: true,
      requireAuditColumns: true,
      checkForPII: true
    }
  }
}
```

### Rule Configuration

```typescript
{
  validation: {
    enabledRules: [
      'NAMING_TABLE_INVALID',
      'NAMING_COLUMN_INVALID',
      'PERFORMANCE_TOO_MANY_COLUMNS',
      'SECURITY_MISSING_ENCRYPTION'
    ],
    severityOverrides: {
      'PERFORMANCE_MISSING_INDEX': 'warning',
      'NAMING_INCONSISTENT': 'info'
    }
  }
}
```

## Integration with Other Plugins

### PostgreSQL Design Visualizer
- Access parsed schemas
- Share validation results
- Highlight issues in visualization

### PostgreSQL Code Generator
- Validate before code generation
- Ensure generated code follows best practices
- Pass validation results to code generator

### PostgreSQL Data Manager
- Import existing schemas for validation
- Export validation reports
- Track schema versions

## Export Formats

### JSON
```json
{
  "score": 85,
  "summary": {
    "errors": 1,
    "warnings": 3,
    "infos": 2
  },
  "issues": [
    {
      "id": "issue-1",
      "code": "NAMING_TABLE_INVALID",
      "severity": "error",
      "message": "Table name violates naming conventions",
      "description": "Table names must use snake_case format",
      "context": {
        "tableName": "UserProfile"
      },
      "autoFix": true
    }
  ]
}
```

### Markdown
```markdown
# PostgreSQL Schema Validation Report

**Score:** 85/100
**Date:** 2025-01-30T00:00:00.000Z

## Summary
- Errors: 1
- Warnings: 3
- Infos: 2

## Issues

### Errors

#### NAMING_TABLE_INVALID
**Message:** Table name violates naming conventions

**Description:** Table names must use snake_case format

**Context:** {"tableName":"UserProfile"}

**Auto-fix:** Available
```

## Best Practices

### Design Phase
1. Plan your schema before creating designs
2. Follow naming conventions from the start
3. Consider performance implications
4. Design for security from the beginning

### Validation Phase
1. Validate frequently during design
2. Address errors immediately
3. Review warnings carefully
4. Consider info suggestions

### Fix Phase
1. Use auto-fix when available
2. Review auto-fix changes
3. Test fixes in development
4. Document manual fixes

## Troubleshooting

### Common Issues

**Validation not running**
- Ensure you've selected a design element
- Check that design follows conventions
- Reload the plugin

**Auto-fix not working**
- Check if issue supports auto-fix
- Verify plugin has write permissions
- Review plugin console for errors

**Score not updating**
- Refresh validation
- Clear plugin cache
- Restart Figma

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Add new validation rules
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [https://github.com/your-org/figma-postgres/issues](https://github.com/your-org/figma-postgres/issues)
- Email: <admin@0379.email>

## Changelog

### Version 1.0.0
- Initial release
- Comprehensive validation rules
- Auto-fix capabilities
- Real-time validation
- Export functionality
- Plugin integration

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
