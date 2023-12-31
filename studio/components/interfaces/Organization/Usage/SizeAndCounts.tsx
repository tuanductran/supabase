import { DataPoint } from 'data/analytics/constants'
import { PricingMetric, useOrgDailyStatsQuery } from 'data/analytics/org-daily-stats-query'
import { OrgSubscription } from 'data/subscriptions/org-subscription-query'
import UsageSection from './UsageSection/UsageSection'

export interface SizeAndCountsProps {
  orgSlug: string
  startDate: string | undefined
  endDate: string | undefined
  subscription: OrgSubscription | undefined
  currentBillingCycleSelected: boolean
}

const SizeAndCounts = ({
  orgSlug,
  startDate,
  endDate,
  subscription,
  currentBillingCycleSelected,
}: SizeAndCountsProps) => {
  const { data: dbSizeData, isLoading: isLoadingDbSizeData } = useOrgDailyStatsQuery({
    orgSlug,
    metric: PricingMetric.DATABASE_SIZE,
    interval: '1d',
    startDate,
    endDate,
  })

  const { data: storageSizeData, isLoading: isLoadingStorageSizeData } = useOrgDailyStatsQuery({
    orgSlug,
    metric: PricingMetric.STORAGE_SIZE,
    interval: '1d',
    startDate,
    endDate,
  })

  const { data: functionCountData, isLoading: isLoadingFunctionCountData } = useOrgDailyStatsQuery({
    orgSlug,
    metric: PricingMetric.FUNCTION_COUNT,
    interval: '1d',
    startDate,
    endDate,
  })

  const chartMeta: {
    [key: string]: { data: DataPoint[]; margin: number; isLoading: boolean; hasNoData: boolean }
  } = {
    [PricingMetric.DATABASE_SIZE]: {
      isLoading: isLoadingDbSizeData,
      margin: 14,
      data: dbSizeData?.data ?? [],
      hasNoData: dbSizeData?.hasNoData ?? false,
    },
    [PricingMetric.STORAGE_SIZE]: {
      isLoading: isLoadingStorageSizeData,
      margin: 14,
      data: storageSizeData?.data ?? [],
      hasNoData: storageSizeData?.hasNoData ?? false,
    },
    [PricingMetric.FUNCTION_COUNT]: {
      isLoading: isLoadingFunctionCountData,
      margin: 0,
      data: functionCountData?.data ?? [],
      hasNoData: functionCountData?.hasNoData ?? false,
    },
  }

  return (
    <UsageSection
      orgSlug={orgSlug}
      categoryKey="sizeCount"
      chartMeta={chartMeta}
      subscription={subscription}
      currentBillingCycleSelected={currentBillingCycleSelected}
    />
  )
}

export default SizeAndCounts
