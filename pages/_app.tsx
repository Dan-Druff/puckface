import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import {GameStateProvider} from '../context/GameState';
import {AuthProvider} from '../context/AuthContext';
import {NHLProvider} from '../context/NHLContext';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GameStateProvider>
        <NHLProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NHLProvider>
      </GameStateProvider>
    </AuthProvider>
    ) 
}

export default MyApp
