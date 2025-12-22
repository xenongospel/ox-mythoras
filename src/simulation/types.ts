export type Command = {
  id: string
  type: string
  payload?: any
  timestamp?: number
}

export type Snapshot = {
  tick: number
  state: any
  processedCommands: number
}
