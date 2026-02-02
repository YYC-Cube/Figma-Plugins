figma.showUI(__html__, { width: 640, height: 800 });

// 模拟数据
const mockSchema = {
  name: 'Sample Database',
  version: '1.0.0',
  metadata: {
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now()
  },
  tables: [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'SERIAL', primaryKey: true },
        { name: 'name', type: 'VARCHAR(255)' },
        { name: 'email', type: 'VARCHAR(255)', unique: true },
        { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'NOW()' }
      ]
    },
    {
      name: 'posts',
      columns: [
        { name: 'id', type: 'SERIAL', primaryKey: true },
        { name: 'title', type: 'VARCHAR(255)' },
        { name: 'content', type: 'TEXT' },
        { name: 'user_id', type: 'INTEGER' },
        { name: 'created_at', type: 'TIMESTAMP', defaultValue: 'NOW()' }
      ]
    }
  ],
  relations: [
    {
      name: 'posts_user_id_fkey',
      sourceTable: 'posts',
      sourceColumn: 'user_id',
      targetTable: 'users',
      targetColumn: 'id'
    }
  ]
};

const mockVersions = [
  {
    id: 'v1',
    name: 'Initial Schema',
    description: 'First version of the database schema',
    createdAt: Date.now() - 172800000
  },
  {
    id: 'v2',
    name: 'Added Posts Table',
    description: 'Added posts table with foreign key to users',
    createdAt: Date.now() - 86400000
  }
];

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'close':
      figma.closePlugin();
      break;
    
    case 'load-schema':
      // 模拟加载schema
      figma.ui.postMessage({ type: 'schema-loaded', data: mockSchema });
      break;
    
    case 'save-schema':
      // 模拟保存schema
      const savedSchema = {
        ...mockSchema,
        name: msg.data.name,
        version: msg.data.version,
        metadata: {
          ...mockSchema.metadata,
          updatedAt: Date.now()
        }
      };
      figma.ui.postMessage({ type: 'schema-saved', data: savedSchema });
      figma.notify('Schema saved successfully!');
      break;
    
    case 'create-version':
      // 模拟创建版本
      const newVersion = {
        id: `v${mockVersions.length + 1}`,
        name: msg.name,
        description: msg.description,
        createdAt: Date.now()
      };
      mockVersions.push(newVersion);
      figma.ui.postMessage({ type: 'version-created', data: newVersion });
      figma.ui.postMessage({ type: 'versions-listed', data: mockVersions });
      figma.notify('Version created successfully!');
      break;
    
    case 'list-versions':
      // 模拟列出版本
      figma.ui.postMessage({ type: 'versions-listed', data: mockVersions });
      break;
    
    case 'load-version':
      // 模拟加载版本
      figma.ui.postMessage({ type: 'version-loaded', data: { schema: mockSchema } });
      break;
    
    case 'delete-version':
      // 模拟删除版本
      const versionIndex = mockVersions.findIndex(v => v.id === msg.versionId);
      if (versionIndex !== -1) {
        mockVersions.splice(versionIndex, 1);
        figma.ui.postMessage({ type: 'version-deleted', data: { versionId: msg.versionId } });
        figma.ui.postMessage({ type: 'versions-listed', data: mockVersions });
        figma.notify('Version deleted successfully!');
      }
      break;
    
    case 'import-schema':
      // 模拟导入schema
      figma.ui.postMessage({ type: 'schema-imported', data: mockSchema });
      figma.notify('Schema imported successfully!');
      break;
    
    case 'export-schema':
      // 模拟导出schema
      let exportContent = '';
      let filename = '';
      
      if (msg.format === 'sql') {
        exportContent = `-- Sample Database Schema v1.0.0

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;
        filename = 'schema.sql';
      } else if (msg.format === 'json') {
        exportContent = JSON.stringify(mockSchema, null, 2);
        filename = 'schema.json';
      } else if (msg.format === 'prisma') {
        exportContent = `// Sample Database Schema v1.0.0

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String?
  email     String   @unique
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  userId    Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}`;
        filename = 'schema.prisma';
      }
      
      figma.ui.postMessage({ 
        type: 'export-ready', 
        data: { 
          content: exportContent, 
          filename: filename 
        } 
      });
      figma.notify('Schema exported successfully!');
      break;
    
    case 'validate-schema':
      // 模拟验证schema
      const validationResults = {
        score: 95,
        summary: {
          errors: 0,
          warnings: 1,
          infos: 2
        },
        issues: [
          {
            severity: 'warning',
            code: 'UNUSED_INDEX',
            message: 'Unused index detected',
            description: 'Index on users.email is not being used frequently'
          },
          {
            severity: 'info',
            code: 'PERFORMANCE_SUGGESTION',
            message: 'Performance suggestion',
            description: 'Consider adding an index on posts.created_at for better query performance'
          },
          {
            severity: 'info',
            code: 'BEST_PRACTICE',
            message: 'Best practice suggestion',
            description: 'Consider adding a comment to explain the purpose of the users table'
          }
        ]
      };
      figma.ui.postMessage({ type: 'validation-complete', data: validationResults });
      figma.notify('Schema validation complete!');
      break;
    
    case 'visualize-schema':
      // 模拟可视化schema
      figma.notify('Schema visualization not implemented in this demo');
      break;
    
    case 'save-config':
      // 模拟保存配置
      figma.notify('Settings saved successfully!');
      break;
  }
};

// 监听选择变化
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  figma.ui.postMessage({
    type: 'selection-changed',
    data: {
      count: selection.length,
      hasSchema: selection.length > 0
    }
  });
});
