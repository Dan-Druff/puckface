import {createContext, useReducer, useContext} from 'react';
import type { ReactNode } from 'react';
import type { GameStateActions, GameState,GameStateDispatch } from '../utility/constants';
import { defaultState } from '../utility/constants';

const GameStateContext = createContext<{gameState:GameState;gameStateDispatch:GameStateDispatch} | undefined>(undefined);

function gameStateReducer(state:GameState,action:GameStateActions){

    switch (action.type) {
        case 'inGame':
            state.main = 'none';
            state.sub = 'inGame';
            return state;
        case 'observingGame':
            state.main = 'none';
            state.sub = 'observing';
            return state;
        case 'home':
            state.main = 'none';
            state.sub = 'none';
            return state;
        case 'dashboard':
            state.main = 'dashboard';
            state.sub = 'dashboard';
            return state;
        case 'leagues':
            state.main = 'leagues';
            return state;
        case 'lobby':
            state.main = 'lobby';
            state.sub = 'lobby';
            return state;
        case 'profile':
            state.main = 'profile';
            state.sub = 'profile';
            return state;  
        case 'freeAgents':
            state.sub = 'freeAgents';
            return state;
        case 'lockerroom':
            state.sub = 'lockerroom';
            return state;
        case 'store':
            state.main = 'none'
            state.sub = 'store';
            return state;
        case 'tradingBlock':
            state.sub = 'tradingBlock';
            state.main = 'none'
            return state;     
        case 'createGame':
            state.main = 'lobby';
            state.sub = 'createGame';
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