export interface Panel {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  locked: boolean;
}

export interface PanelConfig {
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  title: string;
  icon: React.ComponentType<any>;
  isMainView?: boolean;
  canResize?: boolean;
}