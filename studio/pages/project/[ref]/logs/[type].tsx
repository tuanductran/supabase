import React, { useState } from 'react'
import { NextPage } from 'next'
import { withAuth } from 'hooks'

import { observer } from 'mobx-react-lite'

import LogWrapper from 'components/interfaces/Settings/Logs/LogWrapper'
import LogsLayout from 'components/layouts/LogsLayout'

import { Button, Toggle } from '@supabase/ui'
import { QueryType, Mode } from 'components/interfaces/Settings/Logs'
import sqlNew from '../sql/sql-new'

export const LogPage: NextPage = () => {
  const [type, setType] = useState<QueryType>('database')
  const [mode, setMode] = useState<Mode>('custom')
  // ! custom is SQL only logging !

  return (
    <>
      <SourceSwitcher type={type} setType={setType} mode={mode} setMode={setMode} />
      <LogsLayout>
        <LogWrapper type={type} mode={mode} />
      </LogsLayout>
    </>
  )
}

const SourceSwitcher = ({
  type,
  setType,
  mode,
  setMode,
}: {
  type: QueryType
  setType: (x: QueryType) => void
  mode: Mode
  setMode: (string: Mode) => void
}) => {
  return (
    <div className="px-8 absolute top-8 left-10 bg-amber-200 border border-amber-500 rounded p-3 text-scale-900 mb-4 flex gap-4 items-center z-40">
      <h3 className="text-base font-semibold text-scale-1200">
        This is for development, not for production!
      </h3>
      <span className="text-xs text-scale-900">Temporary source switcher</span>
      <div className="flex items-center gap-2">
        <span>Sql Mode?</span>
        <Toggle
          size="tiny"
          layout="flex"
          align="right"
          checked={mode === 'custom' ? true : false}
          onChange={(bool) => setMode(bool ? 'custom' : 'simple')}
        />
      </div>
      <div className="flex gap-2 items-center">
        <Button type={type === 'api' ? 'secondary' : 'default'} onClick={() => setType('api')}>
          API
        </Button>
        <Button
          type={type === 'database' ? 'secondary' : 'default'}
          onClick={() => setType('database')}
        >
          Database
        </Button>
        <Button
          type={type === 'functions' ? 'secondary' : 'default'}
          onClick={() => setType('functions')}
        >
          Functions
        </Button>
        <Button
          type={type === 'fn_edge' ? 'secondary' : 'default'}
          onClick={() => setType('fn_edge')}
        >
          Function edge
        </Button>
      </div>
    </div>
  )
}

export default withAuth(observer(LogPage))
