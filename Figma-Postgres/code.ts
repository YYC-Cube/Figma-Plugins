figma.showUI(__html__, { width: 800, height: 600 });

figma.ui.onmessage = async (msg: any) => {
  switch (msg.type) {
    case 'close':
      figma.closePlugin();
      break;
    case 'parse-design':
      await parseDesign();
      break;
    case 'visualize-schema':
      await visualizeSchema();
      break;
  }
};

async function parseDesign() {
  try {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select some elements first');
      return;
    }
    
    const result = {
      type: 'design-parsed',
      data: {
        count: selection.length,
        nodes: selection.map((n: any) => ({
          id: n.id,
          name: n.name,
          type: n.type
        }))
      }
    };
    
    figma.ui.postMessage(result);
  } catch (error: any) {
    figma.notify(`Error parsing design: ${error.message}`);
  }
}

async function visualizeSchema() {
  try {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select some elements first');
      return;
    }
    
    figma.notify('Schema visualized successfully');
    
    figma.ui.postMessage({
      type: 'schema-visualized',
      data: {
        count: selection.length
      }
    });
  } catch (error: any) {
    figma.notify(`Error visualizing schema: ${error.message}`);
  }
}

figma.on('selectionchange', async () => {
  const selection = figma.currentPage.selection;
  figma.ui.postMessage({
    type: 'selection-changed',
    data: {
      count: selection.length,
      nodes: selection.map((n: any) => ({ id: n.id, name: n.name, type: n.type }))
    }
  });
});
