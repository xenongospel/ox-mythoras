import { SIMULATION } from '../constants/values'
import { Command, Snapshot } from './types'

export class SimulationEngine {
  private tick = 0
  private isRunning = false
  private queue: Command[] = []
  private processed = 0
  private state: any = {}
  private intervalHandle: any = null

  constructor(initialState: any = {}) {
    this.state = initialState
  }

  start(tickMs = SIMULATION.TICK_MS) {
    if (this.isRunning) return
    this.isRunning = true
    this.intervalHandle = setInterval(() => this.step(tickMs), tickMs)
  }

  stop() {
    if (!this.isRunning) return
    this.isRunning = false
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle)
      this.intervalHandle = null
    }
  }

  step(deltaMs: number) {
    // Advance simulation tick and process one command for prototype simplicity
    this.tick += deltaMs
    const cmd = this.queue.shift()
    if (cmd) {
      this.applyCommand(cmd)
      this.processed++
    }
  }

  enqueueCommand(cmd: Command) {
    this.queue.push({ ...cmd, timestamp: Date.now() })
  }

  applyCommand(cmd: Command) {
    // Prototype: simple command handling; extend with real rules later
    switch (cmd.type) {
      case 'noop':
        break
      case 'setState':
        this.state = { ...this.state, ...(cmd.payload || {}) }
        break
      default:
        // Unknown commands are ignored for now
        break
    }
  }

  getSnapshot(): Snapshot {
    return {
      tick: this.tick,
      state: this.state,
      processedCommands: this.processed,
    }
  }

  applySnapshot(s: Snapshot) {
    this.tick = s.tick
    this.state = s.state
    this.processed = s.processedCommands
  }

  serialize(): string {
    return JSON.stringify(this.getSnapshot())
  }
}

export function createSimulationEngine(initialState: any = {}) {
  return new SimulationEngine(initialState)
}

export default SimulationEngine
