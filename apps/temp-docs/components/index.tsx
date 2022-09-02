import LinkCard from './LinkCard'
import LinkCardsWrapper from './LinkCardsWrapper'
import { Tabs } from '@supabase/ui'
import Sponsor from './Sponsor'
import SponsorsWrapper from './SponsorsWrapper'
import CodeBlock from './CodeBlock/CodeBlock'
import AuthProviders from './AuthProviders'
import { ProductIcon } from './ProductIcon'
import { NumberSection } from './ArticleHelpers/NumberSection'
import ReactMarkdown from 'react-markdown'

// to do, type this properly
const components: any = {
  ReactMarkdown,
  NumberSection,
  ProductIcon,
  LinkCard,
  LinkCardsWrapper,
  SponsorsWrapper,
  Sponsor,
  AuthProviders,
  Tabs: (props: any) => <Tabs {...props} />,
  TabsPanel: (props: any) => {
    return <Tabs.Panel {...props} />
  },
  code: (props: any) => <CodeBlock {...props} />,
}

export default components
