import { get } from 'lib/common/fetch'
import { Parser, options as eszipOptions } from './eszip/mod.ts'

async function getBody(ref: string, slug: string, accessToken: string) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    }
    const url = `${process.env.NEXT_PUBLIC_API_ADMIN_URL}/projects/${ref}/functions/${slug}/body`
    const body = await get(url, { headers })
    return { body, error: null }
  } catch (error) {
    return { body: null, error }
  }
}

onmessage = async function (msg: any) {
  const { ref, slug, accessToken } = msg.data

  const { body, error } = await getBody(ref, slug, accessToken)
  if (error) {
    postMessage({ error })
    return
  }

  // extract eszip
  eszipOptions.wasmURL = new URL('https://esm.sh/@deno/eszip@0.31.0/esm/eszip_wasm_bg.wasm')
  const parser = await Parser.createInstance()
  const specifiers = await parser.parseBytes(eszip)
  console.log(specifiers)
}
