import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useNHL } from '../context/NHLContext'
import BenchCard from '../components/BenchCard'
import {dreamTeam } from '../utility/constants'
import { useRouter } from 'next/router'
const Home: NextPage = () => {
  const {tonightsGames} = useNHL();
  const Router = useRouter();
  const help = () => {
    Router.push('/wtf');
  }
  return (
    <div className={styles.mainContainer}>
    
      {tonightsGames.length > 0 &&
      <div className={styles.contentContainer}>
        {tonightsGames.map((g) => {
              return (
                <div className={styles.nhlTick} key={g.homeName}>
                    <p>{g.awayName}</p>
                    <p> 🥊 </p>
                    <p>{g.homeName}</p>
                </div>
            )
        })}
      </div>
      }
        {/* <div className={styles.contentContainer}>
          <h2>🥅 Login to start givin &#39;er... 🏒</h2>
        </div> */}
        <div className={styles.contentContainer}>
          <button className={styles.pfButton} onClick={() => help()}>WTF is this?</button>
        </div>
        <div className={styles.contentContainer}>
            <div className={styles.lockerroom}>
              {dreamTeam.map((card) => {
                return (
                  <BenchCard key={card.tokenId} active={false} card={card} func={() => {}} posId='none' />
                )
              })}
            </div>
          </div>

    </div>
  )
}

export default Home
