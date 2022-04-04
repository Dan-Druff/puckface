import { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { db } from "../firebase/clientApp";
import {doc,getDoc,setDoc} from 'firebase/firestore';
import { createRandomId } from "../utility/helpers";
export type DashDispatch = (action:DashboardActions) => void;
export enum Rarity {
    Standard = "Standard",
    Rare = "Rare",
    Super_Rare = "Super Rare",
    Unique = "Unique"
}
export enum GamePosition {
    NONE = "na",
    LW = "lw",
    C = "c",
    RW = "rw",
    D1 = "d1",
    D2 = "d2",
    G = "g"
}
export enum GameStates {
    waitForOpp = "Waiting for Opponent",
    waitForGame = "Waiting for Game",
    complete = "Completed"
}
type StringBool = string | boolean;
export interface Stats {
    goals:number;
    assists:number;
    plusMinus:number;
    wins:number;
    shutouts:number;
}
export interface CardType {
    playerName: string;
    playerId: string;
    tokenId: number;
    image:string;
    points:number;
    playingTonight: boolean;
    stats: Stats;
    rarity: Rarity;
    pos:GamePosition;
    inGame:StringBool;
    inUse:StringBool;
  

}
export interface TeamTokens {
    lw:number,
    c:number,
    rw:number,
    d1:number,
    d2:number,
    g:number
}
export interface GameType {
    awayEmail:string,
    awayName:string,
    homeEmail:string,
    homeName:string,
    date:Date,
    id:string,
    value:number,
    private:boolean,
    open:boolean,
    gameState:GameStates,
    homeTeam:TeamTokens,
    awayTeam:TeamTokens

}
export type DashboardActions = {type:'cancelNotify'} | {type:'notify',payload:{notObj:NoteType}} | {type:'clear'} | {type:'create'} | {type:'login',payload:{displayName:string, dash:DashboardType,games:GameType[],dbData:any}} | {type:'signup',payload:{displayName:string,id:string}}

export interface NoteType {
    colorClass:string,
    message:string,
    twoButtons:boolean,
    mainTitle:string,
    cancelTitle:string,
    mainFunction:() => void,
    cancelFunction:() => void;
}
export type DashboardType = CardType[];

const DefDashDisp = (action:DashboardActions) => {
    console.log("DEF DASH DISPATCH",action.type);
}

export interface AllDashType {
    dashboard:DashboardType,
    pucks:number,
    displayName:string,
    tokens:number[],
    activeLeagues:string[],
    activeGames:GameType[],
    editing:boolean,
    dashboardDispatch:DashDispatch,
    notification:NoteType | null 
}
const DashboardContext = createContext<AllDashType>({dashboard:[], pucks:0, dashboardDispatch:DefDashDisp,displayName:'NA',activeGames:[],activeLeagues:[],tokens:[],editing:false, notification:null});



export const DashboardProvider = ({children}:{children:ReactNode}) => {

    const [pucks, setPucks] = useState<number>(0);
    const [displayName, setDisplayName] = useState<string>('NA');
    const [tokens,setTokens] = useState<number[]>([]);
    const [activeLeagues,setActiveLeagues] = useState<string[]>([]);
    const [activeGames,setActiveGames] = useState<GameType[]>([]);
    const [editing,setEditing] = useState<boolean>(false);
    const [notification,setNotification] = useState<NoteType | null>(null);
    function dashboardReducer(state:DashboardType, action:DashboardActions){
        switch (action.type) {
            case 'clear':
                setPucks(0);
                setActiveGames([]);
                setActiveLeagues([]);
                setDisplayName('NA');
                setTokens([]);
                setEditing(false);
                return [];
            case 'create':
                return state;
            case 'login':
                setDisplayName(action.payload.displayName);
                setPucks(action.payload.dbData.pucks);
                setActiveGames(action.payload.games);
                setTokens(action.payload.dbData.cards);
                setEditing(false);
                setActiveLeagues(action.payload.dbData.activeLeagues);
                return action.payload.dash;
            case 'signup':
                const dispName = action.payload.displayName;
                const id = action.payload.id;
                setDisplayName(dispName);
                setTokens([]);
                setPucks(0);
                setActiveLeagues([]);
                setActiveGames([]);
                setEditing(false);
                return state;   
            case 'notify':
                setNotification(action.payload.notObj);
                return state;   
            case 'cancelNotify':
                setNotification(null);
                return state;
            default:
                return state;
        }
    }
    const [dashboard, dashboardDispatch] = useReducer(dashboardReducer, []);
    let allVal = {
        dashboard:dashboard,
        pucks:pucks,
        displayName:displayName,
        tokens:tokens,
        activeGames:activeGames,
        activeLeagues:activeLeagues,
        editing:editing,
        dashboardDispatch:dashboardDispatch,
        notification:notification
    }
    return (
        <DashboardContext.Provider value={allVal}>{children}</DashboardContext.Provider>
    )
}
export function useDashboard(){
    return useContext(DashboardContext);
}