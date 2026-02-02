figma.showUI(__html__, { width: 400, height: 500 });

// 模拟数据
const mockData = {
  names: [
    'Alex Johnson', 'Sarah Williams', 'Michael Brown', 'Emily Davis', 'David Miller',
    'Lisa Wilson', 'James Moore', 'Jennifer Taylor', 'Robert Anderson', 'Patricia Thomas'
  ],
  emails: [
    'alex.johnson@example.com', 'sarah.williams@example.com', 'michael.brown@example.com',
    'emily.davis@example.com', 'david.miller@example.com', 'lisa.wilson@example.com',
    'james.moore@example.com', 'jennifer.taylor@example.com', 'robert.anderson@example.com',
    'patricia.thomas@example.com'
  ],
  addresses: [
    '123 Main St, New York, NY 10001',
    '456 Oak Ave, Los Angeles, CA 90001',
    '789 Pine Rd, Chicago, IL 60601',
    '321 Maple Dr, Houston, TX 77001',
    '654 Cedar Ln, Miami, FL 33101'
  ],
  phoneNumbers: [
    '555-1234', '555-5678', '555-9012', '555-3456', '555-7890'
  ],
  jobTitles: [
    'Product Manager', 'Software Engineer', 'UX Designer', 'Marketing Director', 'Data Analyst'
  ],
  companies: [
    'Tech Innovations Inc.', 'Global Solutions Ltd.', 'Digital Media Group',
    'Enterprise Systems Co.', 'Creative Design Studio'
  ],
  loremIpsum: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
};

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'close':
      figma.closePlugin();
      break;
    
    case 'fill-text':
      await fillTextLayers(msg.data.type);
      break;
    
    case 'fill-images':
      await fillImageLayers();
      break;
    
    case 'generate-avatar':
      await generateAvatar();
      break;
    
    case 'get-data-preview':
      sendDataPreview();
      break;
  }
};

async function fillTextLayers(dataType) {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.notify('Please select some text layers first');
    return;
  }
  
  let filledCount = 0;
  
  for (const node of selection) {
    if (node.type === 'TEXT') {
      await figma.loadFontAsync(node.fontName);
      node.characters = getRandomData(dataType);
      filledCount++;
    }
  }
  
  figma.notify(`Filled ${filledCount} text layers with ${dataType}`);
  figma.ui.postMessage({ type: 'fill-complete', data: { count: filledCount } });
}

async function fillImageLayers() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.notify('Please select some frame layers first');
    return;
  }
  
  let filledCount = 0;
  
  for (const node of selection) {
    if (node.type === 'FRAME') {
      // 创建占位图像
      const rect = figma.createRectangle();
      rect.x = 0;
      rect.y = 0;
      rect.width = node.width;
      rect.height = node.height;
      rect.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      
      // 添加文本标签
      const text = figma.createText();
      text.x = 10;
      text.y = 10;
      text.fontSize = 12;
      text.characters = 'Sample Image';
      
      await figma.loadFontAsync({ family: 'SF Pro Text', style: 'Regular' });
      text.fontName = { family: 'SF Pro Text', style: 'Regular' };
      
      // 创建组并添加到框架
      const group = figma.createGroup();
      group.appendChild(rect);
      group.appendChild(text);
      
      node.appendChild(group);
      filledCount++;
    }
  }
  
  figma.notify(`Added placeholder images to ${filledCount} frames`);
  figma.ui.postMessage({ type: 'fill-complete', data: { count: filledCount } });
}

async function generateAvatar() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.notify('Please select some frame layers first');
    return;
  }
  
  let generatedCount = 0;
  
  for (const node of selection) {
    if (node.type === 'FRAME') {
      // 创建圆形头像
      const ellipse = figma.createEllipse();
      ellipse.x = 0;
      ellipse.y = 0;
      ellipse.width = node.width;
      ellipse.height = node.height;
      
      // 随机颜色
      const randomColor = {
        r: Math.random() * 0.8 + 0.2,
        g: Math.random() * 0.8 + 0.2,
        b: Math.random() * 0.8 + 0.2
      };
      
      ellipse.fills = [{ type: 'SOLID', color: randomColor }];
      
      // 添加首字母文本
      const text = figma.createText();
      text.x = node.width / 2;
      text.y = node.height / 2;
      text.fontSize = node.width * 0.4;
      text.characters = getRandomInitials();
      text.textAlignHorizontal = 'CENTER';
      text.textAlignVertical = 'CENTER';
      
      await figma.loadFontAsync({ family: 'SF Pro Text', style: 'Bold' });
      text.fontName = { family: 'SF Pro Text', style: 'Bold' };
      text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      
      // 添加到框架
      node.appendChild(ellipse);
      node.appendChild(text);
      generatedCount++;
    }
  }
  
  figma.notify(`Generated ${generatedCount} avatars`);
  figma.ui.postMessage({ type: 'avatar-generated', data: { count: generatedCount } });
}

function getRandomData(dataType) {
  switch (dataType) {
    case 'names':
      return mockData.names[Math.floor(Math.random() * mockData.names.length)];
    case 'emails':
      return mockData.emails[Math.floor(Math.random() * mockData.emails.length)];
    case 'addresses':
      return mockData.addresses[Math.floor(Math.random() * mockData.addresses.length)];
    case 'phoneNumbers':
      return mockData.phoneNumbers[Math.floor(Math.random() * mockData.phoneNumbers.length)];
    case 'jobTitles':
      return mockData.jobTitles[Math.floor(Math.random() * mockData.jobTitles.length)];
    case 'companies':
      return mockData.companies[Math.floor(Math.random() * mockData.companies.length)];
    case 'loremIpsum':
      return mockData.loremIpsum;
    default:
      return 'Sample data';
  }
}

function getRandomInitials() {
  const name = mockData.names[Math.floor(Math.random() * mockData.names.length)];
  const parts = name.split(' ');
  return parts.map(part => part[0]).join('').toUpperCase();
}

function sendDataPreview() {
  figma.ui.postMessage({
    type: 'data-preview',
    data: {
      names: mockData.names.slice(0, 3),
      emails: mockData.emails.slice(0, 3),
      addresses: mockData.addresses.slice(0, 2)
    }
  });
}

// 监听选择变化
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  const textLayers = selection.filter(node => node.type === 'TEXT').length;
  const frameLayers = selection.filter(node => node.type === 'FRAME').length;
  
  figma.ui.postMessage({
    type: 'selection-changed',
    data: {
      total: selection.length,
      textLayers,
      frameLayers
    }
  });
});