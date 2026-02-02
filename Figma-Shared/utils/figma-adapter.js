let figmaAdapter = null;
export function setFigmaAdapter(adapter) {
    figmaAdapter = adapter;
}
export function getFigma() {
    if (!figmaAdapter) {
        throw new Error('Figma adapter not set. Call setFigmaAdapter() first.');
    }
    return figmaAdapter;
}
