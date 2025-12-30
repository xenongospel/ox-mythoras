import { useCallback, useEffect } from 'react'

import { PANEL_CONFIGS } from '../config/panels'
import {
  GRID_SIZE,
  HEADER_HEIGHT,
  MIN_PANEL_GAP,
  SIDEBAR_WIDTH,
} from '../constants/layout'
import usePanelStore from '../stores/panelStore'
import { Panel } from '../types/panel'
import { normalizePanels } from '../utils/panels'

export const usePanelManagement = (sidebarOpen: boolean) => {
  const getAvailableWidth = useCallback(() => {
    const raw = sidebarOpen
      ? window.innerWidth - SIDEBAR_WIDTH
      : window.innerWidth
    return Math.max(raw, 100)
  }, [sidebarOpen])

  const getAvailableHeight = useCallback(() => {
    const raw = window.innerHeight - HEADER_HEIGHT
    return Math.max(raw, 100)
  }, [])

  const hasCollision = useCallback(
    (
      x: number,
      y: number,
      width: number,
      height: number,
      existingPanels: Panel[],
      excludeId?: string
    ): boolean => {
      return existingPanels
        .filter(panel => panel.id !== excludeId)
        .some(panel => {
          return !(
            x >= panel.x + panel.width + MIN_PANEL_GAP ||
            x + width <= panel.x - MIN_PANEL_GAP ||
            y >= panel.y + panel.height + MIN_PANEL_GAP ||
            y + height <= panel.y - MIN_PANEL_GAP
          )
        })
    },
    []
  )

  const getSimplePosition = useCallback(
    (
      panelType: string,
      existingPanels: Panel[]
    ): { x: number; y: number; width: number; height: number } => {
      const config = PANEL_CONFIGS[panelType]
      if (!config) {
        return { x: 0, y: 0, width: 320, height: 200 }
      }

      const availableWidth = getAvailableWidth()
      const availableHeight = getAvailableHeight()

      const gameView = existingPanels.find(p => p.type === 'gameview')
      if (gameView && panelType !== 'gameview') {
        const x = gameView.x + gameView.width + MIN_PANEL_GAP
        const y = gameView.y

        if (x + config.minWidth <= availableWidth) {
          return {
            x,
            y,
            width: config.minWidth,
            height: config.minHeight,
          }
        }
      }

      for (let y = 0; y <= availableHeight - config.minHeight; y += GRID_SIZE) {
        for (let x = 0; x <= availableWidth - config.minWidth; x += GRID_SIZE) {
          if (
            !hasCollision(
              x,
              y,
              config.minWidth,
              config.minHeight,
              existingPanels
            )
          ) {
            return { x, y, width: config.minWidth, height: config.minHeight }
          }
        }
      }

      return { x: 0, y: 0, width: config.minWidth, height: config.minHeight }
    },
    [getAvailableWidth, getAvailableHeight, hasCollision]
  )

  // Panels are backed by the Zustand store
  const panels = usePanelStore(s => s.panels)
  const panelList = normalizePanels(panels)
  const setPanels = usePanelStore(s => s.setPanels)
  const addPanelStore = usePanelStore(s => s.addPanel)
  const removePanelStore = usePanelStore(s => s.removePanel)
  const togglePanelLockStore = usePanelStore(s => s.togglePanelLock)

  const addPanel = useCallback(
    (type: string) => {
      const config = PANEL_CONFIGS[type]
      if (!config) return

      const position = getSimplePosition(type, panelList)
      const newPanel: Panel = {
        id: Date.now().toString(),
        type,
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
        title: config.title,
        locked: false,
      }
      // persist to store
      addPanelStore(newPanel)
    },
    [panels, getSimplePosition]
  )

  const removePanel = useCallback(
    (id: string) => {
      removePanelStore(id)
    },
    [removePanelStore]
  )

  const togglePanelLock = useCallback(
    (id: string) => {
      togglePanelLockStore(id)
    },
    [togglePanelLockStore]
  )

  const createDefaultLayout = useCallback(() => {
    // For prototype v0.2 we intentionally start with only the primary Game View panel.
    // This keeps the initial app focused and avoids instantiating archived panels on startup.
    const availableWidth = getAvailableWidth()
    const availableHeight = getAvailableHeight()

    const panels: Panel[] = [
      {
        id: 'main-game',
        type: 'gameview',
        x: 0,
        y: 0,
        width: availableWidth,
        height: availableHeight,
        title: 'Game View',
        locked: true,
      },
    ]

    return panels
  }, [getAvailableWidth, getAvailableHeight])

  const resetLayout = useCallback(() => {
    setPanels(createDefaultLayout())
  }, [createDefaultLayout])

  // Initialize default layout on mount and handle sidebar toggles
  useEffect(() => {
    if (panelList.length === 0) {
      // Initialize with default layout on first mount
      setPanels(createDefaultLayout())
    } else {
      // Auto-reposition panels when sidebar toggles
      const availableWidth = getAvailableWidth()
      const repositioned = panelList.map(panel => {
        if (!panel.locked && panel.x + panel.width > availableWidth) {
          return {
            ...panel,
            x: Math.max(0, availableWidth - panel.width),
          }
        }
        return panel
      })
      setPanels(repositioned)
    }
  }, [
    sidebarOpen,
    getAvailableWidth,
    createDefaultLayout,
    panelList.length,
    setPanels,
  ])

  // Update main-game panel size on window resize so GameView fills the available area.
  useEffect(() => {
    let timeout: any = null
    const onResize = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        const availableWidth = getAvailableWidth()
        const availableHeight = getAvailableHeight()
        const updated = panelList.map(p => {
          if (p.type === 'gameview') {
            return { ...p, width: availableWidth, height: availableHeight }
          }
          return p
        })
        setPanels(updated)
      }, 100)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (timeout) clearTimeout(timeout)
    }
  }, [getAvailableWidth, getAvailableHeight, panelList, setPanels])

  return {
    panels,
    setPanels,
    addPanel,
    removePanel,
    togglePanelLock,
    resetLayout,
    createDefaultLayout,
    getAvailableWidth,
    getAvailableHeight,
  }
}
