import { create } from 'zustand'

import type { Panel } from '../types/panel'

interface PanelStore {
  panels: Panel[]
  setPanels: (panels: Panel[]) => void
  addPanel: (panel: Panel) => void
  removePanel: (id: string) => void
  togglePanelLock: (id: string) => void
  resetLayout: (panels: Panel[]) => void
}

export const usePanelStore = create<PanelStore>(set => ({
  panels: [],
  setPanels: panels => set({ panels }),
  addPanel: panel => set(s => ({ panels: [...s.panels, panel] })),
  removePanel: id => set(s => ({ panels: s.panels.filter(p => p.id !== id) })),
  togglePanelLock: id =>
    set(s => ({
      panels: s.panels.map(p =>
        p.id === id ? { ...p, locked: !p.locked } : p
      ),
    })),
  resetLayout: panels => set({ panels }),
}))

export default usePanelStore
