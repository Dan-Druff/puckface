import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useGameState } from '../context/GameState';
import AuthRoute from '../hoc/authRoute';
import LobbyGameCard from '../components/LobbyGameCard';
import { gameIsOver } from '../utility/helpers';
import { useEffect, useState } from 'react';
import { getLobbyGames } from '../context/DashboardContext';
import { GameType } from '../utility/constants';

const Lobby: NextPage = () => {
    const [openLobbyGames, setOpenLobbyGames] = useState<GameType[]>([]);
   
    useEffect(() => {
      const initLobby = async() => {
        const openGames = await getLobbyGames();
        if(openGames !== false) {
            if(openGames.length > 0){
               setOpenLobbyGames(openGames);
            }
        }
      }
      initLobby();
    
      return () => {
        
      }
    }, [])
    
    return (
        <AuthRoute>
            <div className={styles.mainContainer}>
                <h2>Lobby</h2>
                {openLobbyGames.length > 0 ? 
                <>
                    <div className={styles.contentContainer}>
                    <h4>This area to filter lobby games...</h4>
                    </div>
                    <div className={styles.contentContainer}>
                        {/* {openLobbyGames.filter(g => gameIsOver(g) === false && g.open === true).map((game) => { */}
                        {openLobbyGames.map((game) => {    
                            return (
                                <LobbyGameCard key={game.id} game={game}/>
                            )
                        })}
             
                    </div>
                </>
                : 
                <div className={styles.contentContainer}>
                    <h3>NO OPEN GAMES TO SHOW.</h3>
                </div>
                }
            </div>
        </AuthRoute>
    )
}
export default Lobby