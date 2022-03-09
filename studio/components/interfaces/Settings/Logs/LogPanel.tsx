import React, { FC, useEffect, useState } from 'react'
import {
  Button,
  Input,
  Dropdown,
  Typography,
  IconChevronDown,
  IconRefreshCw,
  IconX,
  Toggle,
  IconSearch,
  IconClock,
  Popover,
  IconChevronRight,
  IconSave,
  IconPlay,
  IconPlayCircle,
  IconExternalLink,
  IconCalendar,
} from '@supabase/ui'
import { LogSearchCallback, LogTemplate, genDefaultQuery } from '.'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { uuidv4 } from 'lib/helpers'
import { Mode } from './Logs.types'
interface Props {
  defaultSearchValue?: string
  defaultFromValue?: string
  templates?: any
  isLoading: boolean
  isCustomQuery: boolean
  newCount: number
  onRefresh?: () => void
  onSearch?: LogSearchCallback
  onCustomClick?: () => void
  onSelectTemplate: (template: LogTemplate) => void
  isShowingEventChart: boolean
  onToggleEventChart: () => void
  handleEditorSubmit: () => void
  editorValue: string
  setEditorValue: (x: string) => void
  setEditorId: (x: any) => void
  table: 'edge_logs' | 'postgres_logs'
  mode: Mode
}

dayjs.extend(utc)

/**
 * Logs control panel header + wrapper
 */
const LogPanel: FC<Props> = ({
  templates = [],
  isLoading,
  isCustomQuery,
  newCount,
  onRefresh,
  onSearch = () => {},
  defaultSearchValue = '',
  defaultFromValue = '',
  onCustomClick,
  onSelectTemplate,
  isShowingEventChart,
  onToggleEventChart,
  handleEditorSubmit,
  editorValue,
  setEditorValue,
  setEditorId,
  table,
  mode,
}) => {
  const [search, setSearch] = useState('')
  const [from, setFrom] = useState({ value: '', error: '' })
  const [defaultTimestamp, setDefaultTimestamp] = useState(dayjs().utc().toISOString())

  // Sync local state with provided default value
  useEffect(() => {
    if (search !== defaultSearchValue) {
      setSearch(defaultSearchValue)
    }
  }, [defaultSearchValue])

  useEffect(() => {
    if (from.value !== defaultFromValue) {
      setFrom({ value: defaultFromValue, error: '' })
    }
  }, [defaultFromValue])

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value !== '' && isNaN(Date.parse(value))) {
      setFrom({ value, error: 'Invalid ISO 8601 timestamp' })
    } else {
      setFrom({ value, error: '' })
    }
  }
  const handleFromReset = async () => {
    setFrom({ value: '', error: '' })
    const value = dayjs().utc().toISOString()
    setDefaultTimestamp(value)
    onSearch({ query: search, from: '' })
  }

  const handleSearch = () => onSearch({ query: search, from: from.value })

  const showFromReset = from.value !== ''

  const ResetButton = () => (
    <Button
      type="default"
      icon={
        <div className="relative">
          {newCount > 0 && (
            <div
              className={[
                'absolute flex items-center justify-center -top-3 right-3',
                'h-4 w-4 z-50',
              ].join(' ')}
            >
              <div className="absolute z-20">
                <Typography.Text style={{ fontSize: '0.6rem' }} className="opacity-80">
                  {newCount}
                </Typography.Text>
              </div>
              <div className="bg-green-800 rounded-full w-full h-full animate-ping opacity-60"></div>
              <div className="absolute z-60 top-0 right-0 bg-green-900 opacity-80 rounded-full w-full h-full"></div>
            </div>
          )}
          <IconRefreshCw size={10} />
        </div>
      }
      loading={isLoading}
      onClick={onRefresh}
    >
      Refresh
    </Button>
  )

  const DateRange = () => (
    <div className="flex items-center">
      <Button type="secondary" style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}>
        Last hour
      </Button>
      <Button
        type="default"
        icon={<IconCalendar />}
        style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
      >
        Custom
      </Button>
    </div>
  )

  const CustomPanelLayout = () => (
    <div
      className="
        w-full
        flex
        justify-between
        border
        border-panel-border-light dark:border-panel-border-dark rounded rounded-bl-none rounded-br-none
        bg-panel-header-light dark:bg-panel-header-dark
        py-1.5
        px-3
    "
    >
      <div className="">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Button type="default">Insert source</Button>
            <ResetButton />
          </div>
          <div className="flex">
            <DateRange />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {editorValue && (
          <Button
            iconRight={<IconPlay strokeWidth={2} size={14} />}
            type="alternative"
            onClick={() => {
              setEditorValue('')
              setEditorId(uuidv4())
            }}
          >
            Stream logs
          </Button>
        )}
        <Button
          iconRight={<IconPlay strokeWidth={2} size={14} />}
          type={editorValue ? 'primary' : 'default'}
          onClick={handleEditorSubmit}
          loading={isLoading}
        >
          Run
        </Button>
      </div>
    </div>
  )

  const SimplePanelLayout = () => (
    <div className="flex justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <form
            id="log-panel-search"
            onSubmit={(e) => {
              // prevent redirection
              e.preventDefault()
              handleSearch()
            }}
          >
            <Input
              className="w-60"
              size="tiny"
              placeholder="Search events"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              icon={<IconSearch size={14} />}
              actions={[
                search && (
                  <IconX
                    key="clear-search"
                    size={14}
                    className="cursor-pointer mx-1"
                    title="Clear search"
                    onClick={() => setSearch('')}
                  />
                ),

                <Button key="go" size="tiny" title="Go" type="default" onClick={handleSearch}>
                  <IconSearch size={12} />
                </Button>,
              ]}
            />
          </form>
          <ResetButton />
        </div>
        <div className="flex">
          <DateRange />
        </div>
      </div>
      <div>
        <Button type="secondary" icon={<IconExternalLink />}>
          Open logs
        </Button>
      </div>
    </div>
  )

  if (mode === 'custom') {
    return <CustomPanelLayout />
  } else {
    return <SimplePanelLayout />
  }
}

// return (
//   <div
//     className="
//   border
//   border-panel-border-light dark:border-panel-border-dark rounded rounded-bl-none rounded-br-none
//   bg-panel-header-light dark:bg-panel-header-dark

//   "
//   >
//     <div className="px-5 py-2 flex items-center justify-between w-full">
//       <div className="flex flex-row gap-x-4 items-center">
//         {!isCustomQuery && (
//           <form
//             id="log-panel-search"
//             onSubmit={(e) => {
//               // prevent redirection
//               e.preventDefault()
//               handleSearch()
//             }}
//           >
//             <Input
//               className="w-60"
//               size="tiny"
//               placeholder="Search events"
//               onChange={(e) => setSearch(e.target.value)}
//               value={search}
//               icon={<IconSearch size={14} />}
//               actions={[
//                 search && (
//                   <IconX
//                     key="clear-search"
//                     size={14}
//                     className="cursor-pointer mx-1"
//                     title="Clear search"
//                     onClick={() => setSearch('')}
//                   />
//                 ),

//                 <Button key="go" size="tiny" title="Go" type="default" onClick={handleSearch}>
//                   <IconSearch size={12} />
//                 </Button>,
//               ]}
//             />
//           </form>
//         )}
//         <Button
//           type="default"
//           icon={
//             <div className="relative">
//               {newCount > 0 && (
//                 <div
//                   className={[
//                     'absolute flex items-center justify-center -top-3 right-3',
//                     'h-4 w-4 z-50',
//                   ].join(' ')}
//                 >
//                   <div className="absolute z-20">
//                     <Typography.Text style={{ fontSize: '0.6rem' }} className="opacity-80">
//                       {newCount}
//                     </Typography.Text>
//                   </div>
//                   <div className="bg-green-800 rounded-full w-full h-full animate-ping opacity-60"></div>
//                   <div className="absolute z-60 top-0 right-0 bg-green-900 opacity-80 rounded-full w-full h-full"></div>
//                 </div>
//               )}
//               <IconRefreshCw />
//             </div>
//           }
//           loading={isLoading}
//           onClick={onRefresh}
//         >
//           Refresh
//         </Button>
//         {isCustomQuery && (
//           <Dropdown
//             side="bottom"
//             align="start"
//             overlay={templates.map((template: LogTemplate) => (
//               <Dropdown.Item key={template.label} onClick={() => onSelectTemplate(template)}>
//                 <Typography.Text>{template.label}</Typography.Text>
//               </Dropdown.Item>
//             ))}
//           >
//             <Button as="span" type="default" iconRight={<IconChevronDown size={14} />}>
//               Templates
//             </Button>
//           </Dropdown>
//         )}
//       </div>
//       <div className="flex items-center gap-x-6">
//         {!isCustomQuery && (
//           <>
//             <div className="flex flex-row">
//               <Popover
//                 side="bottom"
//                 align="end"
//                 portalled
//                 overlay={
//                   <Input
//                     label="From"
//                     labelOptional="UTC"
//                     value={from.value === '' ? defaultTimestamp : from.value}
//                     onChange={handleFromChange}
//                     error={from.error}
//                     className="w-72 p-3"
//                     actions={[
//                       <Button
//                         key="set"
//                         size="tiny"
//                         title="Set"
//                         type="secondary"
//                         onClick={handleSearch}
//                       >
//                         Set
//                       </Button>,
//                     ]}
//                   />
//                 }
//               >
//                 <Button
//                   as="span"
//                   size="tiny"
//                   className={showFromReset ? '!rounded-r-none' : ''}
//                   type={showFromReset ? 'outline' : 'text'}
//                   icon={<IconClock size="tiny" />}
//                 >
//                   {from.value ? 'Custom' : 'Now'}
//                 </Button>
//               </Popover>
//               {showFromReset && (
//                 <Button
//                   size="tiny"
//                   className={showFromReset ? '!rounded-l-none' : ''}
//                   icon={<IconX size="tiny" />}
//                   type="outline"
//                   title="Clear timestamp filter"
//                   onClick={handleFromReset}
//                 />
//               )}
//             </div>
//             {!isCustomQuery && (
//               <div className="flex items-center space-x-2">
//                 <p className="text-xs">Show event chart</p>
//                 <Toggle size="tiny" checked={isShowingEventChart} onChange={onToggleEventChart} />
//               </div>
//             )}
//             {/* wrap with form so that if user presses enter, the search value will submit automatically */}
//           </>
//         )}
//         <div className="flex items-center gap-x-2">
//           {/* <Button type="default" icon={<IconSave size={14} />}>
//             Save
//           </Button> */}
//           {editorValue && (
//             // <Button
//             //   type="default"
//             //   onClick={() => {
//             //     setEditorValue('')
//             //     setEditorId(uuidv4())
//             //   }}
//             // >
//             //   Clear
//             // </Button>

//             <Button
//               type="default"
//               onClick={() => {
//                 setEditorValue(genDefaultQuery(table))
//                 setEditorId(uuidv4())
//               }}
//             >
//               Clear
//             </Button>
//           )}
//         </div>
//         {isCustomQuery && (
//           <div className="flex items-center gap-x-2">
//             {editorValue && (
//               <Button
//                 iconRight={<IconPlay strokeWidth={2} size={14} />}
//                 type="alternative"
//                 onClick={() => {
//                   setEditorValue('')
//                   setEditorId(uuidv4())
//                 }}
//               >
//                 Stream logs
//               </Button>
//             )}
//             <Button
//               iconRight={<IconPlay strokeWidth={2} size={14} />}
//               type={editorValue ? 'primary' : 'default'}
//               onClick={handleEditorSubmit}
//               loading={isLoading}
//             >
//               Run
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// )

export default LogPanel
