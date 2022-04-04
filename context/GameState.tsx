import {createContext, useReducer, useContext} from 'react';
import type { ReactNode } from 'react';
export type GameStateActions = {type:'home'} | {type:'dashboard'} | {type:'leagues'} | {type:'lobby'} | {type:'profile'} | {type:'lockerroom'} | {type:'tradingBlock'} | {type:'freeAgents'} | {type:'store'}
const defaultState = {main:'none',sub:'none'}

export type GameState = typeof defaultState
export type GameStateDispatch = (action:GameStateActions) => void

const GameStateContext = createContext<{gameState:GameState;gameStateDispatch:GameStateDispatch} | undefined>(undefined);

function gameStateReducer(state:GameState,action:GameStateActions){

    switch (action.type) {
        case 'home':
            state.main = 'none';
            state.sub = 'none';
            return state;
        case 'dashboard':
            state.main = 'dashboard';
            state.sub = 'none';
            return state;
        case 'leagues':
            state.main = 'leagues';
            return state;
        case 'lobby':
            state.main = 'lobby';
            return state;
        case 'profile':
            state.main = 'profile';
            return state;  
        case 'freeAgents':
            state.sub = 'freeAgents';
            return state;
        case 'lockerroom':
            state.sub = 'lockerroom';
            return state;
        case 'store':
            state.sub = 'store';
            return state;
        case 'tradingBlock':
            state.sub = 'tradingBlock';
            return state;            
     }
}
export function GameStateProvider({children}:{children:ReactNode}){
    const [gameState, gameStateDispatch] = useReducer(gameStateReducer, defaultState)

    let gameVal = {
        gameState: gameState, 
        gameStateDispatch: gameStateDispatch
    }
    return (
        <GameStateContext.Provider value={gameVal}>{children}</GameStateContext.Provider>
    )
}

export function useGameState(){
    const context = useContext(GameStateContext)
    if(!context) throw new Error('🚦Must Be used in counter context🚦')
    return context; 
    

}