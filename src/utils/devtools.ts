export async function openDevtoolsWindow() {
  try {
    // Use Tauri's WebviewWindow to open/show the devtools window when available.
    // Import lazily so this code still works in non-tauri environments (dev on web).
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WebviewWindow } = require('@tauri-apps/api/window')
    // Try to get existing devtools window by label
    let w = null
    try {
      // getByLabel may not exist in all versions; attempt to access it
      if (typeof WebviewWindow.getByLabel === 'function') {
        w = WebviewWindow.getByLabel('devtools')
      }
    } catch (_) {
      w = null
    }
    if (w) {
      if (typeof w.show === 'function') {
        await w.show()
      }
      if (typeof w.setFocus === 'function') {
        w.setFocus()
      }
      return
    }
    // If not found, create a new window instance
    const created = new WebviewWindow('devtools', {})
    if (created && typeof created.show === 'function') {
      await created.show()
      if (typeof created.setFocus === 'function') created.setFocus()
    }
  } catch (err) {
    // Not running inside Tauri or API unavailable; fall back to opening a route in the browser
    // eslint-disable-next-line no-console
    console.warn('openDevtoolsWindow: Tauri API not available', err)
    try {
      window.open('/devtools', '_blank')
    } catch {}
  }
}

export default openDevtoolsWindow


