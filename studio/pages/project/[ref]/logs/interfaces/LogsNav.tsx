import { Tabs } from '@supabase/ui'
import { useRouter } from 'next/router'

const LogsNav = () => {
  const router = useRouter()
  const activeRoute = router.pathname.split('/')[3]
  const { ref } = router.query
  console.log('activeRoute', activeRoute)

  return (
    <Tabs
      defaultActiveId="1"
      type="underlined"
      size="medium"
      activeId={!activeRoute ? 'query' : activeRoute}
      onChange={(e: string) => router.push(`/project/${ref}/logs/${e === 'query' ? 'api' : e}`)}
    >
      <Tabs.Panel id="query" label="Query" />
      <Tabs.Panel id="recent" label="Recent" />
      <Tabs.Panel id="savedQueries" label="Saved queries" />
      <Tabs.Panel id="templates" label="templates" />
    </Tabs>
  )
}

export default LogsNav
