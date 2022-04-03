import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useNHL } from '../context/NHLContext'
const Home: NextPage = () => {
  const {tonightsGames} = useNHL();

  return (
    <div className={styles.mainContainer}>
      <h2>TEST APppP</h2>
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

    </div>
  )
}

export default Home
