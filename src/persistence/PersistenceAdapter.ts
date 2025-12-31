type PersistResult = any

export interface PersistenceAdapter {
  save(key: string, data: any): Promise<void>
  load(key: string): Promise<any | null>
}

export class LocalPersistenceAdapter implements PersistenceAdapter {
  async save(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  async load(key: string) {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
}

// Tauri adapter placeholder. Will attempt to use Tauri fs APIs when available.
export class TauriPersistenceAdapter implements PersistenceAdapter {
  private fs: any
  constructor(fsImpl?: any) {
    this.fs = fsImpl
  }
  async save(key: string, data: any) {
    if (!this.fs) throw new Error('Tauri FS not available')
    // Implementation depends on how you want to map key -> path
    await this.fs.writeFile({ path: key, contents: JSON.stringify(data) })
  }
  async load(key: string) {
    if (!this.fs) throw new Error('Tauri FS not available')
    try {
      const contents = await this.fs.readTextFile({ path: key })
      return JSON.parse(contents)
    } catch {
      return null
    }
  }
}

export function createPersistenceAdapter(): PersistenceAdapter {
  // Prefer Tauri if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tauriFs = require('@tauri-apps/api/fs')
    if (tauriFs) {
      return new TauriPersistenceAdapter(tauriFs)
    }
  } catch {
    // fallthrough to localStorage
  }

  return new LocalPersistenceAdapter()
}

export default createPersistenceAdapter




