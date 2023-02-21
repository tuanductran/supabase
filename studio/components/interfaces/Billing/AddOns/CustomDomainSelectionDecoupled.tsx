import Link from 'next/link'
import { FC } from 'react'
import { Badge, Button, Radio } from 'ui'

import { useFlag, useParams } from 'hooks'
import DisabledWarningDueToIncident from 'components/ui/DisabledWarningDueToIncident'
import { ProjectAddonVariant, SelectedProjectAddonVariant } from 'types'

interface Props {
  options: ProjectAddonVariant[]
  currentOption?: SelectedProjectAddonVariant
  selectedOption?: SelectedProjectAddonVariant
  onSelectOption: (option: any) => void
}

const CustomDomainSelectionDecoupled: FC<Props> = ({
  options,
  currentOption,
  selectedOption,
  onSelectOption,
}) => {
  const { ref } = useParams()
  const addonUpdateDisabled = useFlag('disableProjectCreationAndUpdate')

  console.log({ currentOption, selectedOption })

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center space-x-2">
          <h4 className="text-lg">Custom Domains</h4>
          <Badge color="green">Optional</Badge>
        </div>
        <p className="text-sm text-scale-1100">Present a branded experience to your users</p>
      </div>
      {addonUpdateDisabled ? (
        <DisabledWarningDueToIncident title="Updating database add-ons is currently disabled" />
      ) : (
        <Radio.Group type="cards" className="billing-compute-radio">
          <Radio
            hidden
            key="custom_domain_none"
            align="vertical"
            // @ts-ignore
            label={
              <div className="flex items-center space-x-4">
                <p>Disable Custom Domains</p>
                {!currentOption?.identifier && <Badge color="brand">Current selection</Badge>}
              </div>
            }
            value="none"
            optionalLabel={<div>$0 / month</div>}
            checked={!selectedOption?.identifier}
            onChange={() => onSelectOption(undefined)}
          />

          {options.map((option: ProjectAddonVariant) => {
            return (
              <Radio
                hidden
                key={option.identifier}
                align="vertical"
                // @ts-ignore
                label={
                  <div className="flex items-center space-x-4">
                    <p>{option.name}</p>
                    {currentOption?.identifier === option.identifier && (
                      <Badge color="brand">Current selection</Badge>
                    )}
                  </div>
                }
                // @ts-ignore
                description={
                  <div>
                    <p>Custom domains allow you to present a branded experience to your users</p>
                  </div>
                }
                value={option.identifier}
                optionalLabel={<div>{option.pricing.description}</div>}
                checked={selectedOption?.identifier === option.identifier}
                onChange={() => onSelectOption(option)}
              />
            )
          })}
        </Radio.Group>
      )}
    </div>
  )
}

export default CustomDomainSelectionDecoupled
