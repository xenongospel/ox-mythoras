import React, { useEffect, useRef } from 'react';
import type { Panel } from '../types/panel';

/**
 * PanelProps
 *
 * Contract for panels in the prototype. Panels should accept these props
 * and behave predictably when props change (especially `width` / `height`).
 */
export interface PanelProps {
  id?: string;
  width: number;
  height: number;
  title?: string;
  onRequestClose?: () => void;
  onRequestLockToggle?: (locked: boolean) => void;
  initialState?: any;
  onStateChange?: (state: any) => void;
  role?: string;
  ariaLabel?: string;
}

/**
 * hydrateState
 *
 * Attempt to load persisted state for a panel from localStorage.
 * This is a convenience used by panels during mount to hydrate their internal state.
 */
export function hydrateState<T = any>(panelId: string, defaultState?: T): T | undefined {
  try {
    const raw = localStorage.getItem(`panel-state:${panelId}`);
    if (!raw) return defaultState;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('Failed to hydrate panel state', panelId, e);
    return defaultState;
  }
}

/**
 * persistState
 *
 * Convenience wrapper to persist panel state to localStorage.
 * Panels may call this when they want the shell to persist a snapshot.
 */
export function persistState(panelId: string, state: any) {
  try {
    localStorage.setItem(`panel-state:${panelId}`, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to persist panel state', panelId, e);
  }
}

/**
 * PanelTemplate
 *
 * A lightweight wrapper component that enforces common ARIA/styling and lifecycle behavior.
 * Use this as the outer element for panels to ensure consistent behavior across the app.
 */
export const PanelTemplate: React.FC<PanelProps & { children?: React.ReactNode }> = ({
  id,
  width,
  height,
  title,
  role = 'region',
  ariaLabel,
  children,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Example: when mounted, ensure the panel is focusable for accessibility
    if (panelRef.current) {
      panelRef.current.setAttribute('tabindex', '0');
    }
    return () => {
      // cleanup if needed
    };
  }, []);

  return (
    <div
      ref={panelRef}
      role={role}
      aria-label={ariaLabel || title || 'Panel'}
      style={{
        width,
        height,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
      }}
      className="panel-content"
    >
      {children}
    </div>
  );
};

export default PanelTemplate;



