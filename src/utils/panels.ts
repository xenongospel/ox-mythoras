import type { Panel } from '../types/panel'

/**
 * Normalizes panels to always be an array.
 * Prevents runtime errors when panels is undefined, null, or not an array.
 *
 * @param panels - The panels value (may be undefined, null, or not an array)
 * @returns A guaranteed array of panels (empty array if input is invalid)
 */
export function normalizePanels(panels: unknown): Panel[] {
  if (!panels) {
    return []
  }
  
  if (!Array.isArray(panels)) {
    console.warn('[normalizePanels] Expected panels to be an array, got:', typeof panels, panels)
    return []
  }
  
  return panels
}

