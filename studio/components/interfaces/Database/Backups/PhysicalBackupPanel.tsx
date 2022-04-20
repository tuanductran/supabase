import dayjs from 'dayjs'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { Button, Typography, Input } from '@supabase/ui'
import Panel from 'components/to-be-cleaned/Panel'

import { useStore } from 'hooks'
import { API_URL } from 'lib/constants'
import { post } from 'lib/common/fetch'
import { confirmAlert } from 'components/to-be-cleaned/ModalsDeprecated/ConfirmModal'

interface Props {
  projectRef: string
  earliestPhysicalBackup: any
}

const PhysicalBackupPanel: FC<Props> = ({ projectRef, earliestPhysicalBackup }) => {
  const router = useRouter()
  const { ui } = useStore()
  const { completed_on: earliestPhysicalBackupDateTime } = earliestPhysicalBackup

  const [recoveryDateTime, setRecoveryDateTime] = useState('')
  const [isRestoring, setRestoring] = useState<boolean>(false)
  const [recoveryDateTimeValidityWarning, setRecoveryDateTimeValidityWarning] = useState('')

  const canSubmit =
    dayjs(recoveryDateTime) > dayjs(earliestPhysicalBackupDateTime) &&
    dayjs(recoveryDateTime) < dayjs()

  async function restore(recoveryDateTime: any) {
    setRestoring(true)
    try {
      post(`${API_URL}/database/${projectRef}/backups/physicalRestore`, {
        recoveryDateTimeUnix: dayjs(recoveryDateTime).unix(),
      }).then(() => {
        setTimeout(() => {
          router.push('/project/[id]', `/project/${projectRef}`)
        }, 3000)
      })
    } catch (error) {
      ui.setNotification({
        error,
        category: 'error',
        message: `Something went wrong with your Point in Time Recovery. Kindly contact support.`,
      })
      setRestoring(false)
    }
  }

  function onRestoreClick() {
    confirmAlert({
      title: 'Confirm to restore',
      message: `Are you sure you want to restore from ${dayjs(recoveryDateTime).format(
        'DD/MM/YYYY, hh:mm:ss A Z'
      )}? Database will be unavailable during the restoration.`,
      onAsyncConfirm: async () => {
        await restore(recoveryDateTime)
      },
    })
  }

  function onRecoveryDateTimeChange(e: any) {
    const value = e.target.value
    setRecoveryDateTime(value)

    if (dayjs(recoveryDateTime) < dayjs(earliestPhysicalBackupDateTime)) {
      setRecoveryDateTimeValidityWarning(
        'Your chosen recovery point is before the earliest available backup.'
      )
    } else if (dayjs(recoveryDateTime) > dayjs()) {
      setRecoveryDateTimeValidityWarning('Your chosen recovery point is in the future.')
    } else {
      setRecoveryDateTimeValidityWarning('')
    }
  }

  return (
    <>
      <div className="">
        <section className="space-y-6 mt-6">
          <Panel
            title={[
              <Typography.Title key="panel-title" level={5} className="mb-0">
                Point in Time Recovery
              </Typography.Title>,
            ]}
          >
            <Panel.Content className="space-y-6">
              <Input
                className="input-mono"
                layout="horizontal"
                readOnly
                disabled
                value={dayjs(earliestPhysicalBackupDateTime).format('DD/MM/YYYY, hh:mm:ss A Z')}
                label="Earliest Point of Recovery"
              />
              <div>
                <Input
                  layout="horizontal"
                  className="w-full"
                  label={'Recovery Point'}
                  descriptionText={'Your local timezone will be automatically applied'}
                  value={recoveryDateTime}
                  type={'datetime-local'}
                  onChange={onRecoveryDateTimeChange}
                  step={1}
                  error={recoveryDateTimeValidityWarning}
                />
                <div className="space-x-1 flex">
                  <Button
                    type="secondary"
                    disabled={isRestoring || !canSubmit}
                    loading={isRestoring}
                    onClick={onRestoreClick}
                  >
                    Restore
                  </Button>
                </div>
              </div>
            </Panel.Content>
          </Panel>
        </section>
      </div>
    </>
  )
}

export default observer(PhysicalBackupPanel)
