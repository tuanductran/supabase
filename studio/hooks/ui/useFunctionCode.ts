import { useEffect } from 'react'

export function useFunctionCode(funcBody: string) {
  useEffect(() => {
    if (funcBody) {
      const worker = new Worker(new URL('../../workers/functions.ts', import.meta.url))
      worker.postMessage(funcBody)
    }
  }, [funcBody])

  return ''
}
