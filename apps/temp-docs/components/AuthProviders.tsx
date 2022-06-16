import authProviders from '../data/authProviders'
import phoneProviders from '../data/phoneProviders'
import { Card } from '@supabase/ui'
import Link from 'next/link'
import LinkCard from './LinkCard'

export default function AuthProviders({ type = '0auth' }: { type: '0auth' | 'phone' }) {
  const providers = {
    '0auth': authProviders,
    phone: phoneProviders,
  }

  const list = providers[type]

  return (
    <div className="not-prose grid gap-8 md:grid-cols-3">
      {list.map((x: any) => (
        // <Link href={x.href}>
        <LinkCard
          title={x.name}
          description=""
          link={x.href}
          icon={`/img/auth-icons/${x.name}-icon.svg`}
        >
          {x.official ? (
            <span className="bg-brand-400 text-brand-900 rounded py-0.5 px-2 text-xs">
              Official
            </span>
          ) : (
            <span className="bg-scale-300 text-scale-1100 rounded py-0.5 px-2 text-xs">
              Community support
            </span>
          )}
        </LinkCard>
        // </Link>

        // <div key={x.name}>
        //   <Link href={x.href}>
        //     <>
        //       <div className="flex items-start justify-start gap-3">
        //         <img src={`/img/auth-icons/${x.name}-icon.svg`} width="32" />
        //         <div className="flex flex-col">
        //           <div>
        //             <div className="flex items-center gap-3">
        //               <p>{x.name}</p>
        //               {x.official ? (
        //                 <span className="bg-brand-900 rounded py-0.5 px-2 text-xs text-white">
        //                   Official
        //                 </span>
        //               ) : (
        //                 <span className="bg-scale-300 text-scale-1100 rounded py-0.5 px-2 text-xs">
        //                   Unofficial
        //                 </span>
        //               )}
        //             </div>
        //             <p className="flex items-center text-xs font-normal uppercase text-white"></p>
        //           </div>
        //           {/* <div className="flex flex-col gap-2">
        //             <div className="flex w-full justify-between rounded border-2 border-solid border-gray-600 p-1 text-xs">
        //               <span>Platform:</span>
        //               <span>{x.platform.toString()}</span>
        //             </div>
        //             <div className="flex w-full justify-between rounded border-2 border-solid border-gray-600 p-1 text-xs">
        //               <span>Self-Hosted:</span>
        //               <span>{x.selfHosted.toString()}</span>
        //             </div>
        //           </div> */}
        //         </div>
        //       </div>
        //     </>
        //   </Link>
        // </div>
      ))}
    </div>
  )
}
