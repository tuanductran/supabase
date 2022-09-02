import {
  Button,
  IconCommand,
  IconGitHub,
  IconMenu,
  IconSearch,
  IconTwitter,
  Input,
} from '@supabase/ui'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { NavigationMenuDemo, NavigationMenuContainer } from '../../components/RadixNav'
import { useTheme } from '../Providers'
import ThemeToggle from '../ThemeToggle'

const NavBar = ({ currentPage }: { currentPage: string }) => {
  const [mounted, setMounted] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [isDarkMode])

  const pageLinks = [
    // { text: 'Overview', active: currentPage == 'Docs', link: '/' },
    { text: 'Docs', active: currentPage == 'Docs', link: '/docs' },
    { text: 'Tutorials', active: currentPage == 'Tutorials', link: '/tutorials' },
    {
      text: 'Reference',
      active: currentPage == 'Reference',
      link: '/reference/javascript/supabase-client',
    },
    { text: 'Discussions', active: currentPage == 'Discussions', link: '/discussions' },
  ]

  return (
    <div className="supports-backdrop-blur:bg-white/60 sticky top-0 z-40 w-full flex-none bg-white/95 backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-transparent lg:z-50 lg:border-b lg:border-slate-900/10">
      <nav className="max-w-8xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-8">
          <button className="mr-4 block stroke-2 lg:hidden">
            <IconMenu className="text-scale-1100" />
          </button>

          <Link href="/">
            <a className="flex items-center">
              <Image
                className="cursor-pointer"
                src={isDarkMode ? `/supabase-dark.svg` : `/supabase-light.svg`}
                width={200}
                height={32}
                alt="Supabase Logo"
              />
            </a>
          </Link>

          {/* <ul className="ml-8 hidden space-x-8 lg:flex">
                  <div></div>
                  {pageLinks.map((p) => (
                    <li key={`${p.text}-${p.link}`}>
                      <Link href={p.link}>
                        <a className={`text-sm ${p.active ? 'text-brand-900' : 'text-scale-1100'}`}>
                          {p.text}
                        </a>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="https://app.supabase.com">
                      <a className={`text-scale-1100 text-sm`}>Login</a>
                    </Link>
                  </li>
                </ul> */}
          <NavigationMenuDemo />
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden items-center space-x-6 md:flex">
            <Link href="https://github.com/supabase/supabase">
              <a target="_blank">
                <IconGitHub className="text-scale-1100 stroke-2" />
              </a>
            </Link>
            <Link href="https://twitter.com/supabase">
              <a target="_blank">
                <IconTwitter className="text-scale-1100 stroke-2" />
              </a>
            </Link>
            <ThemeToggle />
          </div>
          <Input
            placeholder="Search"
            icon={<IconSearch />}
            type="search"
            actions={[
              <Button disabled key="icon-command" type="default" size="tiny">
                <IconCommand size="tiny" />
              </Button>,
              <Button disabled key="icon-letter" type="default" size="tiny">
                K
              </Button>,
            ]}
          />
        </div>
      </nav>
    </div>
  )
}
export default NavBar
