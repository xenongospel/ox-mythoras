import { useCallback, useEffect, useState } from 'react'

import { PANEL_CONFIGS } from '../config/panels'
import { snapToGrid } from '../constants/layout'
import { Panel } from '../types/panel'

export const useDragAndResize = (
  panels: Panel[],
  setPanels: (panels: Panel[]) => void,
  getAvailableWidth: () => number,
  getAvailableHeight: () => number
) => {
  const [draggedPanel, setDraggedPanel] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState<string | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, panelId: string, action: 'drag' | 'resize') => {
      e.preventDefault()
      const panel = panels.find(p => p.id === panelId)
      if (!panel || panel.locked) return

      if (action === 'drag') {
        setDraggedPanel(panelId)
        setDragOffset({
          x: e.clientX - panel.x,
          y: e.clientY - panel.y,
        })
      } else if (action === 'resize') {
        setIsResizing(panelId)
        setDragOffset({
          x: e.clientX,
          y: e.clientY,
        })
      }
    },
    [panels]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const availableWidth = getAvailableWidth()
      const availableHeight = getAvailableHeight()

      if (draggedPanel) {
        const panel = panels.find(p => p.id === draggedPanel)
        if (!panel || panel.locked) return

        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        const clampedX = Math.max(
          0,
          Math.min(newX, availableWidth - panel.width)
        )
        const clampedY = Math.max(
          0,
          Math.min(newY, availableHeight - panel.height)
        )

        // panels is current array from caller; compute updated array and set it.
        const updated = panels.map(p =>
          p.id === draggedPanel
            ? { ...p, x: snapToGrid(clampedX), y: snapToGrid(clampedY) }
            : p
        )
        setPanels(updated)
      } else if (isResizing) {
        const panel = panels.find(p => p.id === isResizing)
        if (!panel || panel.locked) return

        const config = PANEL_CONFIGS[panel.type]
        if (!config || !config.canResize) return

        const deltaX = e.clientX - dragOffset.x
        const deltaY = e.clientY - dragOffset.y

        const newWidthTentative = panel.width + deltaX
        const newHeightTentative = panel.height + deltaY

        // Compute available max space for this panel
        const spaceRight = Math.max(0, availableWidth - panel.x)
        const spaceBottom = Math.max(0, availableHeight - panel.y)

        const maxWidth = Math.min(config.maxWidth || availableWidth, spaceRight)
        const maxHeight = Math.min(
          config.maxHeight || availableHeight,
          spaceBottom
        )

        // If available space is smaller than minWidth/minHeight, we allow shrinking to fit
        let constrainedWidth: number
        let constrainedHeight: number
        if (maxWidth < config.minWidth) {
          constrainedWidth = Math.max(0, maxWidth)
        } else {
          constrainedWidth = Math.max(
            config.minWidth,
            Math.min(newWidthTentative, maxWidth)
          )
        }

        if (maxHeight < config.minHeight) {
          constrainedHeight = Math.max(0, maxHeight)
        } else {
          constrainedHeight = Math.max(
            config.minHeight,
            Math.min(newHeightTentative, maxHeight)
          )
        }

        // If panel would overflow available width, shift it to x=0 where possible
        const updatedResize = panels.map(p => {
          if (p.id !== isResizing) return p
          let newX = p.x
          if (newX + constrainedWidth > availableWidth) {
            newX = Math.max(0, availableWidth - constrainedWidth)
          }
          return {
            ...p,
            x: snapToGrid(newX),
            width: snapToGrid(constrainedWidth),
            height: snapToGrid(constrainedHeight),
          }
        })
        setPanels(updatedResize)

        setDragOffset({ x: e.clientX, y: e.clientY })
      }
    },
    [
      draggedPanel,
      isResizing,
      dragOffset,
      panels,
      getAvailableWidth,
      getAvailableHeight,
      setPanels,
    ]
  )

  const handleMouseUp = useCallback(() => {
    setDraggedPanel(null)
    setIsResizing(null)
    setDragOffset({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    if (draggedPanel || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggedPanel, isResizing, handleMouseMove, handleMouseUp])

  return {
    draggedPanel,
    isResizing,
    handleMouseDown,
  }
}
