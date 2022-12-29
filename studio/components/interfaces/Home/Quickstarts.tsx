import { FC, useState } from 'react'
import { useStore } from 'hooks'
import Link from 'next/link'

interface Props {
  framework: string
  title: string
  description: string
  docsUrl: string
  gitUrl: string
}

const Quickstarts: FC<Props> = ({ framework, title, description, gitUrl, docsUrl }) => {
  const { ui } = useStore()
  const { isDarkTheme } = ui

  return (
    <div
      className={[
        'group relative',
        'border bg-panel-header-light  hover:bg-panel-border-light dark:bg-panel-header-dark dark:hover:bg-panel-border-dark',
        'border-panel-border-light hover:border-panel-border-hover-light  dark:border-panel-border-dark',
        'flex h-32 flex-row rounded-md p-4 hover:border-gray-300 dark:hover:border-panel-border-hover-dark',
        'transition duration-150 ease-in-out',
      ].join(' ')}
    >
      <div className="mr-4 flex flex-col">
        <img
          className="transition-all group-hover:scale-110"
          src={`/img/libraries/${framework.toLowerCase()}${
            ['expo', 'nextjs'].includes(framework.toLowerCase()) ? (isDarkTheme ? '-dark' : '') : ''
          }-icon.svg`}
          alt={`${framework} logo`}
          width={26}
          height={26}
        />
      </div>
      <div className="w-4/5 space-y-2">
        <h5 className="text-scale-1200">{title}</h5>
        <p className="text-sm text-scale-1000">{description}</p>
        <div className="flex text-brand-900 gap-5">
          <Link passHref href={gitUrl}>
            <a target="_blank">
              <p>Github</p>
            </a>
          </Link>
          <Link passHref href={docsUrl}>
            <a target="_blank">
              <p>Docs</p>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Quickstarts
