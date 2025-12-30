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
  // Player / world state
  playerName: string
  setPlayerName: (name: string) => void
  currentLocation: string
  setCurrentLocation: (loc: string) => void
  currentAct: string
  setCurrentAct: (act: string) => void
  playerLevel: number
  setPlayerLevel: (lvl: number) => void
}

export const useUIStore = create<UIStore>(set => ({
  sidebarOpen: false,
  setSidebarOpen: open => set({ sidebarOpen: open }),
  showHeaders: true,
  setShowHeaders: show => set({ showHeaders: show }),
  showGameViewFPS: true,
  setShowGameViewFPS: show => set({ showGameViewFPS: show }),
  showGameViewControls: true,
  setShowGameViewControls: show => set({ showGameViewControls: show }),
  showGameViewMinimap: true,
  setShowGameViewMinimap: show => set({ showGameViewMinimap: show }),
  playerName: 'Player',
  setPlayerName: name => set({ playerName: name }),
  currentLocation: 'Valdris Reach',
  setCurrentLocation: loc => set({ currentLocation: loc }),
  currentAct: 'Act I',
  setCurrentAct: act => set({ currentAct: act }),
  playerLevel: 1,
  setPlayerLevel: lvl => set({ playerLevel: lvl }),
}))

export default useUIStore
