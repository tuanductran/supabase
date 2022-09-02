import React from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../components/Providers'
import '../styles/main.scss'
import { SearchProvider } from '../components/Search/Search'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <SearchProvider>
        <Component {...pageProps} />
      </SearchProvider>
    </ThemeProvider>
  )
}

export default MyApp
