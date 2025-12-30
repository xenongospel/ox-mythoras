import { useEffect, useState } from 'react'

export type Breakpoint = 'xl' | 'lg' | 'md' | 'sm'

export function getBreakpoint(width: number): Breakpoint {
  if (width >= 1600) return 'xl'
  if (width >= 1280) return 'lg'
  if (width >= 1024) return 'md'
  return 'sm'
}

export default function useBreakpoint() {
  const [bp, setBp] = useState<Breakpoint>(getBreakpoint(window.innerWidth))

  useEffect(() => {
    let raf = 0
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setBp(getBreakpoint(window.innerWidth))
      })
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return bp
}



