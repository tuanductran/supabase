import { PostgresMaterializedView, PostgresTable, PostgresView } from '@supabase/postgres-meta'
import { PostgresForeignTable } from '@supabase/postgres-meta/dist/lib/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ENTITY_TYPE } from 'data/entity-types/entity-type-constants'
import { get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { tableKeys } from './keys'

export type TableVariables = {
  id?: number
  type?: ENTITY_TYPE
  projectRef?: string
  connectionString?: string
}

export type TableResponse =
  | PostgresTable
  | PostgresForeignTable
  | PostgresView
  | PostgresMaterializedView

export async function getTable(
  { projectRef, connectionString, id, type }: TableVariables,
  signal?: AbortSignal
) {
  if (!projectRef) {
    throw new Error('projectRef is required')
  }
  if (!id) {
    throw new Error('id is required')
  }
  if (!type) {
    throw new Error('type is required')
  }

  let headers = new Headers()

  if (connectionString) {
    headers.set('x-connection-encrypted', connectionString)
  }

  const endpoint = (() => {
    switch (type) {
      case ENTITY_TYPE.TABLE:
        return 'tables'
      case ENTITY_TYPE.FOREIGN_TABLE:
        return 'foreign-tables'
      case ENTITY_TYPE.VIEW:
        return 'views'
      case ENTITY_TYPE.MATERIALIZED_VIEW:
        return 'materialized-views'
      default:
        throw new Error(`Unknown type: ${type}`)
    }
  })()

  const response = await get(`${API_URL}/pg-meta/${projectRef}/${endpoint}?id=${id}`, {
    headers: Object.fromEntries(headers),
    signal,
  })
  if (response.error) {
    throw response.error
  }

  return response as TableResponse
}

export type TableData = Awaited<ReturnType<typeof getTable>>
export type TableError = unknown

export const useTableQuery = <TData = TableData>(
  { id, projectRef, connectionString, type }: TableVariables,
  { enabled = true, ...options }: UseQueryOptions<TableData, TableError, TData> = {}
) =>
  useQuery<TableData, TableError, TData>(
    tableKeys.table(projectRef, id),
    ({ signal }) => getTable({ id, projectRef, connectionString, type }, signal),
    {
      enabled:
        enabled &&
        typeof projectRef !== 'undefined' &&
        typeof id !== 'undefined' &&
        typeof type !== 'undefined',
      ...options,
    }
  )
