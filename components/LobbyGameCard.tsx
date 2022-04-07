
import { dateReader, getPlayerFromToken, getPlayersPointsFromIdAndDate } from "../utility/helpers"
import { useRouter } from "next/router"
import styles from '../styles/All.module.css';
import { useGameState } from "../context/GameState";
import { useDashboard,getGame } from "../context/DashboardContext";
import { useNHL } from "../context/NHLContext";
import { useAuth } from "../context/AuthContext";
import {  GameType,nobody, Team } from "../utility/constants";
import type { GamePosition } from "../utility/constants";
const LobbyGameCard = ({game}:{game:GameType}) => {
    const {gameStateDispatch} = useGameState();
    const Router = useRouter();
    const { dashboardDispatch} = useDashboard();
    const {tonightsGames} = useNHL();
    const {userData} = useAuth();   
    const goToGame = async(gameId:string) => {
        // More things to do here
        try {
            const gameResult = await getGame(gameId);
            if(gameResult === false) throw new Error("🚦Game Res Error🚦")
            let skaterIds:number[] = [];
            skaterIds.push(gameResult.homeTeam.lw,gameResult.homeTeam.c,gameResult.homeTeam.rw,gameResult.homeTeam.d1,gameResult.homeTeam.d2,gameResult.homeTeam.g,gameResult.awayTeam.lw,gameResult.awayTeam.c,gameResult.awayTeam.rw,gameResult.awayTeam.d1,gameResult.awayTeam.d2,gameResult.awayTeam.g)
            const relevantGuys = await Promise.all(skaterIds.map(async(tokId) => {
                if(tokId > 0){
                 
                    let guy = await getPlayerFromToken(tokId,tonightsGames);
                    if(guy === false) throw new Error('🚦Er getting player from token🚦')
                    let dt = gameResult.date;
                  
                    let dateO = dateReader(dt);
     
                    let tot = await getPlayersPointsFromIdAndDate(guy.playerId, dateO, guy.rarity)
                    guy.inGame = gameId;
                    if(tot === false){
                        guy.points = 0;
                    }else{
                        guy.points = tot.total;
                    }
                   
                    if(tot){
                        guy.points = tot.total;
                    }else{
                        guy.points = 0;
                    }
                   
                    return guy;
                }else{
                    let copy = nobody;
                    copy.inGame = gameId;
                    copy.tokenId = 0;
                    return copy;
                }
            }))
            let teamCopy:Team = {
                lw:nobody,
                c:nobody,
                rw:nobody,
                d1:nobody,
                d2:nobody,
                g:nobody
            }
            let oppTeamCopy:Team = {
                lw:nobody,
                c:nobody,
                rw:nobody,
                d1:nobody,
                d2:nobody,
                g:nobody
            }
            if(userData === null || userData.userEmail === null) throw new Error('🚦No user data🚦');
            if(userData.userEmail === gameResult.homeEmail){
                // setGameState(GAMESTATES.observing);
                gameStateDispatch({type:'observingGame'})
                relevantGuys.forEach((dude) => {
                    if(dude.tokenId > 0){
                     
                        if(dude.tokenId === gameResult.homeTeam.lw){
                            teamCopy.lw = dude;
                            teamCopy.lw.inUse = 'lw';
                         
                        }
                        if(dude.tokenId === gameResult.homeTeam.c){
                            teamCopy.c = dude;
                            teamCopy.c.inUse = 'c';
                        }
                        if(dude.tokenId === gameResult.homeTeam.rw){
                            teamCopy.rw = dude;
                            teamCopy.rw.inUse = 'rw';
                        }
                        if(dude.tokenId === gameResult.homeTeam.d1){
                            teamCopy.d1 = dude;
                            teamCopy.d1.inUse = 'd1';
                        }
                        if(dude.tokenId === gameResult.homeTeam.d2){
                            teamCopy.d2 = dude;
                            teamCopy.d2.inUse = 'd2';
                        }
                        if(dude.tokenId === gameResult.homeTeam.g){
                            teamCopy.g = dude;
                            teamCopy.g.inUse = 'g';
                        }
                        if(dude.tokenId === gameResult.awayTeam.lw){
                            oppTeamCopy.lw = dude;
                            oppTeamCopy.lw.inUse = 'lw';
                        }
                        if(dude.tokenId === gameResult.awayTeam.c){
                            oppTeamCopy.c = dude;
                            oppTeamCopy.c.inUse = 'c';
                        }
                        if(dude.tokenId === gameResult.awayTeam.rw){
                            oppTeamCopy.rw = dude;
                            oppTeamCopy.rw.inUse = 'rw';
                        }
                        if(dude.tokenId === gameResult.awayTeam.d1){
                            oppTeamCopy.d1 = dude;
                            oppTeamCopy.d1.inUse = 'd1';
                        }
                        if(dude.tokenId === gameResult.awayTeam.d2){
                            oppTeamCopy.d2 = dude;
                            oppTeamCopy.d2.inUse = 'd2';
                        }
                        if(dude.tokenId === gameResult.awayTeam.g){
                            oppTeamCopy.g = dude;
                            oppTeamCopy.g.inUse = 'g';
                        }
                    }
                })
               
            }else{
                // USER IS AWAY, OR HASNT JOINED YET.
                if(gameResult.open === true){
                    gameStateDispatch({type:'inGame'})
                }else{
                    gameStateDispatch({type:'observingGame'})
                

                }
                
                relevantGuys.forEach((dude) => {
                    if(dude.tokenId > 0){
                     
                        if(dude.tokenId === gameResult.homeTeam.lw){
                            oppTeamCopy.lw = dude;
                            oppTeamCopy.lw.inUse = 'lw';
                        }
                        if(dude.tokenId === gameResult.homeTeam.c){
                            oppTeamCopy.c = dude;
                            oppTeamCopy.c.inUse = 'c';
                        }
                        if(dude.tokenId === gameResult.homeTeam.rw){
                            oppTeamCopy.rw = dude;
                            oppTeamCopy.rw.inUse = 'rw';
                        }
                        if(dude.tokenId === gameResult.homeTeam.d1){
                            oppTeamCopy.d1 = dude;
                            oppTeamCopy.d1.inUse = 'd1';
                        }
                        if(dude.tokenId === gameResult.homeTeam.d2){
                            oppTeamCopy.d2 = dude;
                            oppTeamCopy.d2.inUse = 'd2';
                        }
                        if(dude.tokenId === gameResult.homeTeam.g){
                            oppTeamCopy.g = dude;
                            oppTeamCopy.g.inUse = 'g';
                        }
                        if(dude.tokenId === gameResult.awayTeam.lw){
                            teamCopy.lw = dude;
                            teamCopy.lw.inUse = 'lw';
                        }
                        if(dude.tokenId === gameResult.awayTeam.c){
                            teamCopy.c = dude;
                            teamCopy.c.inUse = 'c';
                        }
                        if(dude.tokenId === gameResult.awayTeam.rw){
                            teamCopy.rw = dude;
                            teamCopy.rw.inUse = 'rw';
                        }
                        if(dude.tokenId === gameResult.awayTeam.d1){
                            teamCopy.d1 = dude;
                            teamCopy.d1.inUse = 'd1';
                        }
                        if(dude.tokenId === gameResult.awayTeam.d2){
                            teamCopy.d2 = dude;
                            teamCopy.d2.inUse = 'd2';
                        }
                        if(dude.tokenId === gameResult.awayTeam.g){
                            teamCopy.g = dude;
                            teamCopy.g.inUse = 'g';
                        }
                    }
                })
            }
            console.log("Getting game: ", gameResult);
            dashboardDispatch({type:'setTeams',payload:{game:gameResult, myTeam:teamCopy, oppTeam:oppTeamCopy}})
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
