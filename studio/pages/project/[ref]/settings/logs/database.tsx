import React, { useState } from 'react'
import { NextPage } from 'next'
import { withAuth } from 'hooks'

import { observer } from 'mobx-react-lite'

import LogWrapper from 'components/interfaces/Settings/Logs/LogWrapper'
import LogsLayout from 'components/layouts/LogsLayout'

import { Button, Toggle } from '@supabase/ui'
import { QueryType, Mode } from 'components/interfaces/Settings/Logs'
import { SettingsLayout } from 'components/layouts'
import { useRouter } from 'next/router'

export const LogPage: NextPage = () => {
  const router = useRouter()
  // get 'type' from url query
  // const { type: typeFromUrl } = router.query

  // const [type, setType] = useState<any>(typeFromUrl)
  const [mode, setMode] = useState<Mode>('simple')
  // ! custom is SQL only logging !

  return (
    <>
      <SettingsLayout>
        {/* <SourceSwitcher type={type} setType={setType} mode={mode} setMode={setMode} /> */}
        <LogWrapper type={'database'} mode={mode} />
      </SettingsLayout>
    </>
  )
}

export default withAuth(observer(LogPage))
