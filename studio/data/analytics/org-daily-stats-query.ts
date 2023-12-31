import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { useCallback } from 'react'
import { AnalyticsData } from './constants'
import { analyticsKeys } from './keys'

export enum EgressType {
  DATABASE = 'egress_database',
  AUTH = 'egress_auth',
  STORAGE = 'egress_storage',
  REALTIME = 'egress_realtime',
  UNIFIED = 'egress',
}

// [Joshen] Get this from common package instead of API and dashboard having one copy each
export enum PricingMetric {
  EGRESS = 'EGRESS',
  DATABASE_EGRESS = 'DATABASE_EGRESS',
  DATABASE_SIZE = 'DATABASE_SIZE',
  STORAGE_EGRESS = 'STORAGE_EGRESS',
  STORAGE_SIZE = 'STORAGE_SIZE',
  MONTHLY_ACTIVE_USERS = 'MONTHLY_ACTIVE_USERS',
  MONTHLY_ACTIVE_SSO_USERS = 'MONTHLY_ACTIVE_SSO_USERS',
  FUNCTION_INVOCATIONS = 'FUNCTION_INVOCATIONS',
  FUNCTION_COUNT = 'FUNCTION_COUNT',
  STORAGE_IMAGES_TRANSFORMED = 'STORAGE_IMAGES_TRANSFORMED',
  REALTIME_MESSAGE_COUNT = 'REALTIME_MESSAGE_COUNT',
  REALTIME_PEAK_CONNECTIONS = 'REALTIME_PEAK_CONNECTIONS',
}

export enum ComputeUsageMetric {
  COMPUTE_HOURS_XS = 'COMPUTE_HOURS_XS',
  COMPUTE_HOURS_SM = 'COMPUTE_HOURS_SM',
  COMPUTE_HOURS_MD = 'COMPUTE_HOURS_MD',
  COMPUTE_HOURS_L = 'COMPUTE_HOURS_L',
  COMPUTE_HOURS_XL = 'COMPUTE_HOURS_XL',
  COMPUTE_HOURS_2XL = 'COMPUTE_HOURS_2XL',
  COMPUTE_HOURS_4XL = 'COMPUTE_HOURS_4XL',
  COMPUTE_HOURS_8XL = 'COMPUTE_HOURS_8XL',
  COMPUTE_HOURS_12XL = 'COMPUTE_HOURS_12XL',
  COMPUTE_HOURS_16XL = 'COMPUTE_HOURS_16XL',
}

export type OrgDailyStatsVariables = {
  // API parameters
  orgSlug?: string
  metric?: PricingMetric
  startDate?: string
  endDate?: string
  interval?: string
  projectRef?: string
  // Client specific
  dateFormat?: string
  modifier?: (x: number) => number
}

export async function getOrgDailyStats(
  { orgSlug, metric, startDate, endDate, interval = '1d', projectRef }: OrgDailyStatsVariables,
  signal?: AbortSignal
) {
  if (!orgSlug) throw new Error('Org slug is required')
  if (!metric) throw new Error('Metric is required')
  if (!startDate) throw new Error('Start date is required')
  if (!endDate) throw new Error('Start date is required')

  let endpoint = `${API_URL}/organizations/${orgSlug}/daily-stats?metric=${metric}&startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}`

  if (interval) endpoint += `&interval=${interval}`
  if (projectRef) endpoint += `&projectRef=${projectRef}`

  const data = await get(endpoint, { signal })
  if (data.error) throw data.error
  return data as AnalyticsData
}

export type OrgDailyStatsData = Awaited<ReturnType<typeof getOrgDailyStats>>
export type OrgDailyStatsError = unknown

export const useOrgDailyStatsQuery = <TData = OrgDailyStatsData>(
  {
    orgSlug,
    metric,
    startDate,
    endDate,
    interval = '1d',
    projectRef,
    dateFormat = 'DD MMM',
    modifier,
  }: OrgDailyStatsVariables,
  { enabled = true, ...options }: UseQueryOptions<OrgDailyStatsData, OrgDailyStatsError, TData> = {}
) =>
  useQuery<OrgDailyStatsData, OrgDailyStatsError, TData>(
    analyticsKeys.orgDailyStats(orgSlug, { metric, startDate, endDate, interval, projectRef }),
    ({ signal }) =>
      getOrgDailyStats({ orgSlug, metric, startDate, endDate, interval, projectRef }, signal),
    {
      enabled:
        enabled &&
        typeof orgSlug !== 'undefined' &&
        typeof metric !== 'undefined' &&
        typeof startDate !== 'undefined' &&
        typeof endDate !== 'undefined',

      select(data) {
        const noDataYet = data.data[0]?.period_start === undefined

        // [Joshen] Ideally handled by API, like infra-monitoring
        if (noDataYet) {
          const days = dayjs(endDate).diff(dayjs(startDate), 'days')
          const tempArray = new Array(days).fill(0)
          const mockData = tempArray.map((x, idx) => {
            return {
              loopId: idx,
              period_start: dayjs(startDate).add(idx, 'day').format('DD MMM YYYY'),
              periodStartFormatted: dayjs(startDate).add(idx, 'day').format(dateFormat),
              [metric?.toLowerCase() as string]: 0,
            }
          })
          return { ...data, data: mockData, hasNoData: true } as TData
        } else {
          return {
            ...data,
            hasNoData: false,
            data: data.data.map((x) => {
              return {
                ...x,
                [metric?.toLowerCase() as string]:
                  modifier !== undefined
                    ? modifier(Number(x[metric?.toLowerCase() as string]))
                    : Number(x[metric?.toLowerCase() as string]),
                periodStartFormatted: dayjs(x.period_start).format(dateFormat),
              }
            }),
          } as TData
        }
      },
      staleTime: 1000 * 60 * 60, // default good for an hour for now
      ...options,
    }
  )
