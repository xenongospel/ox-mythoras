import { create } from 'zustand'

interface SimulationState {
  isSimulating: boolean
  start: () => void
  stop: () => void
}

export const useSimulationStore = create<SimulationState>(set => ({
  isSimulating: false,
  start: () => set({ isSimulating: true }),
  stop: () => set({ isSimulating: false }),
}))

export default useSimulationStore
