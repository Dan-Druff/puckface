import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard} from '../context/DashboardContext'
import { NoteType } from '../utility/constants'
import AuthRoute from '../hoc/authRoute'
import LobbyGameCard from '../components/LobbyGameCard'

const Dashboard: NextPage = () => {
    const {activeGames, pucks, dashboardDispatch, dashboard, displayName} = useDashboard();
    console.log("Player has pucks: ", pucks);
    const funnyFunction = () => {
        console.log("Calling funny function");
    }
    const canc = () => {
        dashboardDispatch({type:'cancelNotify'})
    }
    const funnyObj:NoteType = {
        mainTitle:'main butt',
        cancelTitle:'Cancel',
        twoButtons:true,
        message:'Youre a fuckin cunt',
        colorClass:'M/a',
        mainFunction:funnyFunction,
        cancelFunction:canc
    }

    return (
        <AuthRoute>
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <h1>{displayName} has &#36;{pucks} Pucks.</h1>
                </div>
                <div className={styles.contentContainerColumn}>
             
             {activeGames.length > 0 ? 
             <>
                <h2>⬇ RECENT GAMES ⬇</h2>
                <div className={styles.contentContainer}>
                {activeGames.map((g) => {
                     return (
                   
                         <LobbyGameCard key={g.id} game={g}/>
                     )
                 })}
                </div>
         
             </>
             :
             <h2>NO GAMES TO SHOW</h2>
             }
         </div>
            {dashboard.map((guy) => {
                return (
                    <div key={guy.tokenId}>
                        <p>Guys nmae: {guy.playerName}</p>
                    </div>
                )
            })}
            <button onClick={() => dashboardDispatch({type:'notify',payload:{notObj:funnyObj}})}>NOTIFY</button>
            </div>
        </AuthRoute>
    )
}
export default Dashboard