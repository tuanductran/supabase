import { IconCode, IconDatabase, Listbox, Menu } from '@supabase/ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ProductIcon } from '../ProductIcon'

const SideBar = ({ menuItems }: { menuItems: any }) => {
  const { asPath, basePath } = useRouter()

  const router = useRouter()
  // thin-scrollbar
  // sticky top-0 flex
  // h-screen min-w-[256px]
  // flex-col overflow-y-scroll
  // py-[var(--content-y-padding)]

  console.log(asPath.split('/')[2])

  return (
    <div
      className="
      fixed inset-0 top-[3.8125rem] left-[max(0px,calc(50%-45rem))] right-auto z-20 hidden w-[19.5rem] overflow-y-auto px-8 py-[var(--content-y-padding)] pb-10
      lg:block
      "
    >
      <div className="relative">
        {asPath.includes('/reference') && (
          <Listbox
            defaultValue={'javascript'}
            value={asPath.split('/')[2]}
            className="mb-8"
            label="Select API"
            onChange={(value) => {
              router.push(`/reference/${value}`)
            }}
          >
            <Listbox.Option
              value="javascript"
              label="Javascript"
              addOnBefore={() => <img src="/img/libraries/javascript-icon.svg" width={16} />}
            >
              supabase-js
            </Listbox.Option>
            <Listbox.Option
              value="dart"
              label="Dart"
              addOnBefore={() => <img src="/img/libraries/dart-icon.svg" width={16} />}
            >
              supabase-dart
            </Listbox.Option>
            <Listbox.Option
              value="cli"
              label="CLI"
              addOnBefore={() => (
                <div className="bg-scale-1200 text-scale-100 flex h-4 w-4 items-center justify-center rounded">
                  <IconCode strokeWidth={2} size={12} />
                </div>
              )}
            >
              CLI
            </Listbox.Option>
          </Listbox>
        )}
        <Menu className="w-full" type={'border'}>
          <div>
            {Object.keys(menuItems.items).map((key) => {
              // console.log(menuItems.items[key][0].hideTitle, 'menuItems[key]')
              return (
                <div key={key} className="mb-8">
                  {!menuItems.items[key].hideTitle && (
                    <div className="mb-3 flex items-center gap-2">
                      {menuItems.items[key].icon && (
                        <ProductIcon variant={menuItems.items[key].icon} size="tiny" />
                      )}
                      <h5 className="text-scale-1200 text-sm font-medium">{key}</h5>
                    </div>
                  )}
                  {/* <Menu.Group title={key} /> */}

                  {menuItems.items[key].items.map(
                    (item: { link: string; text: string; sections: Array<any> }) => (
                      <div key={item.link} className="mb-2">
                        {Array.isArray(item.sections) ? (
                          <>
                            {item.text && <Menu.Group title={item.text} />}
                            {item.sections.map((section) => (
                              <Link href={section.link} key={`${item.text}-${section.text}`}>
                                <Menu.Item active={asPath == section.link}>
                                  {section.text}
                                </Menu.Item>
                              </Link>
                            ))}
                          </>
                        ) : (
                          <Link href={item.link}>
                            <a>
                              <Menu.Item active={asPath === item.link}>
                                <div
                                  className={
                                    asPath === item.link ? 'text-brand-900' : 'text-scale-1000'
                                  }
                                >
                                  {item.text}
                                </div>
                              </Menu.Item>
                            </a>
                          </Link>
                        )}
                      </div>
                    )
                  )}
                </div>
              )
            })}
          </div>
        </Menu>
      </div>
    </div>
  )
}

export default SideBar
