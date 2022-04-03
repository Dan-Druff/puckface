import React, {FunctionComponent} from 'react';
import { useRouter } from "next/router"
import styles from '../styles/All.module.css';
export type Pages = 'dashboard' | 'lobby' | 'profile' | 'leagues' | 'store' | 'login' | 'signup' | 'home' | 'freeAgents' | 'tradingBlock' | 'lockerroom'
// import {MainState,GameStateActions,useGameState} from '../context/GameState';
import type {GameStateDispatch,GameState, GameStateActions} from '../context/GameState';
import {useGameState} from '../context/GameState';
interface Props {

}
const Menus: FunctionComponent<Props> = () => {
    const {gameState, gameStateDispatch} = useGameState();
    console.log("State count is: ", gameState);
    const Router = useRouter();

    const routeAndPush = (page:Pages) => {
        switch (page) {
            case 'dashboard':
                gameStateDispatch({type:'dashboard'})

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
            default:
                break;                                
        }
    }
    return (
            <>
        
                <div className={styles.mainMenu}>
         

                    <button className={gameState.main === 'dashboard' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('dashboard')}>DASHBOARD</button>
                    <button className={gameState.main === 'leagues' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('leagues')}>LEAGUES</button>
                    <button className={gameState.main === 'lobby' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('lobby')}>LOBBY</button>
                    <button className={gameState.main === 'profile' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('profile')}>PROFILE</button>
        
                </div>
                <div className={styles.subMenu}>
                    <button className={gameState.sub === 'lockerroom' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('lockerroom')}>LOCKERROOM</button>
                    <button className={gameState.sub === 'tradingBlock' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('tradingBlock')}>TRADING BLOCK</button>
                    <button className={gameState.sub === 'freeAgents' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('freeAgents')}>FREE AGENTS</button>
                    <button className={gameState.sub === 'store' ? styles.navButtonSecondary : styles.navButton} onClick={() => routeAndPush('store')}>STORE</button>
                </div>
            </>
    )


}
export default Menus
