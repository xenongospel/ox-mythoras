export const GRID_SIZE = 20;
export const HEADER_HEIGHT = 56;
export const SIDEBAR_WIDTH = 280;
export const MIN_PANEL_GAP = 8;

export const snapToGrid = (value: number) =>
  Math.round(value / GRID_SIZE) * GRID_SIZE;