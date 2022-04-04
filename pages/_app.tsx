import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import {GameStateProvider} from '../context/GameState';
import {AuthProvider} from '../context/AuthContext';
import {NHLProvider} from '../context/NHLContext';
import {DashboardProvider} from '../context/DashboardContext';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GameStateProvider>
        <NHLProvider>
          <DashboardProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </DashboardProvider>
        </NHLProvider>
      </GameStateProvider>
    </AuthProvider>
    ) 
}

export default MyApp
