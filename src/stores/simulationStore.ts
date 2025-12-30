import { create } from 'zustand'

interface SimulationState {
  isSimulating: boolean
  start: () => void
  stop: () => void
  fps: number
  playTime: number
  position: { x: number; z: number }
  setFPS: (fps: number) => void
  addPlayTime: (delta: number) => void
  setPosition: (x: number, z: number) => void
}

export const useSimulationStore = create<SimulationState>(set => ({
  isSimulating: false,
  start: () => set({ isSimulating: true }),
  stop: () => set({ isSimulating: false }),
  fps: 60,
  playTime: 0,
  position: { x: 0, z: 0 },
  setFPS: fps => set({ fps }),
  addPlayTime: delta => set(s => ({ playTime: s.playTime + delta })),
  setPosition: (x, z) => set({ position: { x, z } }),
}))

export default useSimulationStore
