import { FC } from 'react'
import Link from 'next/link'
import { Alert, Badge, Button, IconAlertCircle, Typography } from '@supabase/ui'
import { PostgresTable } from '@supabase/postgres-meta'
import { useStore } from 'hooks'

interface Props {
  table: PostgresTable
}

const GridHeaderActions: FC<Props> = ({ table }) => {
  // Will need to import from a constants json of sorts
  const { ui } = useStore()
  const projectRef = ui.selectedProject?.ref
  const urlToRLSPolicies = `/project/${projectRef}/auth/policies`

  return (
    <div className="space-x-3 flex items-center">
      {/* {!table.rls_enabled && (
        <Link href={urlToRLSPolicies}>
          <Button type="warning" icon={<IconAlertCircle strokeWidth={2} size={14} />}>
            RLS not enabled
          </Button>
        </Link>
      )} */}

      {!table.rls_enabled && (
        <div className="w-full text-xs px-6 py-3 bg-amber-100">
          <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div className="w-full flex gap-4 text-amber-900 lg:items-center">
              <IconAlertCircle strokeWidth={2} />
              <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-2">
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
                  <span className="text-sm text-amber-1200">This table is not protected</span>
                  <span className="text-amber-1100 dark:text-amber-900">
                    Row level security (RLS) has not been enabled for this table
                  </span>
                </div>
                <div>
                  <Link href={urlToRLSPolicies}>
                    <Button type="warning">Enable RLS</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <Button type="text">
        <Typography.Text small code>
          Shortcuts
        </Typography.Text>
      </Button> */}
    </div>
  )
}

export default GridHeaderActions
