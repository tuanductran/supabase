import type { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'experimental-edge',
}


export default async function handler(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const option = searchParams.get('option')?.toLowerCase()
    const title = searchParams.get('title')
    const theme = searchParams.get('theme')

    return new ImageResponse(
    (
      <div
  style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'url(https://raw.githubusercontent.com/supabase/supabase/master/apps/www/public/images/github/supabase-dashboard.png)',
    fontSize: 24,
    fontWeight: 600,
  }}
>
<div style={{display: 'flex', flexDirection: 'column',margin: '1.5rem'}}>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
  }}>
    <span style={{
      fontSize: 12
    }}>Quick start</span>
    <h1 style={{
      marginTop: ''
    }}>{title}</h1>
  </div>
</div>
</div>
    ),
    {
      width: 1200,
      height: 600,
    },
  );

}
