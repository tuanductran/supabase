import useSWR from 'swr'
import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import {
  Typography,
  IconLoader,
  IconAlertCircle,
  IconRewind,
  Button,
  IconInfo,
  Card,
  Loading,
  Alert,
  Input,
} from '@supabase/ui'

import { withAuth } from 'hooks'
import { get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { SettingsLayout } from 'components/layouts/'
import CodeEditor from 'components/ui/CodeEditor'
import {
  LogPanel,
  LogTable,
  LogEventChart,
  Count,
  Logs,
  LogTemplate,
  TEMPLATES,
  LogData,
  LogSearchCallback,
  LOG_TYPE_LABEL_MAPPING,
  genDefaultQuery,
  genCountQuery,
} from 'components/interfaces/Settings/Logs'
import { uuidv4 } from 'lib/helpers'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'
import { isUndefined } from 'lodash'
import dayjs from 'dayjs'
import InformationBox from 'components/ui/InformationBox'

import LogsLayout from 'components/layouts/LogsLayout'

import { LogsWrapper } from './Logs.types'

/**
 * Acts as a container component for the entire log display
 *
 * ## Query Params Syncing
 * Query params are synced on query submission.
 *
 * params used are:
 * - `q` for the editor query.
 * - `s` for search query.
 * - `te` for timestamp start value.
 */
export const LogWrapper = ({ type, mode }: LogsWrapper) => {
  const router = useRouter()
  const { ref, q, s, te } = router.query
  const [editorId, setEditorId] = useState<string>(uuidv4())
  const [editorValue, setEditorValue] = useState('')
  const [showChart, setShowChart] = useState(true)

  // ! custom is SQL only logging !
  // const [mode, setMode] = useState<'simple' | 'custom'>('custom')

  const [latestRefresh, setLatestRefresh] = useState<string>(new Date().toISOString())
  const [params, setParams] = useState({
    type: type,
    search_query: '',
    sql: '',
    where: '',
    timestamp_start: '',
    timestamp_end: '',
  })
  const title = `Logs - ${LOG_TYPE_LABEL_MAPPING[type as keyof typeof LOG_TYPE_LABEL_MAPPING]}`

  const checkIfSelectQuery = (value: string) =>
    value && value.toLowerCase().includes('select') ? true : false

  const isSelectQuery = checkIfSelectQuery(editorValue)

  const table = type === 'api' ? 'edge_logs' : 'postgres_logs'

  useEffect(() => {
    setParams({ ...params, type: type })
  }, [type])

  useEffect(() => {
    // on mount, set initial values
    if (mode === 'custom') {
      onSelectTemplate({
        mode: 'custom',
        searchString: q as string,
      })
    } else if (s) {
      onSelectTemplate({
        mode: 'simple',
        searchString: s as string,
      })
    }
    if (te) {
      setParams((prev) => ({ ...prev, timestamp_end: te as string }))
    } else {
      setParams((prev) => ({ ...prev, timestamp_end: '' }))
    }
  }, [mode, type])

  // useEffect(() => {
  //   // resets the params
  //   // whenever the type or custom SQL is toggled
  //   setParams({
  //     type: type,
  //     search_query: '',
  //     sql: '',
  //     where: '',
  //     timestamp_start: '',
  //     timestamp_end: '',
  //   })

  //   getKeyLogs()
  // }, [mode, type])

  const genQueryParams = (params: { [k: string]: string }) => {
    // remove keys which are empty strings, null, or undefined
    for (const k in params) {
      const v = params[k]
      if (v === null || v === '' || isUndefined(v)) {
        delete params[k]
      }
    }
    const qs = new URLSearchParams(params).toString()
    return qs
  }

  // handle log fetching
  const getKeyLogs: SWRInfiniteKeyLoader = (_pageIndex: number, prevPageData: Logs) => {
    let queryParams
    // if prev page data is 100 items, could possibly have more records that are not yet fetched within this interval
    if (prevPageData === null) {
      // reduce interval window limit by using the timestamp of the last log
      queryParams = genQueryParams(params)
    } else if ((prevPageData.result ?? []).length === 0) {
      // no rows returned, indicates that no more data to retrieve and append.
      return null
    } else {
      const len = prevPageData.result.length
      const { timestamp: tsLimit }: LogData = prevPageData.result[len - 1]
      // create new key from params
      queryParams = genQueryParams({ ...params, timestamp_end: String(tsLimit) })
    }

    const logUrl = `${API_URL}/projects/${ref}/analytics/endpoints/logs.${type}?${queryParams}`

    // console.log('logUrl', logUrl)
    return logUrl
  }

  const {
    data = [],
    error: swrError,
    isValidating,
    mutate,
    size,
    setSize,
  } = useSWRInfinite<Logs>(getKeyLogs, get, { revalidateOnFocus: false })

  let logData: LogData[] = []
  let error: null | string | object = swrError ? swrError.message : null
  data.forEach((response) => {
    if (!error && response?.result) {
      logData = [...logData, ...response.result]
    }
    if (!error && response && response.error) {
      error = response.error
    }
  })

  const countUrl = `${API_URL}/projects/${ref}/analytics/endpoints/logs.${type}?${genQueryParams({
    ...params,
    sql: genCountQuery(table),
    period_start: String(latestRefresh),
  })}`

  const { data: countData } = useSWR<Count>(countUrl, get, { refreshInterval: 5000 })
  const newCount = countData?.result?.[0]?.count ?? 0

  const handleRefresh = () => {
    setLatestRefresh(new Date().toISOString())
    setParams({ ...params, timestamp_end: '' })
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        te: undefined,
      },
    })
    setSize(1)
  }

  // const handleModeToggle = () => {
  //   if (mode === 'simple') {
  //     setMode('custom')
  //     onSelectTemplate({
  //       mode: 'custom',
  //       searchString: genDefaultQuery(table),
  //     })
  //   } else {
  //     setMode('simple')
  //   }
  // }

  const onSelectTemplate = (template: LogTemplate) => {
    if (template.mode === 'simple') {
      setParams((prev) => ({ ...prev, search_query: template.searchString, sql: '', where: '' }))
    } else {
      setEditorValue(template.searchString)
      setParams((prev) => ({
        ...prev,
        where: checkIfSelectQuery(template.searchString)
          ? ''
          : cleanEditorValue(template.searchString),
        sql: checkIfSelectQuery(template.searchString)
          ? cleanEditorValue(template.searchString)
          : '',
        search_query: '',
        timestamp_end: '',
      }))
      setEditorId(uuidv4())
    }
  }

  const handleEditorSubmit = () => {
    setParams((prev) => ({
      ...prev,
      sql: checkIfSelectQuery(editorValue) ? editorValue : genDefaultQuery(table, editorValue),
      search_query: '',
    }))

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        q: editorValue,
        s: undefined,
        te: undefined,
      },
    })
  }

  const handleSearch: LogSearchCallback = ({ query, from, fromMicro }) => {
    const unixMicro = fromMicro ? fromMicro : dayjs(from).valueOf() * 1000

    setParams((prev) => ({
      ...prev,
      search_query: query || '',
      timestamp_end: unixMicro ? String(unixMicro) : '',
      where: '',
      sql: '',
    }))

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        q: undefined,
        s: query || '',
        te: unixMicro,
      },
    })
    setEditorValue('')
  }

  const cleanEditorValue = (value: string) => {
    if (typeof value !== 'string') return value
    return value.replace(/\n/g, ' ')
  }

  return (
    <div className="h-full flex flex-col flex-grow space-y-4">
      <div>
        <LogPanel
          isShowingEventChart={showChart}
          onToggleEventChart={() => setShowChart(!showChart)}
          isCustomQuery={mode === 'custom'}
          isLoading={isValidating}
          newCount={newCount}
          templates={TEMPLATES.filter((template) => template.for?.includes(type as string))}
          onRefresh={handleRefresh}
          onSearch={handleSearch}
          defaultSearchValue={params.search_query}
          defaultFromValue={
            params.timestamp_end ? dayjs(Number(params.timestamp_end) / 1000).toISOString() : ''
          }
          // onCustomClick={handleModeToggle}
          onSelectTemplate={onSelectTemplate}
          handleEditorSubmit={handleEditorSubmit}
          editorValue={editorValue}
          setEditorValue={setEditorValue}
          setEditorId={setEditorId}
          table={table}
          mode={mode}
        />
        {mode === 'custom' && (
          <>
            <div
              className="
                min-h-[7rem] h-40
                border-l border-b border-r
                border-panel-border-light dark:border-panel-border-dark
                rounded-b overflow-hidden
            "
            >
              <CodeEditor
                id={editorId}
                language="pgsql"
                defaultValue={editorValue}
                onInputChange={(v) => setEditorValue(v || '')}
                onInputRun={handleRefresh}
              />
            </div>
            {/* <div className="flex flex-row justify-end items-center px-2 py-1 w-full"> */}
            {/* </div> */}
          </>
        )}
      </div>

      {isSelectQuery && (
        <Alert
          variant="warning"
          withIcon
          title={`Custom queries are restricted to a ${
            type === 'database' ? '2 hour' : '7 day'
          } querying window.`}
        >
          <div className="flex flex-col gap-3">
            <span>You will need to upgrade this project if you wush to extend the restriction</span>
            <div>
              <Button type="default">Upgrade project</Button>
            </div>
          </div>
        </Alert>
      )}

      {/* {showChart && mode === 'custom' && (
        <div>
          <LogEventChart
            data={!isValidating ? logData : undefined}
            onBarClick={(timestampMicro) => {
              handleSearch({ query: params.search_query, fromMicro: timestampMicro })
            }}
          />
        </div>
      )} */}

      <div className={'flex flex-col flex-grow relative'}>
        {isValidating && (
          <div
            className={[
              'absolute w-full flex justify-center top-16',
              'z-50',
              'flex items-center gap-2',
            ].join(' ')}
          >
            <IconLoader className="animate-spin" />
            <span>Fetching logs...</span>
          </div>
        )}

        <div className={'flex flex-col flex-grow h-full ' + (isValidating ? 'opacity-30' : '')}>
          <LogTable data={logData} isCustomQuery={mode === 'custom'} queryType={type} />
          {/* Footer section of log ui, appears below table */}
          <div className="p-2">
            {!isSelectQuery && (
              <Button onClick={() => setSize(size + 1)} icon={<IconRewind />} type="default">
                Load older
              </Button>
            )}
          </div>

          {error && (
            <div className="flex w-full h-full justify-center items-center mx-auto">
              <Card className="flex flex-col gap-y-2 w-2/5 bg-scale-400">
                <div className="flex flex-row gap-x-2 py-2">
                  <IconAlertCircle size={16} />
                  <Typography.Text type="secondary">
                    Sorry! An error occured when fetching data.
                  </Typography.Text>
                </div>
                <details className="cursor-pointer">
                  <summary>
                    <Typography.Text type="secondary">Error Message</Typography.Text>
                  </summary>
                  <Input.TextArea
                    label="Error Messages"
                    value={JSON.stringify(error, null, 2)}
                    borderless
                    className=" border-t-2 border-scale-800 pt-2 font-mono"
                  />
                </details>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LogWrapper
