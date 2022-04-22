import React, {FunctionComponent} from 'react';
import { useRouter } from "next/router"
import styles from '../styles/All.module.css';
export type Pages = 'explorer' |'joinGame' | 'createGame' | 'dashboard' | 'lobby' | 'profile' | 'leagues' | 'store' | 'login' | 'signup' | 'home' | 'freeAgents' | 'tradingBlock' | 'lockerroom'
// import {MainState,GameStateActions,useGameState} from '../context/GameState';
// import type {GameStateDispatch,GameState, GameStateActions} from '../context/GameState';
import {useGameState} from '../context/GameState';
import {useAuth} from '../context/AuthContext';
import {useDashboard, puckfaceLog, sendMsgToUser} from '../context/DashboardContext';
import { MessageType, TxType } from '../utility/constants';
import { createRandomId, dateReader } from '../utility/helpers';
interface Props {

}
const Menus: FunctionComponent<Props> = () => {
    const {userData} = useAuth();
    const {gameState, gameStateDispatch} = useGameState();
    const {joinGameInDB, dashboardDispatch,currentGame} = useDashboard();
    console.log("State count is: ", gameState);
    const Router = useRouter();
    const joinGame = async() => {
        try {
            
            const res = await joinGameInDB();
            if(res === false) throw new Error('🚦Error Joinging Game🚦');
            const tx:TxType = {
                by:res.homeEmail,
                from:res.homeEmail,
                to:res.awayEmail,
                id:createRandomId(),
                regarding:res.id,
                state:'open',
                tokens:[res.awayTeam.c,res.awayTeam.lw,res.awayTeam.rw,res.awayTeam.d1,res.awayTeam.d2,res.awayTeam.g],
                tx:true,
                type:'joinGame',
                value:res.value,
                when:res.date,
                freeAgentToken:0
            }
            const l = await puckfaceLog(tx);
            const msg:MessageType = {
                by:res.awayEmail,
                id:createRandomId(),
                regarding:res.id,
                state:'open',
                tokens:[res.awayTeam.c,res.awayTeam.lw,res.awayTeam.rw,res.awayTeam.d1,res.awayTeam.d2,res.awayTeam.g],
                tx:false,
                type:'gameJoined',
                value:res.value,
                when:res.date,
                message:'I joined your game. Lets go!'
            }
            const m = await sendMsgToUser(msg,res.homeEmail);
            if(l === false || m === false){
                console.log("Error Logging Something...");
            }
            dashboardDispatch({type:'joinGame',payload:{game:res}})
            gameStateDispatch({type:'observingGame'})
            //join game
            return true;
        } catch (e) {
            // Show errror to user
            dashboardDispatch(({type:'error',payload:{er:"🚦Error Joining Game🚦"}}));
            console.log("Error joinging game: ",e);
            return false;
        }
    }

    const routeAndPush = (page:Pages) => {
        switch (page) {
            case 'explorer':
                Router.push('/explorer/3432')
                break;
            case 'joinGame':
                joinGame();
                break;
            case 'dashboard':
                gameStateDispatch({type:'dashboard'});
                dashboardDispatch({type:'dashboard'});
                Router.push('/dashboard');
                break;
            case 'home':
                gameStateDispatch({type:'home'})
                Router.push('/')
                break;
            case 'leagues':
                gameStateDispatch({type:'leagues'})

                Router.push('/leagues');
                break;
            case 'lobby':
                gameStateDispatch({type:'lobby'})
                Router.push('/lobby');
                break;
            case 'login':
                Router.push('/login');
                break;
            case 'profile':
                gameStateDispatch({type:'profile'})
                Router.push('/profile');
                break;
            case 'signup':
                Router.push('/signup');
                break;
            case 'store':
                gameStateDispatch({type:'store'})

                Router.push('/store');
                break;
            case 'freeAgents':
                gameStateDispatch({type:'freeAgents'})

                Router.push('/freeAgents');
                break;   
            case 'lockerroom':
                gameStateDispatch({type:'lockerroom'})

                Router.push('/lockerroom');
                break;   
            case 'tradingBlock':
                gameStateDispatch({type:'tradingBlock'})

                Router.push('/tradingBlock');
                break;     
            case 'createGame':
                gameStateDispatch({type:'createGame'});
                Router.push('./createGame');
                break;
                default:
                break;                                
        }
    }
    
    if(userData === null){
        return (
            <>
        
                <div className={styles.mainMenu}>
         

                    <button className={styles.navButton} onClick={() => routeAndPush('home')}>HOME</button>
                    <button className={styles.navButton} onClick={() => routeAndPush('explorer')}>EXPLORE</button>

                    <button className={styles.navButton} onClick={() => routeAndPush('signup')}>SIGNUP</button>
                    <button className={styles.navButton} onClick={() => routeAndPush('login')}>LOGIN</button>
        
                </div>
                <div className={styles.subMenu}>
                        <h2>PUCKFACE</h2>
                </div>
            </>
    )
    }else{
        let dateString = dateReader(currentGame.date);
        return (
            <>
        
                <div className={styles.mainMenu}>
         

                    <button className={gameState.main === 'dashboard' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('dashboard')}>DASHBOARD</button>
                    <button className={gameState.main === 'leagues' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('leagues')}>LEAGUES</button>
                    <button className={gameState.main === 'lobby' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('lobby')}>LOBBY</button>
                    <button className={gameState.main === 'profile' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('profile')}>PROFILE</button>
        
                </div>
                {gameState.sub === 'lobby' &&       
                    <div className={styles.subMenu}>
                        <button className={styles.navButton} onClick={() => routeAndPush('createGame')}>CREATE</button>
                        <button className={styles.navButton}>FREEROLL</button>
                    </div>
                }
                {gameState.sub === 'dashboard' && 
                    <div className={styles.subMenu}>
                        <button className={styles.navButton} onClick={() => routeAndPush('lockerroom')}>LOCKERROOM</button>
                        <button className={styles.navButton} onClick={() => routeAndPush('tradingBlock')}>TRADING BLOCK</button>
                        <button className={styles.navButton} onClick={() => routeAndPush('freeAgents')}>FREE AGENTS</button>
                        <button className={styles.navButton} onClick={() => routeAndPush('store')}>STORE</button>
                    </div>
                }
                {gameState.sub === 'createGame' &&  
                    <div className={styles.subMenu}>
                        <h2>Select Game Options:</h2>
                    </div>
                }
                {gameState.sub === 'observing' &&       
                    <div className={styles.subMenu}>
                        <h2>Observing: {dateString.fullDate}</h2>
                    </div>}
            
                {gameState.sub === 'inGame' &&         
                    <div className={styles.subMenu}>
                        <h2>Select Your Team:</h2>
                        <button className={styles.navButtonSecondary} onClick={() => routeAndPush('joinGame')}>SUBMIT TEAM</button>
                    </div>
                }
                 {gameState.sub === 'store' &&         
                    <div className={styles.subMenu}>
                        <h2>PuckFace Store</h2>
                    </div>
                }
                {gameState.sub === 'profile' &&
                    <div className={styles.subMenu}>
                        <h2>Puckface Profile:</h2>
                    </div>
                }
                {gameState.sub === 'lockerroom' &&
                     <div className={styles.subMenu}>
                     <button className={styles.navButtonSecondary} onClick={() => routeAndPush('lockerroom')}>LOCKERROOM</button>
                     <button className={styles.navButton} onClick={() => routeAndPush('tradingBlock')}>TRADING BLOCK</button>
                     <button className={styles.navButton} onClick={() => routeAndPush('freeAgents')}>FREE AGENTS</button>
                     <button className={styles.navButton} onClick={() => routeAndPush('store')}>STORE</button>
                 </div>
                }
                {gameState.sub === 'tradingBlock' &&  
                    <div className={styles.subMenu}>
                      <button className={styles.navButton} onClick={() => routeAndPush('lockerroom')}>LOCKERROOM</button>
                      <button className={styles.navButtonSecondary} onClick={() => routeAndPush('tradingBlock')}>TRADING BLOCK</button>
                      <button className={styles.navButton} onClick={() => routeAndPush('freeAgents')}>FREE AGENTS</button>
                      <button className={styles.navButton} onClick={() => routeAndPush('store')}>STORE</button>
                  </div>
                }
                {gameState.sub === 'freeAgents' &&  
                    <div className={styles.subMenu}>
                      <button className={styles.navButton} onClick={() => routeAndPush('lockerroom')}>LOCKERROOM</button>
                      <button className={styles.navButton} onClick={() => routeAndPush('tradingBlock')}>TRADING BLOCK</button>
                      <button className={styles.navButtonSecondary} onClick={() => routeAndPush('freeAgents')}>FREE AGENTS</button>
                      <button className={styles.navButton} onClick={() => routeAndPush('store')}>STORE</button>
                  </div>
                }
            </>
        )
    }
 


}
export default Menus
