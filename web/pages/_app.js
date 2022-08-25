import '../styles/globals.css'
import AuthProvider from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Flow Name Service</title>
        <meta name="description" content="Flow Name Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
