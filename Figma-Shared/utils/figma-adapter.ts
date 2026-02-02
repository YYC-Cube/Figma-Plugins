interface FigmaStorageAdapter {
  setAsync(key: string, value: any): Promise<void>;
  getAsync(key: string): Promise<any>;
  keysAsync(): Promise<string[]>;
}

interface FigmaUIAdapter {
  postMessage(message: any): void;
  onmessage: ((message: any) => void) | null;
}

interface FigmaPageAdapter {
  selection: any[];
  name: string;
}

interface FigmaAdapter {
  clientStorage: FigmaStorageAdapter;
  ui: FigmaUIAdapter;
  currentPage: FigmaPageAdapter;
}

let figmaAdapter: FigmaAdapter | null = null;

export function setFigmaAdapter(adapter: FigmaAdapter): void {
  figmaAdapter = adapter;
}

export function getFigma(): FigmaAdapter {
  if (!figmaAdapter) {
    throw new Error('Figma adapter not set. Call setFigmaAdapter() first.');
  }
  return figmaAdapter;
}

export type { FigmaPageAdapter };
