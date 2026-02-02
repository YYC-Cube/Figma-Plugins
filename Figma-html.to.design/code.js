// Figma HTML to Design Plugin
// 将HTML代码转换为Figma设计的插件

let state = {
  htmlCode: '',
  parsedElements: [],
  conversionOptions: {
    includeStyles: true,
    includeImages: true,
    preserveLayout: true,
    useAutoLayout: true
  }
};

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'show-ui':
      showUI();
      break;
    case 'parse-html':
      parseHTML(msg.html);
      break;
    case 'convert-to-design':
      convertToDesign(msg.options);
      break;
    case 'update-options':
      updateOptions(msg.options);
      break;
    case 'clear-design':
      clearDesign();
      break;
    case 'close':
      figma.closePlugin();
      break;
  }
};

function showUI() {
  figma.showUI(__html__, {
    width: 500,
    height: 600,
    title: 'HTML to Design'
  });
}

function parseHTML(html) {
  state.htmlCode = html;
  
  try {
    // 简单的HTML解析实现
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    state.parsedElements = parseElement(doc.body);
    
    figma.ui.postMessage({
      type: 'parse-success',
      elements: state.parsedElements,
      elementCount: countElements(state.parsedElements)
    });
  } catch (error) {
    figma.ui.postMessage({
      type: 'parse-error',
      error: error.message
    });
  }
}

function parseElement(node) {
  const elements = [];
  
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = {
      tagName: node.nodeName.toLowerCase(),
      attributes: {},
      styles: {},
      children: []
    };
    
    // 解析属性
    const attributes = node.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      element.attributes[attr.name] = attr.value;
    }
    
    // 解析样式
    if (node instanceof Element) {
      const style = node.style;
      for (let i = 0; i < style.length; i++) {
        const prop = style[i];
        element.styles[prop] = style.getPropertyValue(prop);
      }
      
      // 解析文本内容
      if (node.textContent && node.textContent.trim()) {
        element.textContent = node.textContent.trim();
      }
    }
    
    // 解析子元素
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childElement = parseElement(childNodes[i]);
      element.children.push(...childElement);
    }
    
    elements.push(element);
  } else if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
    elements.push({
      tagName: 'text',
      attributes: {},
      styles: {},
      children: [],
      textContent: node.textContent.trim()
    });
  }
  
  return elements;
}

function countElements(elements) {
  let count = elements.length;
  elements.forEach(element => {
    count += countElements(element.children);
  });
  return count;
}

function convertToDesign(options) {
  state.conversionOptions = options;
  
  if (state.parsedElements.length === 0) {
    figma.notify('请先解析HTML代码');
    return;
  }
  
  try {
    const frame = createDesignFromElements(state.parsedElements, options);
    figma.currentPage.appendChild(frame);
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    
    figma.ui.postMessage({
      type: 'convert-success',
      elementCount: countElements(state.parsedElements)
    });
    
    figma.notify(`已成功转换 ${countElements(state.parsedElements)} 个元素`);
  } catch (error) {
    figma.ui.postMessage({
      type: 'convert-error',
      error: error.message
    });
    figma.notify('转换失败，请检查HTML代码');
  }
}

function createDesignFromElements(elements, options) {
  const frame = figma.createFrame();
  frame.name = 'HTML to Design';
  frame.resize(800, 600);
  frame.x = 100;
  frame.y = 100;
  
  if (options.useAutoLayout) {
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisAlignItems = 'MIN';
    frame.counterAxisAlignItems = 'MIN';
    frame.paddingTop = 20;
    frame.paddingBottom = 20;
    frame.paddingLeft = 20;
    frame.paddingRight = 20;
    frame.itemSpacing = 10;
  }
  
  elements.forEach((element, index) => {
    const node = createNodeFromElement(element, options);
    if (node) {
      if (options.useAutoLayout) {
        frame.appendChild(node);
      } else {
        node.x = 20;
        node.y = 20 + index * 50;
        frame.appendChild(node);
      }
    }
  });
  
  if (options.useAutoLayout) {
    frame.resizeWithoutConstraints(frame.width, frame.height);
  }
  
  return frame;
}

function createNodeFromElement(element, options) {
  switch (element.tagName) {
    case 'div':
      return createDiv(element, options);
    case 'p':
      return createText(element, options);
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return createHeading(element, options);
    case 'button':
      return createButton(element, options);
    case 'img':
      return createImage(element, options);
    case 'input':
      return createInput(element, options);
    case 'text':
      return createTextNode(element, options);
    case 'a':
      return createLink(element, options);
    case 'ul':
    case 'ol':
      return createList(element, options);
    case 'li':
      return createListItem(element, options);
    case 'form':
      return createForm(element, options);
    default:
      return createGenericElement(element, options);
  }
}

function createDiv(element, options) {
  const frame = figma.createFrame();
  frame.name = 'div';
  frame.resize(300, 100);
  
  if (options.useAutoLayout) {
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisAlignItems = 'MIN';
    frame.counterAxisAlignItems = 'MIN';
    frame.paddingTop = 10;
    frame.paddingBottom = 10;
    frame.paddingLeft = 10;
    frame.paddingRight = 10;
    frame.itemSpacing = 8;
  }
  
  if (options.includeStyles) {
    applyStyles(frame, element.styles);
  }
  
  element.children.forEach(child => {
    const childNode = createNodeFromElement(child, options);
    if (childNode) {
      frame.appendChild(childNode);
    }
  });
  
  if (options.useAutoLayout) {
    frame.resizeWithoutConstraints(frame.width, frame.height);
  }
  
  return frame;
}

function createText(element, options) {
  const text = figma.createText();
  text.name = 'text';
  text.characters = element.textContent || 'Sample text';
  text.resize(300, 40);
  
  if (options.includeStyles) {
    applyTextStyles(text, element.styles);
  }
  
  return text;
}

function createTextNode(element, options) {
  const text = figma.createText();
  text.name = 'text';
  text.characters = element.textContent || '';
  text.resize(300, 40);
  
  if (options.includeStyles) {
    applyTextStyles(text, element.styles);
  }
  
  return text;
}

function createHeading(element, options) {
  const text = figma.createText();
  text.name = element.tagName;
  text.characters = element.textContent || `Sample ${element.tagName.toUpperCase()}`;
  text.resize(300, 50);
  
  // 设置标题样式
  switch (element.tagName) {
    case 'h1':
      text.fontSize = 24;
      text.fontWeight = 700;
      break;
    case 'h2':
      text.fontSize = 20;
      text.fontWeight = 600;
      break;
    case 'h3':
      text.fontSize = 18;
      text.fontWeight = 600;
      break;
    default:
      text.fontSize = 16;
      text.fontWeight = 500;
      break;
  }
  
  if (options.includeStyles) {
    applyTextStyles(text, element.styles);
  }
  
  return text;
}

function createButton(element, options) {
  const frame = figma.createFrame();
  frame.name = 'button';
  frame.resize(120, 40);
  frame.cornerRadius = 4;
  
  const rectangle = figma.createRectangle();
  rectangle.resize(120, 40);
  rectangle.cornerRadius = 4;
  rectangle.fills = [{ type: 'SOLID', color: { r: 0, g: 0.5, b: 1, a: 1 } }];
  frame.appendChild(rectangle);
  
  const text = figma.createText();
  text.name = 'button-text';
  text.characters = element.textContent || 'Button';
  text.resize(100, 20);
  text.x = 10;
  text.y = 10;
  text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }];
  frame.appendChild(text);
  
  if (options.includeStyles) {
    applyStyles(frame, element.styles);
  }
  
  return frame;
}

function createImage(element, options) {
  const rectangle = figma.createRectangle();
  rectangle.name = 'image';
  rectangle.resize(200, 150);
  rectangle.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9, a: 1 } }];
  
  const text = figma.createText();
  text.name = 'image-placeholder';
  text.characters = 'Image Placeholder';
  text.resize(180, 20);
  text.x = 10;
  text.y = 65;
  text.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6, a: 1 } }];
  
  const frame = figma.createFrame();
  frame.name = 'image-container';
  frame.resize(200, 150);
  frame.appendChild(rectangle);
  frame.appendChild(text);
  
  if (options.includeStyles) {
    applyStyles(frame, element.styles);
  }
  
  return frame;
}

function createInput(element, options) {
  const rectangle = figma.createRectangle();
  rectangle.name = 'input';
  rectangle.resize(300, 40);
  rectangle.cornerRadius = 4;
  rectangle.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } }];
  rectangle.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7, a: 1 } }];
  
  const text = figma.createText();
  text.name = 'input-placeholder';
  text.characters = element.attributes.placeholder || 'Input placeholder';
  text.resize(280, 20);
  text.x = 10;
  text.y = 10;
  text.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7, a: 1 } }];
  
  const frame = figma.createFrame();
  frame.name = 'input-container';
  frame.resize(300, 40);
  frame.appendChild(rectangle);
  frame.appendChild(text);
  
  if (options.includeStyles) {
    applyStyles(frame, element.styles);
  }
  
  return frame;
}

function createLink(element, options) {
  const text = figma.createText();
  text.name = 'link';
  text.characters = element.textContent || 'Link text';
  text.resize(200, 20);
  text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 1, a: 1 } }];
  
  if (options.includeStyles) {
    applyTextStyles(text, element.styles);
  }
  
  return text;
}

function createList(element, options) {
  const frame = figma.createFrame();
  frame.name = element.tagName;
  frame.resize(300, 200);
  
  if (options.useAutoLayout) {
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisAlignItems = 'MIN';
    frame.counterAxisAlignItems = 'MIN';
    frame.itemSpacing = 8;
  }
  
  element.children.forEach((child, index) => {
    const listItem = createNodeFromElement(child, options);
    if (listItem) {
      if (options.useAutoLayout) {
        frame.appendChild(listItem);
      } else {
        listItem.y = index * 30;
        frame.appendChild(listItem);
      }
    }
  });
  
  if (options.useAutoLayout) {
    frame.resizeWithoutConstraints(frame.width, frame.height);
  }
  
  return frame;
}

function createListItem(element, options) {
  const frame = figma.createFrame();
  frame.name = 'li';
  frame.resize(300, 30);
  
  if (options.useAutoLayout) {
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisAlignItems = 'CENTER';
    frame.counterAxisAlignItems = 'CENTER';
    frame.itemSpacing = 8;
  }
  
  const bullet = figma.createEllipse();
  bullet.resize(8, 8);
  bullet.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } }];
  frame.appendChild(bullet);
  
  const text = figma.createText();
  text.name = 'list-item-text';
  text.characters = element.textContent || 'List item';
  text.resize(280, 20);
  frame.appendChild(text);
  
  if (options.useAutoLayout) {
    frame.resizeWithoutConstraints(frame.width, frame.height);
  }
  
  return frame;
}

function createForm(element, options) {
  const frame = figma.createFrame();
  frame.name = 'form';
  frame.resize(400, 300);
  
  if (options.useAutoLayout) {
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisAlignItems = 'MIN';
    frame.counterAxisAlignItems = 'MIN';
    frame.paddingTop = 20;
    frame.paddingBottom = 20;
    frame.paddingLeft = 20;
    frame.paddingRight = 20;
    frame.itemSpacing = 16;
  }
  
  element.children.forEach(child => {
    const childNode = createNodeFromElement(child, options);
    if (childNode) {
      frame.appendChild(childNode);
    }
  });
  
  if (options.useAutoLayout) {
    frame.resizeWithoutConstraints(frame.width, frame.height);
  }
  
  return frame;
}

function createGenericElement(element, options) {
  const frame = figma.createFrame();
  frame.name = element.tagName;
  frame.resize(200, 100);
  
  const text = figma.createText();
  text.name = 'element-tag';
  text.characters = `<${element.tagName}>`;
  text.resize(180, 20);
  text.x = 10;
  text.y = 40;
  text.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6, a: 1 } }];
  frame.appendChild(text);
  
  if (options.includeStyles) {
    applyStyles(frame, element.styles);
  }
  
  return frame;
}

function applyStyles(node, styles) {
  if ('fills' in node) {
    // 应用背景色
    if (styles.backgroundColor) {
      const color = parseColor(styles.backgroundColor);
      if (color) {
        node.fills = [{ type: 'SOLID', color }];
      }
    }
  }
  
  if ('width' in node && styles.width) {
    node.resize(parseInt(styles.width) || node.width, node.height);
  }
  
  if ('height' in node && styles.height) {
    node.resize(node.width, parseInt(styles.height) || node.height);
  }
}

function applyTextStyles(textNode, styles) {
  if (styles.color) {
    const color = parseColor(styles.color);
    if (color) {
      textNode.fills = [{ type: 'SOLID', color }];
    }
  }
  
  if (styles.fontSize) {
    textNode.fontSize = parseInt(styles.fontSize) || 14;
  }
  
  if (styles.fontWeight) {
    textNode.fontWeight = parseInt(styles.fontWeight) || 400;
  }
  
  if (styles.fontFamily) {
    // 尝试设置字体
    try {
      figma.loadFontAsync({
        family: styles.fontFamily.split(',')[0].trim(),
        style: 'Regular'
      }).then(() => {
        textNode.fontName = {
          family: styles.fontFamily.split(',')[0].trim(),
          style: 'Regular'
        };
      }).catch(() => {
        // 字体加载失败，使用默认字体
      });
    } catch (error) {
      // 忽略字体错误
    }
  }
}

function parseColor(colorString) {
  // 简单的颜色解析实现
  if (colorString.startsWith('#')) {
    // 处理十六进制颜色
    const hex = colorString.slice(1);
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255,
        a: 1
      };
    }
  } else if (colorString.startsWith('rgb')) {
    // 处理RGB颜色
    const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)/);
    if (match) {
      return {
        r: parseInt(match[1]) / 255,
        g: parseInt(match[2]) / 255,
        b: parseInt(match[3]) / 255,
        a: parseFloat(match[4] || '1')
      };
    }
  }
  return null;
}

function updateOptions(options) {
  state.conversionOptions = options;
}

function clearDesign() {
  const frames = figma.currentPage.findAll(node => node.name === 'HTML to Design');
  frames.forEach(frame => frame.remove());
  figma.notify('已清除转换的设计');
}

showUI();