import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css'
import GameCard from '../../../components/GameCard'
import InfoBubble from '../../../components/InfoBubble'
import BuildABench from '../../../components/BuildABench'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useDashboard, calculateGame } from '../../../context/DashboardContext'
import { dateReader } from '../../../utility/helpers'
import { BubbleType, InfoBubbleState, CardType, nobody, GameStates } from '../../../utility/constants'
import { useGameState } from '../../../context/GameState'
import type {GamePosition} from '../../../utility/constants'
const Game: NextPage = () => {
    const {gameStateDispatch} = useGameState();
    const {userData} = useAuth();
    const {availableGuys, pucks, currentGame, team, oppTeam, dashboardDispatch,prevPlayer,editing} = useDashboard();
    const [iAmHost, setIAmHost] = useState<boolean>(false);
    const v = currentGame.value * 2;
    const [infoBubbles,setInfoBubbles] = useState<InfoBubbleState>({home:{head:'Home:',data:0},away:{head:'Away:',data:0},pot:{head:'Pot:',data:v},options:{head:'Options:',data:0}});
    const Router = useRouter();
    const {id} = Router.query;
    let homeScore = 0;
    let awayScore = 0;
    const selectPosition = (posId:GamePosition, tokenId:number) => {

        let player:CardType = nobody;
        switch (posId) {
            
            case 'c':
                player = team.c;
                break;
            case 'd1':
                player = team.d1;
                break;
            case 'd2':
                player = team.d2;
                break;
            case 'g':
                player = team.g;
                break;
            case 'lw':
                player = team.lw;
                break;                
            case 'rw':
                player = team.rw;
                break;
            case 'none':

                break;    
            default:
                break;
        }
        dashboardDispatch({type:'editPlayer',payload:{player:player,posId:posId}})
        console.log("Select Postition: ", posId, tokenId);
        // dashboardDispatch({type:DASHBOARD_ACTIONS.editPlayer,payload:{posId:posId,player:team[posId]}})
      
    }
    useEffect(() => {

        const initGame = async() => {
            try {
                let homeScore = 0;
                let awayScore = 0;
                let infoCop = {
                    home:infoBubbles.home,
                    away:infoBubbles.away,
                    pot:infoBubbles.pot,
                    options:infoBubbles.options
                };
                if(userData === null || userData.userEmail === null) throw new Error('🚦init game page err🚦');
                if(userData.userEmail === currentGame.homeEmail){
                    // setIAmHost(true);
                    infoCop.home.head = currentGame.homeName;
                    infoCop.away.head = currentGame.awayName;
                    homeScore = team.lw.points + team.c.points + team.rw.points + team.d1.points + team.d2.points + team.g.points;
                    awayScore = oppTeam.lw.points + oppTeam.c.points + oppTeam.rw.points + oppTeam.d1.points + oppTeam.d2.points + oppTeam.g.points;
            
                }else{
                    infoCop.home.head = currentGame.homeName;
                    infoCop.away.head = currentGame.awayName;
                    awayScore = team.lw.points + team.c.points + team.rw.points + team.d1.points + team.d2.points + team.g.points;
                    homeScore = oppTeam.lw.points + oppTeam.c.points + oppTeam.rw.points + oppTeam.d1.points + oppTeam.d2.points + oppTeam.g.points;
                }
               
                console.log("SCORES ARE:🤖 ", infoCop)
                infoCop.home.data = homeScore;
                infoCop.away.data = awayScore;
                console.log("SETTING INFO, UE: ", team);
                console.log("SETTING INFO, UE: ", oppTeam);
                let dob = {
                    year:0,
                    day:0,
                    month:0
                }
                let today = {
                    year:0,
                    day:0,
                    month:0
                }
                let gameFinished = false;
                let x = dateReader(currentGame.date);
                dob.year = x.yearNumber;
                dob.month = x.monthNumber;
                dob.day = x.dayNumber;
            
                let z = dateReader(new Date());
                today.year = z.yearNumber;
                today.month = z.monthNumber;
                today.day = z.dayNumber;
                console.log(dob,today);
                if(today.day > dob.day || today.month > dob.month || today.year > dob.year){
                    console.log("Game is finished:");
                    gameFinished = true;
                    gameStateDispatch({type:'observingGame'});
             
                }
            
                setInfoBubbles(infoCop);
                if(userData.userEmail === currentGame.homeEmail){
                    setIAmHost(true);
                }
                console.log("Whats gamwstate then???????>> ",currentGame);
                if(currentGame.gameState === GameStates.waitForGame && gameFinished){
                    const gameResult = await calculateGame(currentGame, homeScore, awayScore);
                    if (gameResult === false) throw new Error('🚦game result err🚦')
                    if(gameResult){
                        let newp = pucks;
                        switch (gameResult.winner) {
                            case 'home':
                                if(gameResult.game.homeEmail === userData.userEmail){
                                    let hval = gameResult.game.value * 2;
                                    newp = newp + hval;
                                }
                                break;
                            case 'away':
                                if(gameResult.game.awayEmail === userData.userEmail){
                                    let aval = gameResult.game.value * 2;
                                    newp = newp + aval;
                                }
                                break;
                            case 'tie':
                                newp = newp + gameResult.game.value;
                                // if(gameResult.game.homeEmail === userData.userEmail){
                                
                                //     newp = newp + gameResult.game.value;
                                // }
                                break;    
                        
                            default:
                                break;
                        }
                        dashboardDispatch({type:'calculatedGame',payload:{newGame:gameResult.game, newPucks:newp}});
                        return;
                    }
                }
                // If gameState = playingGame && if game Is over, Do a calulation to change state & release pucks
            
            } catch (er) {
                console.log("InitGame error: ", er);
                return;
            }
        }
        initGame();
        return () => {
        console.log("CLEANUP: 🤡🤡🤡")
        dashboardDispatch({type:'leavingGame'})
        }

    },[])
    return (
        <>
        {iAmHost ? 
        <div className={styles.gameContainer}>
                    <div className={styles.cardRow}>
                <InfoBubble bub={infoBubbles.pot} />
            <GameCard card={oppTeam.g} active={false} func={() => {}} posId={'lw'}/>
            <InfoBubble bub={infoBubbles.away} />
                    </div>
                    <div className={styles.cardRow}>
                    <GameCard card={oppTeam.d1} active={false} func={() => {}} posId={'d1'}/>
                    <GameCard card={oppTeam.d2} active={false} func={() => {}} posId={'d2'}/>
                    </div>
                    <div className={styles.cardRow}>
                    <GameCard card={oppTeam.rw} active={false} func={() => {}} posId={'rw'}/>
                    <GameCard card={oppTeam.c} active={false} func={() => {}} posId={'c'}/>
                    <GameCard card={oppTeam.lw} active={false} func={() => {}} posId={'lw'}/>
                    </div>
                    <div className={styles.cardRow}>
                    <GameCard card={team.rw} active={false} func={() => {}} posId={'rw'}/>
                    <GameCard card={team.c} active={false} func={() => {}} posId={'c'}/>
                    <GameCard card={team.lw} active={false} func={() => {}} posId={'lw'}/>
                    </div>
                    <div className={styles.cardRow}>
                    <GameCard card={team.d1} active={false} func={() => {}} posId={'d1'}/>
                    <GameCard card={team.d2} active={false} func={() => {}} posId={'d2'}/>
                    </div>
                    <div className={styles.cardRow}>
                    <InfoBubble bub={infoBubbles.options} />
                    <GameCard card={team.g} active={false} func={() => {}} posId={'g'}/>
                    <InfoBubble bub={infoBubbles.home} />
                    </div> 
        </div>
        :  
        <div className={styles.gameContainer}>
            {editing && <BuildABench guys={availableGuys} dispatch={dashboardDispatch} prevPlayer={prevPlayer} game={currentGame}/>}
                
                {currentGame.gameState === GameStates.waitForOpp ? 
                <>
                   <div className={styles.cardRow}>
                        <InfoBubble bub={infoBubbles.pot} />
                        <GameCard card={oppTeam.g} active={false} func={() => {}} posId={'g'}/>
                        <InfoBubble bub={infoBubbles.home} />
                    </div>
                    <div className={styles.cardRow}>
                        <GameCard card={oppTeam.d1} active={false} func={() => {}} posId={'d1'}/>
                        <GameCard card={oppTeam.d2} active={false} func={() => {}} posId={'d2'}/>
                    </div>
                    <div className={styles.cardRow}>
                        <GameCard card={oppTeam.rw} active={false} func={() => {}} posId={'rw'}/>
                        <GameCard card={oppTeam.c} active={false} func={() => {}} posId={'c'}/>
                        <GameCard card={oppTeam.lw} active={false} func={() => {}} posId={'lw'}/>
                    </div>
                    <div className={styles.cardRow}>
                        <GameCard card={team.lw} active={true} func={selectPosition} posId={'lw'}/>
                        <GameCard card={team.c} active={true} func={selectPosition} posId={'c'}/>
                        <GameCard card={team.rw} active={true} func={selectPosition} posId={'rw'}/>
                    </div>
                    <div className={styles.cardRow}>
                        <GameCard card={team.d1} active={true} func={selectPosition} posId={'d1'}/>
                        <GameCard card={team.d2} active={true} func={selectPosition} posId={'d2'}/>
                    </div>
                    <div className={styles.cardRow}>
                        <InfoBubble bub={infoBubbles.options} />
                        <GameCard card={team.g} active={true} func={selectPosition} posId={'g'}/>
                        <InfoBubble bub={infoBubbles.away} />
                    </div>
                </> 
                : 
                <>
                   <div className={styles.cardRow}>
                        <InfoBubble bub={infoBubbles.pot} />
                        <GameCard card={oppTeam.g} active={false} func={() => {}} posId={'g'}/>
                        <InfoBubble bub={infoBubbles.home} />
                    </div>
                    <div className={styles.cardRow}>
                        <GameCard card={oppTeam.d1} active={false} func={() => {}} posId={'d1'}/>
                        <GameCard card={oppTeam.d2} active={false} func={() => {}} posId={'d2'}/>
                    </div>
                    <div className={styles.cardRow}>
                        <GameCard card={oppTeam.rw} active={false} func={() => {}} posId={'rw'}/>
                        <GameCard card={oppTeam.c} active={false} func={() => {}} posId={'c'}/>
                        <GameCard card={oppTeam.lw} active={false} func={() => {}} posId={'lw'}/>
                    </div>
                    <div className={styles.cardRow}>
                        <GameCard card={team.lw} active={false} func={() => {}} posId={'lw'}/>
                        <GameCard card={team.c} active={false} func={() => {}} posId={'c'}/>
                        <GameCard card={team.rw} active={false} func={() => {}} posId={'rw'}/>
                    </div>
                    <div className={styles.cardRow}>
                        <GameCard card={team.d1} active={false} func={() => {}} posId={'d1'}/>
                        <GameCard card={team.d2} active={false} func={() => {}} posId={'d2'}/>
                    </div>
                    <div className={styles.cardRow}>
                        <InfoBubble bub={infoBubbles.options} />
                        <GameCard card={team.g} active={false} func={() => {}} posId={'g'}/>
                        <InfoBubble bub={infoBubbles.away} />
                    </div>
                </>
                }
                
     
        </div>
        }
        </>
        )
}
export default Game