import { useEffect, useState } from 'react'
import { getAccessToken } from 'lib/common/fetch'

export function useFunctionCode(ref: string | null, slug: string | null) {
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const call = async () => {
      const accessToken = await getAccessToken()
      setAccessToken(accessToken)
    }

    call()
  }, [])

  useEffect(() => {
    if (ref && slug && accessToken) {
      const worker = new Worker(new URL('../../workers/functions.ts', import.meta.url))
      worker.postMessage({ ref, slug, accessToken })
    }
  }, [ref, slug, accessToken])

  return ''
}
