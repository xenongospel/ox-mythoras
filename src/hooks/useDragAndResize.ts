import { useState, useCallback, useEffect } from 'react';
import { Panel } from '../types/panel';
import { PANEL_CONFIGS } from '../config/panels';
import { snapToGrid } from '../constants/layout';

export const useDragAndResize = (
  panels: Panel[],
  setPanels: React.Dispatch<React.SetStateAction<Panel[]>>,
  getAvailableWidth: () => number,
  getAvailableHeight: () => number,
) => {
  const [draggedPanel, setDraggedPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<string | null>(null);

  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    panelId: string,
    action: "drag" | "resize",
  ) => {
    e.preventDefault();
    const panel = panels.find((p) => p.id === panelId);
    if (!panel || panel.locked) return;

    if (action === "drag") {
      setDraggedPanel(panelId);
      setDragOffset({
        x: e.clientX - panel.x,
        y: e.clientY - panel.y,
      });
    } else if (action === "resize") {
      setIsResizing(panelId);
      setDragOffset({
        x: e.clientX,
        y: e.clientY,
      });
    }
  }, [panels]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const availableWidth = getAvailableWidth();
    const availableHeight = getAvailableHeight();

    if (draggedPanel) {
      const panel = panels.find((p) => p.id === draggedPanel);
      if (!panel || panel.locked) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const clampedX = Math.max(0, Math.min(newX, availableWidth - panel.width));
      const clampedY = Math.max(0, Math.min(newY, availableHeight - panel.height));

      setPanels((prev) =>
        prev.map((p) =>
          p.id === draggedPanel
            ? { ...p, x: snapToGrid(clampedX), y: snapToGrid(clampedY) }
            : p,
        ),
      );
    } else if (isResizing) {
      const panel = panels.find((p) => p.id === isResizing);
      if (!panel || panel.locked) return;

      const config = PANEL_CONFIGS[panel.type];
      if (!config || !config.canResize) return;

      const deltaX = e.clientX - dragOffset.x;
      const deltaY = e.clientY - dragOffset.y;

      const newWidth = Math.max(config.minWidth, panel.width + deltaX);
      const newHeight = Math.max(config.minHeight, panel.height + deltaY);

      const maxWidth = Math.min(
        config.maxWidth || availableWidth,
        availableWidth - panel.x,
      );
      const maxHeight = Math.min(
        config.maxHeight || availableHeight,
        availableHeight - panel.y,
      );

      const constrainedWidth = Math.min(newWidth, maxWidth);
      const constrainedHeight = Math.min(newHeight, maxHeight);

      setPanels((prev) =>
        prev.map((p) =>
          p.id === isResizing
            ? {
                ...p,
                width: snapToGrid(constrainedWidth),
                height: snapToGrid(constrainedHeight),
              }
            : p,
        ),
      );

      setDragOffset({ x: e.clientX, y: e.clientY });
    }
  }, [draggedPanel, isResizing, dragOffset, panels, getAvailableWidth, getAvailableHeight, setPanels]);

  const handleMouseUp = useCallback(() => {
    setDraggedPanel(null);
    setIsResizing(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (draggedPanel || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggedPanel, isResizing, handleMouseMove, handleMouseUp]);

  return {
    draggedPanel,
    isResizing,
    handleMouseDown,
  };
};