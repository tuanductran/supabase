import {
  ComputeSizeSelection,
  CustomDomainSelection,
  PITRDurationSelection,
  StripeSubscription,
} from 'components/interfaces/Billing'
import InfraLayout from 'components/layouts/InfraLayout'
import { useFlag, useStore } from 'hooks'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  NextPageWithLayout,
  ProjectAddon,
  ProjectAddonType,
  ProjectAddonVariant,
  SelectedProjectAddon,
} from 'types'
import { get } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { Transition } from '@headlessui/react'
import BackButton from 'components/ui/BackButton'
import { Divider, IconHelpCircle } from 'ui'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import CustomDomainSelectionDecoupled from 'components/interfaces/Billing/AddOns/CustomDomainSelectionDecoupled'
import PITRDurationSelectionDecoupled from 'components/interfaces/Billing/AddOns/PITRDurationSelectionDecoupled'

const InfraUpdate: NextPageWithLayout = () => {
  const { ui } = useStore()
  const router = useRouter()
  const [subscription, setSubscription] = useState<StripeSubscription>()
  const projectUpdateDisabled = useFlag('disableProjectCreationAndUpdate')

  const orgSlug = ui.selectedOrganization?.slug
  const projectRef = ui.selectedProject?.ref
  const projectRegion = ui.selectedProject?.region ?? ''
  const projectAddons = ui.selectedProject?.addons ?? []

  const [availableAddons, setAvailableAddons] = useState<ProjectAddon[]>([])
  const [selectedAddons, setSelectedAddons] = useState<SelectedProjectAddon[]>(projectAddons)

  const getSubscription = async () => {
    try {
      if (!ui.selectedProject?.subscription_id) {
        throw new Error('Unable to get subscription ID of project')
      }

      const subscription = await get(`${API_URL}/projects/${projectRef}/subscription`)
      if (subscription.error) throw subscription.error
      setSubscription(subscription)
    } catch (error: any) {
      ui.setNotification({
        error,
        category: 'error',
        message: `Failed to get subscription: ${error.message}`,
      })
    }
  }

  const getAvailableAddons = async () => {
    try {
      const addons = await get(`${API_URL}/projects/${projectRef}/addons`)
      if (addons.error) throw addons.error

      setAvailableAddons(addons.available_addons)
    } catch (error: any) {
      ui.setNotification({
        error,
        category: 'error',
        message: `Failed to get available addons: ${error.message}`,
      })
    }
  }

  useEffect(() => {
    if (projectUpdateDisabled) {
      router.push(`/project/${projectRef}/settings/billing/update`)
    } else if (projectRef) {
      getAvailableAddons()
      getSubscription()
    }
  }, [projectRef])

  const onSelectBack = () => {}

  const onProjectAddonSelected = (
    type: ProjectAddonType,
    selection: ProjectAddonVariant | undefined
  ) => {
    if (!selection) {
      setSelectedAddons(selectedAddons.filter((it) => it.type !== type))
    } else {
      const newAddons = selectedAddons.filter((it) => it.type !== type)
      newAddons.push({ type, variant: { identifier: selection.identifier } })
      setSelectedAddons(newAddons)
    }
    console.log({ type, selection, selectedAddons })
  }

  return (
    <>
      <Transition
        show
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 translate-x-10"
        enterTo="transform opacity-100 translate-x-0"
        className="flex items-start justify-between w-full"
      >
        <div className="flex-grow mt-10">
          <div className="relative space-y-4">
            <div className="relative px-32 mx-auto space-y-4 2xl:max-w-5xl">
              <BackButton onClick={() => onSelectBack()} />
              <h4 className="text-lg text-scale-900 !mb-8">Change your project's configuration</h4>
            </div>

            <div
              className="px-32 pb-8 mx-auto space-y-8 overflow-y-auto 2xl:max-w-5xl"
              style={{ height: 'calc(100vh - 9rem - 57px)' }}
            >
              <div>
                You are currently on the {subscription?.tier.name}. Click here to manage your
                subscription.
              </div>

              {projectRegion !== 'af-south-1' && (
                <>
                  <CustomDomainSelectionDecoupled
                    options={
                      availableAddons.find((it) => it.type === ProjectAddonType.CustomDomain)
                        ?.variants || []
                    }
                    currentOption={
                      projectAddons.find((it) => it.type === ProjectAddonType.CustomDomain)?.variant
                    }
                    selectedOption={
                      selectedAddons.find((it) => it.type === ProjectAddonType.CustomDomain)
                        ?.variant
                    }
                    onSelectOption={(selection) =>
                      onProjectAddonSelected(ProjectAddonType.CustomDomain, selection)
                    }
                  />

                  <Divider light />
                  <PITRDurationSelectionDecoupled
                    pitrDurationOptions={
                      availableAddons.find((it) => it.type === ProjectAddonType.PITR)?.variants ||
                      []
                    }
                    currentPitrDuration={
                      projectAddons.find((it) => it.type === ProjectAddonType.PITR)?.variant
                    }
                    selectedPitrDuration={
                      selectedAddons.find((it) => it.type === ProjectAddonType.PITR)?.variant
                    }
                    onSelectOption={(selection) =>
                      onProjectAddonSelected(ProjectAddonType.PITR, selection)
                    }
                  />
                  {/*
                  <Divider light />
                  <ComputeSizeSelection
                    computeSizes={computeSizes || []}
                    currentComputeSize={currentAddons.computeSize}
                    selectedComputeSize={selectedAddons.computeSize}
                    onSelectOption={setSelectedComputeSize}
                  /> */}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-[34rem]">
          Change summary Selected add-ons Micro Add-on $0.00 Small Add-on $5.00 Custom Domain $10.00
          <Divider />
          Total amount due This amount will be charged on February 20, 2023. You'll pay a monthly
          total of $0 + usage fees for each subsequent billing cycle.
          {/* <PaymentSummaryPanel
            isRefreshingPreview={isRefreshingPreview}
            subscriptionPreview={subscriptionPreview}
            isSpendCapEnabled={isSpendCapEnabled}
            // Current subscription configuration based on DB
            currentPlan={currentSubscription.tier}
            currentAddons={currentAddons}
            currentSubscription={currentSubscription}
            // Selected subscription configuration based on UI
            selectedPlan={selectedTier}
            selectedAddons={selectedAddons}
            paymentMethods={paymentMethods}
            isLoadingPaymentMethods={isLoadingPaymentMethods}
            selectedPaymentMethod={selectedPaymentMethodId}
            onSelectPaymentMethod={setSelectedPaymentMethodId}
            onSelectAddNewPaymentMethod={() => {
              setShowAddPaymentMethodModal(true)
            }}
            beforeConfirmPayment={beforeConfirmPayment}
            onConfirmPayment={onConfirmPayment}
            isSubmitting={isSubmitting}
            captcha={
              <HCaptcha
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                size="invisible"
                onVerify={(token) => {
                  setCaptchaToken(token)
                }}
                onExpire={() => {
                  setCaptchaToken(null)
                }}
              />
            }
          /> */}
        </div>
      </Transition>
    </>
  )
}

InfraUpdate.getLayout = (page) => <InfraLayout>{page}</InfraLayout>

export default observer(InfraUpdate)
