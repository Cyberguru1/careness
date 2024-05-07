import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ReactNotifications, Store } from 'react-notifications-component'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <ReactNotifications />
    <Component {...pageProps} />
  </>
}
