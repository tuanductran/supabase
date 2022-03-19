import dayjs from 'dayjs'
import { FC } from 'react'
import { Typography, IconX, Input } from '@supabase/ui'

import { LogData } from './Logs.types'
import JsonEditor from 'components/interfaces/TableGridEditor/SidePanelEditor/RowEditor/JsonEditor/JsonCodeEditor'
import { jsonSyntaxHighlight } from './LogsFomatters'

interface Props {
  log: LogData
  onClose: () => void
}

/**
 * Log selection display
 */
const LogSelection: FC<Props> = ({ log, onClose }) => {
  // console.log('log in selecion', log)

  console.log('log selection in component', log)
  // @ts-ignore
  console.log('log response', log?.response)
  // @ts-ignore
  console.log('log request', log?.request)

  // response highlight
  // @ts-ignore
  const response = log?.response ? jsonSyntaxHighlight(log.response) : ''

  console.log('output', response)

  return (
    <div
      className={[
        'h-full flex flex-col flex-grow border border-l',
        'border-panel-border-light dark:border-panel-border-dark',
        'bg-gray-200',
      ].join(' ')}
    >
      {log ? (
        <>
          <div
            className={[
              'bg-panel-header-light dark:bg-panel-header-dark',
              'border-b border-panel-border-interior-light',
              'dark:border-panel-border-interior-dark',
            ].join(' ')}
          >
            <div className="px-6 py-4 flex items-center">
              <div className="flex flex-row justify-between items-center w-full">
                <Typography.Title level={5}>
                  {dayjs(log.timestamp / 1000).toString()}
                </Typography.Title>
                <div className="cursor-pointer" onClick={onClose}>
                  <IconX size={14} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto bg-panel-body-light dark:bg-panel-body-dark">
            <div className="p-4 flex-col space-y-4">
              <div className="space-y-2">
                <p className="text-sm">Event message</p>
                <Input
                  copy
                  readOnly
                  size="small"
                  layout="vertical"
                  className="text-sm input-mono"
                  value={log.event_message}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm">Metadata</p>
                <Input.TextArea
                  copy
                  readOnly
                  size="small"
                  layout="vertical"
                  rows={20}
                  className="input-mono"
                  value={JSON.stringify(log.metadata, null, 2)}
                />
              </div>
            </div>
            <pre className="text-sm px-5">
              <h3 className="text-xl text-scale-1200">Request</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: log.request ? jsonSyntaxHighlight(log.request) : '',
                }}
              />
            </pre>
            <pre className="text-sm px-5">
              <h3 className="text-xl text-scale-1200">Request</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: log.response ? jsonSyntaxHighlight(log.response) : '',
                }}
              />
            </pre>
          </div>
          <div>
            {/* <JsonEditor
              className="logs-json"
              readOnly
              defaultValue={log.response ? JSON.stringify(log.response, null, 2) : ''}
              onInputChange={() => {}}
            />
            <JsonEditor
              className="logs-json"
              readOnly
              defaultValue={log.request ? JSON.stringify(log.request, null, 2) : ''}
              onInputChange={() => {}}
            />
            <JsonEditor readOnly defaultValue={log.event_message} onInputChange={() => {}} /> */}
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-1/2 text-center flex flex-col gap-2">
            <h3 className="text-sm text-scale-1200">Select an Event</h3>
            <p className="text-xs text-scale-1100">
              Select an Event to view the code snippet (pretty view) or complete JSON payload (raw
              view).
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogSelection
