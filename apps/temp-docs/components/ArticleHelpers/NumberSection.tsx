// import jsxToString from 'jsx-to-string'
import React from 'react'

interface Props {
  number: number | string
  children: any
  // title: string
}

const NumberSection = ({
  number,
  children,
}: // title
Props) => {
  //   const childStrings: string[] = []

  //   if (typeof children !== 'string' && children?.length > 0) {
  //     children &&
  //       // @ts-ignore
  //       children.map((x) => {
  //         return childStrings.push(jsxToString(x))
  //       })
  //   } else {
  //     return childStrings.push(jsxToString(children))
  //   }

  //   const arrayedChildren = []

  let title = ''

  var renderedChildren: React.ReactElement[] = [...children]

  console.log('renderedChildren', renderedChildren)

  const firstType = renderedChildren[0].props.originalType

  if (firstType === 'h2' || firstType === 'h3' || firstType === 'h4') {
    // @ts-expect-error
    title = renderedChildren[0]
    renderedChildren.shift()
  }

  return (
    <div className="border-scale-300 dark:border-scale-400 mb-0 ml-2 border-l pb-12 first:mt-12 last:mb-12">
      <div className="flex items-center gap-5">
        <div className="dark:bg-scale-300 dark:highlight-white/5 border-scale-500 -ml-3 flex h-6 w-6 items-center justify-center rounded border bg-white shadow">
          <span className="font-mono text-xs uppercase">{number}</span>
        </div>
        <a className="not-prose !text-scale-1200 !m-0 !text-base !font-medium">{title}</a>
      </div>
      {/* <div className="pl-6">{children ? <>{childStrings.join(' ')}</> : null}</div> */}
      <div className="pl-8">{children.length > 0 ? [...renderedChildren] : [renderedChildren]}</div>
    </div>
  )
}

export { NumberSection }
