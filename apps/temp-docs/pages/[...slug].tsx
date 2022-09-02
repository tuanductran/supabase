import { getAllDocs, getDocsBySlug } from '../lib/docs'
import Layout from '../components/layouts/DocsLayout'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { MDXProvider } from '@mdx-js/react'
import components from '../components/index'
import menuItems from '../components/nav/menu-items.json'
import { useRouter } from 'next/router'

// table of contents extractor
const toc = require('markdown-toc')

export default function Doc({
  meta,
  content,
  toc,
}: {
  meta: {
    title: string
    description: string
    parent: { parent: { label: string; href: string } }
    hideToc: boolean
  }
  content: ReactElement
  toc: any
}) {
  const { asPath } = useRouter()
  let page
  switch (asPath) {
    // Docs
    case '/guides':
    case '/guides/local-development':
    case /\/guides\/[a-zA-Z]*\/[a-zA-Z\-]*/.test(asPath) && asPath:
      page = 'Docs'
      break
    // API Reference Docs
    case asPath.includes('/reference/cli') && asPath:
      page = 'CLI'
      break
    case asPath.includes('/reference/javascript') && asPath:
      page = 'Javascript'
      break
    case asPath.includes('/reference/dart') && asPath:
      page = 'Dart'
      break
    case asPath.includes('/reference/postgres') && asPath:
      page = 'Postgres'
      break
    // Tutorials
    case asPath.includes('/tutorials') && asPath:
      page = 'Tutorials'
      break
    // Docs
    default:
      page = 'Docs'
      break
  }

  if (meta.hideToc) {
    toc = null
  }

  // console.log('content of slug', content)

  return (
    <Layout meta={meta} toc={toc} menuItems={menuItems[page]} currentPage={page} asPath={asPath}>
      <MDXProvider components={components}>
        <MDXRemote {...content} components={components} />
      </MDXProvider>
    </Layout>
  )
}

export async function getStaticProps({ params }: { params: { slug: string[] } }) {
  let slug

  if (params.slug.length > 1) {
    slug = `docs/${params.slug.join('/')}`
  } else {
    slug = `docs/${params.slug[0]}`
  }

  let doc = getDocsBySlug(slug)

  console.log('doc.content', doc.content)

  const content = await serialize(doc.content || '')

  return {
    props: {
      ...doc,
      content,
      toc: toc(doc.content, { maxdepth: 2 }),
    },
  }
}

export function getStaticPaths() {
  let docs = getAllDocs()

  return {
    paths: docs.map(() => {
      return {
        params: {
          slug: docs.map((d) => d.slug),
        },
      }
    }),
    fallback: 'blocking',
  }
}
