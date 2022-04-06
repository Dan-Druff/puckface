
import { dateReader, getPlayerFromToken, getPlayersPointsFromIdAndDate } from "../utility/helpers"
import { useRouter } from "next/router"
import styles from '../styles/All.module.css';
import { useGameState } from "../context/GameState";
import { useDashboard,getGame } from "../context/DashboardContext";
import { useNHL } from "../context/NHLContext";
import { useAuth } from "../context/AuthContext";
import { GameType } from "../utility/constants";
const LobbyGameCard = ({game}:{game:GameType}) => {
    const {gameStateDispatch} = useGameState();
    const Router = useRouter();
    const { dashboardDispatch} = useDashboard();
    const {tonightsGames} = useNHL();
    const {userData} = useAuth();   
    const goToGame = async(gameId:string) => {
        // More things to do here
        try {
  
            
            Router.push(`/game/${gameId}`);
            return;
        } catch (e) {
            console.log("Gotogame error: ", e);
            return; 
        }

    }
 
    let c = '';
    let r = 0;

    try {
        let y = dateReader(game.date);
        c = y.fullDate;
        r = game.value * 2;
        

    } catch (error) {
        console.log("Date Error: ",error);
    }
 

    return (
        <div className={styles.lobbyGameCard}>
            <h4>{game.awayName} 🥊 {game.homeName}</h4>
            <p>{c}</p>
            <p>${r}</p>
            <button className={styles.pfButtonSecondary} onClick={() => goToGame(game.id)}>GO TO GAME</button>
        </div>
    )
}


export default LobbyGameCard
