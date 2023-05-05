import React, { PropsWithChildren, useEffect, useRef } from 'react'

const ShinyBox = ({ children }: PropsWithChildren<{}>) => {
  const outerRef = useRef(null)
  const innerRef = useRef(null)

  const handleGlow = (event: any) => {
    if (!outerRef.current || !innerRef.current) return null
    const element = outerRef.current as HTMLDivElement
    const innerElement = innerRef.current as HTMLDivElement
    let x: any
    let y: any

    const { x: elX, y: elY, width, height } = element.getBoundingClientRect()
    x = event.clientX - elX
    y = event.clientY - elY
    const isActive = x > -15 && x < width + 15 && y > -15 && y < height + 15
    const activeGlow = isActive
      ? `radial-gradient(10rem circle at ${x}px ${y}px, var(--colors-brand8), transparent), `
      : ''
    element.style.backgroundImage = `
      ${activeGlow}radial-gradient(20rem circle at ${x}px ${y}px, var(--colors-scale8), var(--colors-scale2))`

    innerElement.style.backgroundImage = isActive
      ? `radial-gradient(7rem circle at ${x}px ${y}px, var(--colors-scale5), transparent), radial-gradient(20rem circle at ${x}px ${y}px, var(--colors-scale4), transparent)`
      : ''
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.addEventListener('mousemove', handleGlow)
    return () => {
      window.removeEventListener('mousemove', handleGlow)
    }
  }, [])

  return (
    <div
      ref={outerRef}
      className="relative rounded-[8px] bg-slate-400 from-slate-800 to-slate-800 p-px transition-all shadow-md"
    >
      <div className="relative rounded-[7px] bg-scale-300 overflow-hidden transition-all flex flex-col gap-8 px-8 py-8 text-slate-1100 sm:px-14 sm:py-12 lg:items-center lg:text-center">
        {children}
        <div ref={innerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  )
}

export default ShinyBox
