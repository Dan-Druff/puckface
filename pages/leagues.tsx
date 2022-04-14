import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useNHL } from '../context/NHLContext'
import AuthRoute from '../hoc/authRoute'
const Leagues: NextPage = () => {
    const {tonightsGames} = useNHL();
    return (
        <AuthRoute>
        <div className={styles.mainContainer}>
        <h2>Tonights NHL Games:</h2>
        {tonightsGames.length > 0 ? 
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
        : 
        <div className={styles.contentContainer}>
            <h3>No Games Tonight</h3>
        </div>
        }
   
  
  
      </div>
      </AuthRoute>
    )
}
export default Leagues