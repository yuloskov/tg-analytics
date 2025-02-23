import { useState, useEffect } from 'react'

export function useResponsiveAxisInterval(): number {
  const [interval, setInterval] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      setInterval(window.innerWidth < 768 ? 1 : 0)
    }
    
    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return interval
} 