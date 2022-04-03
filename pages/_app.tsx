import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import {GameStateProvider} from '../context/GameState';
import {AuthProvider} from '../context/AuthContext';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GameStateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GameStateProvider>
    </AuthProvider>
    ) 
}

export default MyApp
