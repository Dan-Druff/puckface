import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard} from '../context/DashboardContext'
import { useGameState } from '../context/GameState'
import AuthRoute from '../hoc/authRoute'
import LobbyGameCard from '../components/LobbyGameCard'
import BenchCard from '../components/BenchCard'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import { GamePosition } from '../utility/constants'
const Dashboard: NextPage = () => {
    const Router = useRouter();
    const {gameStateDispatch} = useGameState();
    const {activeGames, pucks, dashboardDispatch, dashboard, displayName,messages} = useDashboard();
    console.log("Player has pucks: ", pucks);


    const cardSelect = async(posId:GamePosition, tokenId:number) => {
        try {
            console.log("You selected card: ", tokenId, posId);
            gameStateDispatch({type:'inspect'});
            Router.push(`/card/${tokenId.toString()}`);
        } catch (er) {
            console.log("Card select error: ",er);
        }
    }
    return (
        <AuthRoute>
            {displayName === 'NA' ? 
            <div className={styles.contentContainer}>
                <Loader message="Loading Dashboard..." />
            </div>
            :     
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <h1>{displayName} has &#36;{pucks} Pucks.</h1>
                </div>
                <div className={styles.contentContainer}>
                    {messages.length > 0 ? <h3>You have {messages.length} messages.</h3>: <h3>You have NO messages.</h3>}
                </div>
                <div className={styles.contentContainerColumn}>
             
             {activeGames.length > 0 ? 
             <>
                <h2>⬇ ACTIVE GAMES ⬇</h2>
                <div className={styles.contentContainer}>
                {activeGames.filter(gam => gam.gameState !== "Complete").map((g) => {
                    return (
                        <LobbyGameCard key={g.id} game={g}/>
                    )
                })}
    
                </div>
                <div className={styles.contentContainer}>
                    <h4>(Check out completed games on Profile Page)</h4>
                </div>
         
             </>
             :
             <h2>NO GAMES TO SHOW</h2>
             }
                </div>
                <div className={styles.contentContainer}>
                    {dashboard.length > 0 ? 
                    <>
                        <h2>⬇ ALL CARDS ⬇</h2>
                        <div className={styles.lockerroom}>
                        {dashboard.map((card) => {
                            return (
                                <BenchCard key={card.tokenId} card={card} active={true} func={cardSelect} posId={'none'}/>
                            )
                        })}           
                    </div>
                    </> 
                    : 
                    <div className={styles.contentContainerColumn}>
                        <h2>Welcome Puck Face! 🏒 </h2>
                        <h2>Checkout the store to start playing... 🥅</h2>
                    </div>
                    }
                </div>

            {/* <button onClick={() => dashboardDispatch({type:'notify',payload:{notObj:funnyObj}})}>NOTIFY</button> */}
            </div>}
        
        </AuthRoute>
    )
}
export default Dashboard