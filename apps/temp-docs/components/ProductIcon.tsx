import { IconDatabase, IconKey } from '@supabase/ui'

interface Props {
  size: 'tiny' | 'large'
  variant: 'database' | 'auth'
}

const ProductIcon = ({ size = 'tiny', variant }: Props) => {
  const iconSize = {
    tiny: 14,
    large: 20,
  }

  const containerSizeClasses = {
    tiny: 'h-6 w-6',
    large: 'h-10 w-10',
  }

  const containerRadiusClasses = {
    tiny: 'rounded',
    large: 'ronded rounded-lg',
  }

  const iconVarients = {
    database: <IconDatabase strokeWidth={2} size={iconSize[size]} />,
    auth: <IconKey strokeWidth={2} size={iconSize[size]} />,
  }

  return (
    <div
      className={`
        dark:highlight-white/20
        bg-brand-900 
        border-brand-700
        flex items-center
        justify-center
        border
        text-white
        shadow
        ${containerSizeClasses[size]}
        ${containerRadiusClasses[size]}
    `}
    >
      <div className="shadow-inner">{iconVarients[variant]}</div>
    </div>
  )
}

export { ProductIcon }
