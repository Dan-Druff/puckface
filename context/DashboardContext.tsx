import { createContext, ReactNode, useContext, useReducer, useState } from "react";
import { db } from "../firebase/clientApp";
import {doc,getDoc,setDoc} from 'firebase/firestore';
import { createRandomId,gameIsOver } from "../utility/helpers";
import { baseURL } from "../utility/constants";
import type { NHLGamesArray } from "../utility/helpers";
import { useNHL } from "./NHLContext";
const playerMap = require('../utility/playerMap.json');
interface PostSignupReturnType {
    displayName:string,
    id:string
}
interface PostLoginReturnType {
    dashboardPromises:DashboardType,
    dataFromDB:{
        pucks:number,
        username:string,
        cards:number[],
        activeGames:string[],
        activeLeagues:string[],
        userId:string
    },
    activeGames:GameType[]
}
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
export type DashboardActions = {type:'addPack',payload:{guys:DashboardType, newPucks:number}} | {type:'addPucks',payload:{amount:number}} | {type:'cancelNotify'} | {type:'notify',payload:{notObj:NoteType}} | {type:'clear'} | {type:'create'} | {type:'login',payload:{displayName:string, dash:DashboardType,games:GameType[],dbData:any}} | {type:'signup',payload:{displayName:string,id:string}}

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
const DefPostLog = async(email:string):Promise <false | PostLoginReturnType> => {
    return false;
}
const DefGetPlayersFromTokenArray = async(tokenArray:number[]):Promise<DashboardType | false> => {
    return false;
}
const DefGetPacket = async(email:string,tokens:number[]):Promise <false | DashboardType> => {
    return false;
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
    notification:NoteType | null,
    postLogin:(email:string) => Promise<false | PostLoginReturnType>,
    getPlayersFromTokenArray:(tokenArray:number[]) => Promise<DashboardType | false>,
    getPacket:(email:string,tokens:number[]) => Promise<false | DashboardType>
}
// -----------------------------Types UP ^------------------------------
// FUNCTIONS THAT DONT NEED STATE--------------------
export const getGame = async(gameId:string):Promise<GameType | false> => {
    try {
        const gameRef = doc(db,'lobbyGames',gameId);
        const gameResult = await getDoc(gameRef);
        if(gameResult.exists()){
            const unwrapped = gameResult.data();
            return {
                awayEmail:unwrapped.awayEmail,
                awayName:unwrapped.awayName,
                homeEmail:unwrapped.homeEmail,
                homeName:unwrapped.homeName,
                date:unwrapped.date.toDate(),
                id:unwrapped.id,
                value:unwrapped.value,
                private:unwrapped.private,
                open:unwrapped.open,
                gameState:unwrapped.gameState,
                homeTeam:unwrapped.homeTeam,
                awayTeam:unwrapped.awayTeam
            };
        }else{
            throw new Error('🚦Game Res Dosnt Exist🚦');
        }
    } catch (e) {
        console.log("Get Game Error: ", e);
        return false;
    }
}
export const postSignup = async(email:string, username:string):Promise<false | PostSignupReturnType> => {
    try {
        let dName = '';
        let rando = createRandomId();
            if(username === 'googlesignin'){
                const r = await setDoc(doc(db,'users',email), {
                    cards:[],
                    pucks:0,
                    activeLeagues:[],
                    username:email,
                    activeGames:[],
                    userId:rando
                })
            
                dName = email;
            }else{
                const r = await setDoc(doc(db,'users',email), {
                    cards:[],
                    pucks:0,
                    activeLeagues:[],
                    username:username,
                    activeGames:[],
                    userId:rando
                })
                dName = username;
            
            }
           return {
               displayName:dName,
               id:rando
            };
    } catch (er) {
       console.log("Some Error: ", er); 
       return false;
    }
}
export const updateUsersPucksInDB = async(email:string,pucks:number):Promise<boolean> => {
    try {
        const userRes = await setDoc(doc(db,'users',email),{
            pucks:pucks
        },{ merge: true });
        return true;
    } catch (er) {
        console.log("UUPID ERROR: ", er);
        return false;
    }
}
export const getMinted = async():Promise<number[] | false> => {
    try {
        const ref = doc(db,'minted','cards');
        const res = await getDoc(ref);
        if(res.exists()){
            console.log("DOES this exisyt?");
            const da = res.data();

            return da.array;
        }else{
            throw new Error('🚦 Get Minted error 🚦');
        }
    } catch (e) {
        console.log("Errror: ", e);
        return false;
    }
}
export const updateMintedArray = async(mintedArray:number[],email:string,usersTokenArray:number[]):Promise <boolean> => {
    try {
        // set users token array
        const userRes = await setDoc(doc(db,'users',email),{
            cards:usersTokenArray
        },{ merge: true });
        // set minted tokens array
        const mintedRes = await setDoc(doc(db,'minted','cards'),{
            array:mintedArray
        })
        return true;
    } catch (e) {
        console.log("Update Mint Array Error: ", e);
        return false;

    }
}
export const buyPucks = async(amount:number, email:string):Promise <boolean> => {
    try {
        const userRes = await setDoc(doc(db,'users',email),{
            pucks:amount
        },{ merge: true });
        return true;
    } catch (er) {
        console.log("Error: ", er);
        return false;
    }
}


// ----------------------------- <MEAT AND POTOTOS> -----------------------------
const DashboardContext = createContext<AllDashType>({dashboard:[], pucks:0, dashboardDispatch:DefDashDisp,displayName:'NA',activeGames:[],activeLeagues:[],tokens:[],editing:false, notification:null, postLogin:DefPostLog, getPlayersFromTokenArray:DefGetPlayersFromTokenArray,getPacket:DefGetPacket});



export const DashboardProvider = ({children}:{children:ReactNode}) => {
    const {tonightsGames} = useNHL();
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
            case 'addPucks':
                setPucks(action.payload.amount);
                return state;
            case 'addPack':
                setPucks(action.payload.newPucks);
                return [...action.payload.guys, ...state];    
                default:
                return state;
        }
    }
    const [dashboard, dashboardDispatch] = useReducer(dashboardReducer, []);
    const postLogin = async(email:string):Promise <false | PostLoginReturnType> => {
        try {
                   // Get USER Info from DB
                   const dbRef = doc(db,'users',email);
                   const dbRes = await getDoc(dbRef);
                   if(dbRes.exists()){
                       const dbdata = dbRes.data();
                       // Need to populate activeGames array from the activeGames array from db
                       const gameObjectArray = await Promise.all(dbdata.activeGames.map(async(g:string) => {
                           let pGame = await getGame(g);
                        //    pGame.date = pGame.date.toDate();
                           console.log("Converted toDate",pGame);
                           return pGame;
                       }))
                    //    console.log("Got games from users card array: ",gameObjectArray);
                       // Create array of NHL team names that are playing tonight
                       let playingTeams: string[] = [];
                       tonightsGames.forEach((game) => {
                           playingTeams.push(game.awayName);
                           playingTeams.push(game.homeName);
                       });
                       // Create array of player objects
                       const dashboardPromises = await Promise.all(dbdata.cards.map(async(token:number) => {
                           // I have the integer of the token. 
               
                           // Determine if card is in an active game. If so set inuse position and ingameID
                           let inUse = false;
                           let inGame = false;
                         
                           gameObjectArray.forEach((gme) => {
                               // For each game in game array, see if this player is in it. If so, add id.
                               let over = gameIsOver(gme);
                               console.log("Is game over??: ");
                               if(!over){
                                   if(gme.awayTeam.lw === token){
                                       // inUse = 'lw';
           
                                       inGame = gme.id;
                                   }
                                   if(gme.awayTeam.c === token){
                                       // inUse = 'c';
                                       inGame = gme.id;
                                   }
                                   if(gme.awayTeam.rw === token){
                                       // inUse = 'rw';
                                       inGame = gme.id;
                                   }
                                   if(gme.awayTeam.d1 === token){
                                       // inUse = 'd1';
                                       inGame = gme.id;
                                   }
                                   if(gme.awayTeam.d2 === token){
                                       // inUse = 'd2';
                                       inGame = gme.id;
                                   }
                                   if(gme.awayTeam.g === token){
                                       // inUse = 'g';
                                       inGame = gme.id;
                                   }
                                   if(gme.homeTeam.lw === token){
                                       // inUse = 'lw';
                                       inGame = gme.id;
                                   }
                                   if(gme.homeTeam.c === token){
                                       // inUse = 'c';
                                       inGame = gme.id;
                                   }
                                   if(gme.homeTeam.rw === token){
                                       // inUse = 'rw';
                                       inGame = gme.id;
                                   }
                                   if(gme.homeTeam.d1 === token){
                                       // inUse = 'd1';
                                       inGame = gme.id;
                                   }
                                   if(gme.homeTeam.d2 === token){
                                       // inUse = 'd2';
                                       inGame = gme.id;
                                   }
                                   if(gme.homeTeam.g === token){
                                       // inUse = 'g';
                                       inGame = gme.id;
                                   }
                               }
                         
                       
                           })
                           let goals = 0;
                           let assists = 0;
                           let plusMinus = 0;
                           let points = 0;
                           let wins = 0;
                           let shutouts = 0;
                           let active = false;
                           let url = baseURL + token.toString() + '.json';
                           // Get players json object
                           let data = await fetch(url);
                           let guy = await data.json();
           
                           let playerId = guy.attributes[3].value;
                           let pos = guy.attributes[0].value;
                           
                           let data2 = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=20212022`);
                           let playerStats = await data2.json();
                           let teamName = guy.attributes[1].value;
                           if(playingTeams.indexOf(teamName) > -1){
                               // this means the player is playing tonight
                               active = true;
                           }
                           if(playerStats.stats[0].splits[0] !== undefined){
                               plusMinus = playerStats.stats[0].splits[0].stat.plusMinus || playerStats.stats[0].splits[0].stat.plusMinus === typeof 'number' ? playerStats.stats[0].splits[0].stat.plusMinus : 0;
                               assists = playerStats.stats[0].splits[0].stat.assists || playerStats.stats[0].splits[0].stat.assists === typeof 'number' ? playerStats.stats[0].splits[0].stat.assists : 0;
                               wins = playerStats.stats[0].splits[0].stat.wins || playerStats.stats[0].splits[0].stat.wins === typeof 'number' ? playerStats.stats[0].splits[0].stat.wins : 0;
                               shutouts = playerStats.stats[0].splits[0].stat.shutouts || playerStats.stats[0].splits[0].stat.shutouts === typeof 'number' ? playerStats.stats[0].splits[0].stat.shutouts : 0;
                               points = playerStats.stats[0].splits[0].stat.points || playerStats.stats[0].splits[0].stat.points === typeof 'number' ? playerStats.stats[0].splits[0].stat.points : 0;
                               goals = playerStats.stats[0].splits[0].stat.goals || playerStats.stats[0].splits[0].stat.goals === typeof 'number' ? playerStats.stats[0].splits[0].stat.goals : 0;
                           }else{
                               console.log("Errror 263");
                               plusMinus = 0;
                               assists = 0;
                               wins = 0;
                               shutouts = 0;
                               points = 0;
                               goals = 0;
                           }
                           let player:CardType = {
                                tokenId:token,
                                image:guy.image,
                                playerId:playerId,
                                rarity:guy.attributes[2].value,
                                inUse:inUse,
                                playerName:guy.name,
                                points:points,
                                pos:pos,
                                playingTonight:active,
                                inGame:inGame,
                                stats:{
                                    wins:wins,
                                    shutouts:shutouts,
                                    goals:goals,
                                    assists:assists,
                                    plusMinus:plusMinus
                               }
                           }
                           return player;
           
           
           
           
           
                       }))
                       return {
                           dashboardPromises:dashboardPromises,
                           dataFromDB:{
                               cards:dbdata.cards,
                               pucks:dbdata.pucks,
                               userId:dbdata.userId,
                               activeGames:dbdata.activeGames,
                               activeLeagues:dbdata.activeLeagues,
                               username:dbdata.username
                            },
                            activeGames:gameObjectArray
                       };
                   }else{
                    
                       throw new Error('🚦DB Doesnt Exist🚦');
                   }
        } catch (er) {
           console.log("Some Error: ", er); 
           return false;
        }
    }
    const getPlayersFromTokenArray = async(tokenArray:number[]):Promise<DashboardType | false> => {
        try {
            let playingTeams: string[] = [];
            tonightsGames.forEach((game) => {
                playingTeams.push(game.awayName);
                playingTeams.push(game.homeName);
            });
            const packPromises = await Promise.all(tokenArray.map(async(token) => {
                // I have the integer of the token. 
    
                // Determine if card is in an active game. If so set inuse position and ingameID
                let inUse:StringBool = false;
                let inGame: StringBool = false;
                activeGames.forEach((gme:GameType) => {
                    if(gme.awayTeam.lw === token){
                        inUse = GamePosition.LW;
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.c === token){
                        inUse = GamePosition.C;
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.rw === token){
                        inUse = GamePosition.RW;
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.d1 === token){
                        inUse = GamePosition.D1;
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.d2 === token){
                        inUse = GamePosition.D2;
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.g === token){
                        inUse = GamePosition.G;
                        inGame = gme.id;
                    }
                    if(gme.homeTeam.lw === token){
                        inUse = GamePosition.LW;

                        inGame = gme.id;
                    }
                    if(gme.homeTeam.c === token){
                        inUse = GamePosition.C;

                        inGame = gme.id;
                    }
                    if(gme.homeTeam.rw === token){
                        inUse = GamePosition.RW;

                        inGame = gme.id;
                    }
                    if(gme.homeTeam.d1 === token){
                        inUse = GamePosition.D1;

                        inGame = gme.id;
                    }
                    if(gme.homeTeam.d2 === token){
                        inUse = GamePosition.D2;
                        inGame = gme.id;
                    }
                    if(gme.homeTeam.g === token){
                        inUse = GamePosition.G;

                        inGame = gme.id;
                    }
            
                })
                let goals = 0;
                let assists = 0;
                let plusMinus = 0;
                let points = 0;
                let wins = 0;
                let shutouts = 0;
                let active = false;
                let url = baseURL + token.toString() + '.json';
                // Get players json object
                let data = await fetch(url);
                let guy = await data.json();
    
                let playerId = guy.attributes[3].value;
                let pos = guy.attributes[0].value;
                
                let data2 = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=20212022`);
                let playerStats = await data2.json();
                let teamName = guy.attributes[1].value;
                if(playingTeams.indexOf(teamName) > -1){
                    // this means the player is playing tonight
                    active = true;
                }
                if(playerStats.stats[0].splits[0] !== undefined){
                    plusMinus = playerStats.stats[0].splits[0].stat.plusMinus || playerStats.stats[0].splits[0].stat.plusMinus === typeof 'number' ? playerStats.stats[0].splits[0].stat.plusMinus : 0;
                    assists = playerStats.stats[0].splits[0].stat.assists || playerStats.stats[0].splits[0].stat.assists === typeof 'number' ? playerStats.stats[0].splits[0].stat.assists : 0;
                    wins = playerStats.stats[0].splits[0].stat.wins || playerStats.stats[0].splits[0].stat.wins === typeof 'number' ? playerStats.stats[0].splits[0].stat.wins : 0;
                    shutouts = playerStats.stats[0].splits[0].stat.shutouts || playerStats.stats[0].splits[0].stat.shutouts === typeof 'number' ? playerStats.stats[0].splits[0].stat.shutouts : 0;
                    points = playerStats.stats[0].splits[0].stat.points || playerStats.stats[0].splits[0].stat.points === typeof 'number' ? playerStats.stats[0].splits[0].stat.points : 0;
                    goals = playerStats.stats[0].splits[0].stat.goals || playerStats.stats[0].splits[0].stat.goals === typeof 'number' ? playerStats.stats[0].splits[0].stat.goals : 0;
                }else{
                    console.log("Errror 263");
                    plusMinus = 0;
                    assists = 0;
                    wins = 0;
                    shutouts = 0;
                    points = 0;
                    goals = 0;
                }
                let player = {
                    tokenId:token,
                    image:guy.image,
                    playerId:playerId,
                    rarity:guy.attributes[2].value,
                    inUse:inUse,
                    playerName:guy.name,
                    points:points,
                    pos:pos,
                    playingTonight:active,
                    inGame:inGame,
                    stats:{
                        goals:goals,
                        assists:assists,
                        plusMinus:plusMinus,
                        wins:wins,
                        shutouts:shutouts
                    }
                }
                return player;
    
    
    
    
    
            }))
            // dashboardDispatch({type:DASHBOARD_ACTIONS.addPack,payload:{newGuys:packPromises}})
            return packPromises;
        } catch (e) {
            console.log("Error gettingp from t: ",e);
            return false;
        }
    }
    const getPacket = async(email:string,tokens:number[]):Promise<DashboardType | false> => {
        try {
            const minted = await getMinted();
            if (minted === false) throw new Error('🚦 get minted error 🚦');
            console.log("Got minted: ", minted);
            let f = 0;
            let d = 0;
            let g = 0;
            let r = 0;
            let pack:number[] = [];
            let mintedUpdate = minted;
            let rando = 0;
            let tempTokens = tokens;
            while(f < 3){
                rando = playerMap.forwards[Math.floor(Math.random() * playerMap.forwards.length)];
                if(minted.indexOf(rando) > -1){
                    // this id is used
                }else{
                    // ID good to go
                    pack.push(rando);
                    mintedUpdate.push(rando);
                   tempTokens.push(rando);
                    f++;
                }
            }
            while(d < 2){
                rando = playerMap.defense[Math.floor(Math.random() * playerMap.defense.length)];
                if(minted.indexOf(rando) > -1){
                    // this id is used
                }else{
                    // ID good to go
                    pack.push(rando);
                    mintedUpdate.push(rando);
                    tempTokens.push(rando);
    
                    d++;
                }
            }
            while(g < 1){
                rando = playerMap.goalies[Math.floor(Math.random() * playerMap.goalies.length)];
                if(minted.indexOf(rando) > -1){
                    // this id is used
                }else{
                    // ID good to go
                    pack.push(rando);
                    mintedUpdate.push(rando);
                    tempTokens.push(rando);
    
                    g++;
                }
            }
            while(r < 2){
                let possibleCharacters = 'dfg';
                let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                switch (randomCharacter) {
                    case 'f':
                        rando = playerMap.forwards[Math.floor(Math.random() * playerMap.forwards.length)];
                        if(minted.indexOf(rando) > -1){
                            // this id is used
                        }else{
                            // ID good to go
                            pack.push(rando);
                            mintedUpdate.push(rando);
                            tempTokens.push(rando);
    
                            r++;
                        }
                        break;
                    case 'd':
                        rando = playerMap.defense[Math.floor(Math.random() * playerMap.defense.length)];
                        if(minted.indexOf(rando) > -1){
                            // this id is used
                        }else{
                            // ID good to go
                            pack.push(rando);
                            mintedUpdate.push(rando);
                            tempTokens.push(rando);
    
                            r++;
                        }
                        break;
                    case 'g':
                        rando = playerMap.goalies[Math.floor(Math.random() * playerMap.goalies.length)];
                        if(minted.indexOf(rando) > -1){
                            // this id is used
                        }else{
                            // ID good to go
                            pack.push(rando);
                            mintedUpdate.push(rando);
                            tempTokens.push(rando);
    
                            r++;
                        }
                        break;
                
                    default:
                        break;
                }
           
            }
            await updateMintedArray(mintedUpdate, email, tempTokens)
            
            // const newPlayers = await makeDashboard(pack);
         
            const newPlayers = await getPlayersFromTokenArray(pack);
            // const newPlayers = await createDashboardFromDBdata(ob,tonightsGames);
            // dispatch({type:ACTIONS.addPack, payload:{newguys:newPlayers}});
    
    
            return newPlayers;
    
        } catch (e) {
            console.log("Is this the one ",e);
            return false;
        }
    }
    let allVal = {
        dashboard:dashboard,
        pucks:pucks,
        displayName:displayName,
        tokens:tokens,
        activeGames:activeGames,
        activeLeagues:activeLeagues,
        editing:editing,
        dashboardDispatch:dashboardDispatch,
        notification:notification,
        postLogin:postLogin,
        getPlayersFromTokenArray:getPlayersFromTokenArray,
        getPacket:getPacket
    }
    return (
        <DashboardContext.Provider value={allVal}>{children}</DashboardContext.Provider>
    )
}
export function useDashboard(){
    return useContext(DashboardContext);
}