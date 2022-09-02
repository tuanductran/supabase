import Head from 'next/head'
import Footer from '../Footer'
import NavBar from '../nav/NavBar'
import SideBar from '../nav/SideBar'

const Layout = ({
  children,
  meta,
  currentPage,
  asPath,
}: {
  meta: {
    title: string
    description: string
    parent?: { label: string; href: string }
    breadcrumbs?: boolean
    subtitle?: string
  }
  children: string
  toc: any
  menuItems: any
  currentPage: string
  asPath: string
}) => {
  const theme = 'okaidia'

  console.log('currentPage', currentPage)
  console.log('currentPage', currentPage)
  console.log('asPath', asPath)

  function breadcrumbRender() {
    const split = asPath.split('/')

    const pages = split.map((page, i) => {
      if (i === 0 || i === 1 || i === 2) return null

      const anchorClases = [
        'inline-flex items-center capitalize',
        split.length !== i + 1
          ? 'text-scale-900 hover:text-scale-1200'
          : 'text-brand-900 hover:text-brand-1200',
      ]

      return (
        <>
          <li className="inline-flex items-center">
            <a href="#" className={anchorClases.join(' ')}>
              {page}
            </a>
          </li>
          <span className="text-scale-700">{split.length !== i + 1 ? '/' : ''}</span>
        </>
      )
    })
    return (
      <nav className="flex rounded-lg" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">{pages}</ol>
      </nav>
    )
  }

  return (
    <>
      <Head>
        <title>{meta?.title} | Supabase</title>
        <meta name="description" content={meta?.description} />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta?.title} />
        <meta property="og:description" content={meta?.description} />
        <meta property="og:title" content={meta?.title} />
        {/* <link
          rel="preload"
          href="https://unpkg.com/prismjs@0.0.1/themes/prism-okaidia.css"
          as="script"
        />
        <link href={`https://unpkg.com/prismjs@0.0.1/themes/prism-${theme}.css`} rel="stylesheet" /> */}
      </Head>
      <main>
        <NavBar currentPage={currentPage} />
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <SideBar menuItems={menuItems} />
          <div className="lg:pl-[19.5rem]">
            <div
              className={`mx-auto 
              py-[var(--content-y-padding)] 
              xl:ml-0 
              ${meta.hideToc ? '' : ' max-w-3xl xl:mr-[15.5rem] '}
              xl:max-w-none xl:pr-16`}
            >
              <article className="prose max-w-none">
                <div className="not-prose mb-8 flex flex-col gap-3">
                  {meta.breadcrumbs && breadcrumbRender()}
                  {/* {meta.parent && (
                    <span className="titlecase text-brand-900">
                      Installation / {meta.parent.label}
                    </span>
                  )} */}
                  <h1 className="text-scale-1200 text-4xl tracking-tight">{meta.title}</h1>
                  <h2 className="text-scale-1200 text-xl">{meta.subtitle}</h2>
                </div>
                {children}
              </article>
              {toc && (
                <div className="fixed top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] z-20 hidden w-[19.5rem] overflow-y-auto py-10 px-8 xl:block">
                  <h5>On this page</h5>
                  <ul className="list-none pl-2 text-[0.8rem]">
                    {toc.json.map((item: any, i: number) => {
                      return (
                        <li key={i}>
                          <a href={`#${item.slug}`}>{item.content}</a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </main>
    </>
  )
}

export default Layout
