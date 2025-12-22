import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  showHeaders: boolean
  setShowHeaders: (show: boolean) => void
  showGameViewFPS: boolean
  setShowGameViewFPS: (show: boolean) => void
  showGameViewControls: boolean
  setShowGameViewControls: (show: boolean) => void
  showGameViewMinimap: boolean
  setShowGameViewMinimap: (show: boolean) => void
}

export const useUIStore = create<UIStore>(set => ({
  sidebarOpen: true,
  setSidebarOpen: open => set({ sidebarOpen: open }),
  showHeaders: true,
  setShowHeaders: show => set({ showHeaders: show }),
  showGameViewFPS: true,
  setShowGameViewFPS: show => set({ showGameViewFPS: show }),
  showGameViewControls: true,
  setShowGameViewControls: show => set({ showGameViewControls: show }),
  showGameViewMinimap: true,
  setShowGameViewMinimap: show => set({ showGameViewMinimap: show }),
}))

export default useUIStore
