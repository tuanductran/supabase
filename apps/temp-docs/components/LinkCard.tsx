import Link from 'next/link'
import { ReactElement } from 'react'

export default function LinkCard({
  title,
  description,
  icon,
  link,
  iconComponent,
  children,
  iconStyle = 'circle',
  badge,
}: {
  title: string
  description: string
  icon?: string
  link: string
  iconComponent?: React.Component
  children: React.ReactNode
  iconStyle?: 'square' | 'circle'
  badge?: string
}) {
  const iconClasses = `
              dark:highlight-white/5 dark:bg-scale-400 ring-scale-300 flex h-14 w-14 flex-none items-center justify-center overflow-hidden bg-white shadow-md ring-1
              ${iconStyle === 'circle' ? 'rounded-full' : 'rounded'}
              `

  return (
    <Link href={link || '#'} passHref>
      <a
        className="
        group 
        relative 
        flex flex-row
        items-start justify-start gap-4 
        hover:cursor-pointer"
      >
        {iconComponent ? (
          iconComponent
        ) : icon ? (
          <figure className={iconClasses}>
            <img className="h-6 w-6" src={icon} />
          </figure>
        ) : null}
        <div className="flex flex-col items-baseline gap-1">
          <span className="text-scale-1200 mb-0 block text-base">{title}</span>
          {badge && (
            <div className="block">
              <div className={'bg-scale-400 text-scale-1100 py0.5 rounded px-2 text-xs'}>
                {badge}
              </div>
            </div>
          )}
          <span className="text-scale-900 block text-xs">{description}</span>
          {children}
        </div>
        <div className="bg-scale-400 absolute -inset-3 -z-10 rounded opacity-0 transition-opacity group-hover:opacity-60"></div>
      </a>
    </Link>
  )
}
