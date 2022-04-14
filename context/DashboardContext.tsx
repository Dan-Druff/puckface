import { createContext, ReactNode, useContext, useReducer, useState, useRef } from "react";
import { db } from "../firebase/clientApp";
import {doc,getDoc,setDoc,collection,getDocs,updateDoc, arrayUnion} from 'firebase/firestore';
import { createRandomId,gameIsOver,makeTeam, getIpfsUrl } from "../utility/helpers";
import { DefAddToTradeArrayDB,DefJoinGameDB,nobody,baseURL, CardType, Stats,blankGame, blankTeam, Team,  TeamTokens,PostSignupReturnType,PostLoginReturnType,GameType, NoteType, DashboardType,DefDashDisp,DefPostLog,DefGetPlayersFromTokenArray,DefGetPacket,DefCreateGameDB, NHLGame,CalculatedGameType, LogActionType } from "../utility/constants";
import type { StringBool,DashDispatch,DashboardActions,NHLGamesArray, GamePosition, Rarity, PossibleGameStates } from "../utility/constants";
import { useNHL } from "./NHLContext";
import { useAuth } from "./AuthContext";
const playerMap = require('../utility/playerMap.json');
const TokenMap = require('../utility/TokenMap.json');


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
    getPacket:(email:string,tokens:number[]) => Promise<false | DashboardType>,
    availableGuys:DashboardType,
    currentGame:GameType,
    team:Team,
    oppTeam:Team,
    prevPlayer:CardType,
    createGameInDB:(game:GameType) => Promise<GameType | false>,
    joinGameInDB:() => Promise<GameType | false>,
    tradeArray:number[],
    addToTradeArrayDB:(tokenId:number) => Promise<boolean>
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
                    userId:rando,
                    tradeArray:[]
                })
            
                dName = email;
            }else{
                const r = await setDoc(doc(db,'users',email), {
                    cards:[],
                    pucks:0,
                    activeLeagues:[],
                    username:username,
                    activeGames:[],
                    userId:rando,
                    tradeArray:[]
                })
                dName = username;
            
            }
           await setDoc(doc(db,'transactions',email),{
                logs:[],
                transactions:[]
            })

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
export const getLobbyGames = async():Promise <GameType[] | false> => {
    try {
        const lobbySnapshot = await getDocs(collection(db,'lobbyGames'));
        let lobbyArray:GameType[] = [];
        lobbySnapshot.forEach((lobbygame) => {
            let g = lobbygame.data();
            if(g.open){
                let d = lobbygame.data();
                let obj:GameType = {
                    awayEmail:d.awayEmail,
                    awayName:d.awayName,
                    homeEmail:d.homeEmail,
                    homeName:d.homeName,
                    date:d.date.toDate(),
                    id:d.id,
                    value:d.value,
                    private:d.private,
                    open:d.open,
                    gameState:d.gameState,
                    homeTeam:d.homeTeam,
                    awayTeam:d.awayTeam
                }
                lobbyArray.push(obj);
            }
            // DO MY ACTIVE GAMES HERE???????? ----- ????????
            
        })
        return lobbyArray;
    } catch (er) {
        console.log("Error Lobby Games", er);
        return false;
    }
}
export const calculateGame = async(game:GameType, homeScore:number, awayScore:number):Promise <CalculatedGameType | false> => {
    try {
        console.log("CALCU:ATINGGGG:🌈🌈🌈 ")
        let gCopy = game;
        let winner = '';
        
        if(homeScore > awayScore){
            // home person wins, add pucks
            winner = 'home';
            const dbRef = doc(db,'users',game.homeEmail);
            const dbRes = await getDoc(dbRef);
            if(dbRes.exists()){
                const usrData = dbRes.data();
                let pks = usrData.pucks;
                let gv = game.value * 2;
                pks = pks + gv;

                const addToUserRef = await setDoc(doc(db,'users',game.homeEmail),{
                    pucks:pks
                },{ merge:true});

                
                

            }
        }
        if(awayScore > homeScore){
            // away team wins, add pucks
            winner = 'away';
            const dbRef = doc(db,'users',game.awayEmail);
            const dbRes = await getDoc(dbRef);
            if(dbRes.exists()){
                const usrData = dbRes.data();
                let pks = usrData.pucks;
                let gv = game.value * 2;
                pks = pks + gv;

                const addToUserRef = await setDoc(doc(db,'users',game.awayEmail),{
                    pucks:pks
                },{ merge:true});

                
                

            }
        }
        if(awayScore === homeScore){
            // game tied distributre evenly
            winner = 'tie';
            const homedbRef = doc(db,'users',game.homeEmail);
            const awaydbRef = doc(db,'users',game.awayEmail);
            const homeRes = await getDoc(homedbRef);
            const awayRes = await getDoc(awaydbRef);
            if(homeRes.exists() && awayRes.exists()){
                const homeData = homeRes.data();
                const awayData = awayRes.data();
                let homepks = homeData.pucks;
                let awaypks = awayData.pucks;
                let hv = homepks + game.value;
                let av = awaypks + game.value;
  

                const addToHomeRef = await setDoc(doc(db,'users',game.homeEmail),{
                    pucks:hv
                },{ merge:true});

                const addToAwayRef = await setDoc(doc(db,'users',game.awayEmail),{
                    pucks:av
                },{ merge:true});

                
                

            }
        }

        gCopy.gameState = 'Complete'
        gCopy.open = false;
        console.log("CALCU:ATINGGGG:🌈🌈🌈 : ");
        const addToGamesRef = await setDoc(doc(db,'lobbyGames',gCopy.id),{
            gameState:gCopy.gameState
        },{ merge:true});
        const calced:CalculatedGameType = {
            game:gCopy,
            winner:winner
        }
        return calced;
       
    } catch (er) {
        console.log("Calulate Erro: ", er);
        return false;
    }
}
export const logOnTheFire = async(log:LogActionType):Promise <boolean> => {
    try {
        // Do something to Log With here. DB solution????
        switch (log.type) {
            case 'buyCards':
                let bc = {
                    id:createRandomId(),
                    type:'buyCards',
                    cards:log.payload.cards,
                    when:log.payload.when
                }
                const lRef = doc(db,'transactions',log.payload.who);
                await updateDoc(lRef,{
                    transactions:arrayUnion(bc)
                })
                break;
            case 'buyPucks':
                let obj = {
                    id:createRandomId(),
                    type:'buyPucks',
                    howMany:log.payload.howMany,
                    when:log.payload.when
                }
                const logRef = doc(db,'transactions',log.payload.who);
                await updateDoc(logRef,{
                    transactions:arrayUnion(obj)
                })
                // await setDoc(doc(db,'transactions',log.payload.who),{
                //     transactions:obj
                // },{merge:true})
                console.log("LOGGING ON: BUY PUCKS");
                break;
            case 'completeGame':
                break;
            case 'createGame':
                break;
            case 'joinGame':
                break;                
        
            default:
                break;
        }
        return true;
    } catch (er) {
       console.log("Lon On The Fire Error"); 
       return false;
    }
}
export const getFreeAgents = async():Promise<any | false> => {
    try {
        const existing = doc(db,'freeAgents','cards');
        const exRes = await getDoc(existing);
        if(exRes.exists()){
            let agents = exRes.data();
            console.log("Arrays is: ", agents.array);
      
            return agents.array;
        }
      
    } catch (er) {
        console.log("Error: ", er);
        return false;
    }
    
}
export const addToFreeAgents = async(tokenArray:number[]):Promise <boolean> => {
    try {
        
        const upRes = await setDoc(doc(db,'freeAgents','cards'),{
            array:tokenArray
        },{merge:true})
        return true;

      
    } catch (er) {
        console.log("Error", er);
        return false;
    }
   
}
// ----------------------------- <MEAT AND POTOTOS> -----------------------------
const DashboardContext = createContext<AllDashType>({dashboard:[], pucks:0, dashboardDispatch:DefDashDisp,displayName:'NA',activeGames:[],activeLeagues:[],tokens:[],editing:false, notification:null, postLogin:DefPostLog, getPlayersFromTokenArray:DefGetPlayersFromTokenArray,getPacket:DefGetPacket, availableGuys:[], currentGame:blankGame, team:blankTeam, oppTeam:blankTeam, prevPlayer:nobody,createGameInDB:DefCreateGameDB,joinGameInDB:DefJoinGameDB,tradeArray:[],addToTradeArrayDB:DefAddToTradeArrayDB});

export const DashboardProvider = ({children}:{children:ReactNode}) => {
    const {tonightsGames} = useNHL();
    const {userData} = useAuth();
    const [pucks, setPucks] = useState<number>(0);
    const [displayName, setDisplayName] = useState<string>('NA');
    const [tokens,setTokens] = useState<number[]>([]);
    const [activeLeagues,setActiveLeagues] = useState<string[]>([]);
    const [activeGames,setActiveGames] = useState<GameType[]>([]);
    const [editing,setEditing] = useState<boolean>(false);
    const [notification,setNotification] = useState<NoteType | null>(null);
    const [availableGuys, setAvailableGuys] = useState<DashboardType>([]);
    const [currentGame, setCurrentGame] = useState<GameType>(blankGame);
    const [team,setTeam] = useState<Team>(blankTeam);
    const [oppTeam, setOppTeam] = useState<Team>(blankTeam);
    const [prevPlayer, setPrevPlayer] = useState<CardType>(nobody);
    const [tradeArray,setTradeArray] = useState<number[]>([]);
    const selectedPosition = useRef('');
    const cancelNotification = () => {
        setNotification(null);
    }

    function dashboardReducer(state:DashboardType, action:DashboardActions){
        switch (action.type) {
            case 'addToTradingBlock':
                setTradeArray([action.payload.tokenId,...tradeArray]);
                return state;
            case 'dashboard':
                setTeam(blankTeam);
                setCurrentGame(blankGame);
                setOppTeam(blankTeam);
                setPrevPlayer(nobody);
                setNotification(null);
                setEditing(false);
                return state;
            case 'error':
                const erObj:NoteType = {
                    cancelFunction:cancelNotification,
                    mainFunction:() => {},
                    mainTitle:'NA',
                    cancelTitle:'Got It',
                    twoButtons:false,
                    colorClass:'',
                    message:action.payload.er

                }
                setNotification(erObj);
                return state;
            case 'setTeams':
                let game = action.payload.game;
                let upDash = state.map((g) => {
                    if(g.tokenId === game.homeTeam.lw || g.tokenId === game.homeTeam.c || g.tokenId === game.homeTeam.rw || g.tokenId === game.homeTeam.d1 || g.tokenId === game.homeTeam.d2 || g.tokenId === game.homeTeam.g || g.tokenId === game.awayTeam.lw || g.tokenId === game.awayTeam.c || g.tokenId === game.awayTeam.rw || g.tokenId === game.awayTeam.d1 || g.tokenId === game.awayTeam.d2 || g.tokenId === game.awayTeam.g){
                        
                    }
                    // g.inGame = game.id;
                    return g;
                })
                setTeam(action.payload.myTeam);
                setOppTeam(action.payload.oppTeam);
                setCurrentGame(game);
                setEditing(false);
                return upDash;
            case 'joinGame':
              
                let y:NoteType = {
                    message:'Game has been set. Do some date calculations or something?',
                    twoButtons:false,
                    cancelFunction:cancelNotification,
                    cancelTitle:'GOT IT',
                    colorClass:'',
                    mainTitle:'',
                    mainFunction:() => {}

                }
                setPucks(pucks - action.payload.game.value);
                setCurrentGame(action.payload.game);
                setActiveGames([action.payload.game,...activeGames]);
                setNotification(y);
                return state;
            case 'calculatedGame':
            
                let note : NoteType = {
                    cancelFunction:cancelNotification,
                    mainFunction:cancelNotification,
                    cancelTitle:"Got It",
                    mainTitle:"Main",
                    twoButtons: false,
                    colorClass:'',
                    message:''
                }
                switch (action.payload.winner) {
                    case 'home':
                        note.message = `${action.payload.newGame.homeEmail} Wins $${action.payload.newGame.value}! `

               
                        break;
                    case 'away':
               
                        note.message = `${action.payload.newGame.awayEmail} Wins $${action.payload.newGame.value}! `

                        break;
                    case 'tie':
                        note.message = `Tie Game! Your pucks have been returned.`

                        break;        
                
                    default:
                        break;
                }
                setPucks(action.payload.newPucks);
                setCurrentGame(action.payload.newGame);
                setNotification(note);
                return state;
            case 'leavingGame':
                setTeam(blankTeam);
                setOppTeam(blankTeam);
                setPrevPlayer(nobody);
                setEditing(false);
                setNotification(null);
                setCurrentGame(blankGame);
                const newdash = state.map((g) => {
                    g.inUse = 'none';
                    return g;
                })
                return newdash;
            case 'createLobbyGame':
                setPucks(pucks - action.payload.game.value);
                setCurrentGame(action.payload.game);
                setActiveGames([action.payload.game, ...activeGames]);
                return state;
            case 'editPlayer':
                selectedPosition.current = action.payload.posId;
                let filt :DashboardType = [];
                
                switch (action.payload.posId) {
                    case 'lw':
                        filt = state.filter(g => g.pos === 'Left Wing' || g.pos === 'Center' || g.pos === 'Right Wing');

                        break;
                    case 'c':
                        filt = state.filter(g => g.pos === 'Left Wing' || g.pos === 'Center' || g.pos === 'Right Wing');

                        break;
                    case 'rw':
                        filt = state.filter(g => g.pos === 'Left Wing' || g.pos === 'Center' || g.pos === 'Right Wing');

                        break;
                    case 'd1':
                        filt = state.filter(g => g.pos === 'Defenseman');

                        break;
                    case 'd2':
                        filt = state.filter(g => g.pos === 'Defenseman');

                        break;
                    case 'g':
                        filt = state.filter(g => g.pos === 'Goalie');

                        break;
                    case 'none':
                        break;                        
                
                    default:
                        break;
                }
              
                setAvailableGuys(filt.filter(gy => gy.inGame === false));
                setPrevPlayer(action.payload.player);
                setEditing(true);
                
                return state;
            case 'cancelEdit':
                setAvailableGuys([]);
                setPrevPlayer(nobody);
                setEditing(false);
                return state;
            case 'selectPlayer':
                let selectedToken = action.payload.tokenId
                let gameId = action.payload.game.id;
                const newDashboard = state.map((guy) => {
                    if(guy.tokenId === selectedToken){
                        switch (selectedPosition.current) {
                            case 'lw':
                                guy.inUse = 'lw'
                                break;
                            case 'c':
                                guy.inUse = 'c'
                                break;
                            case 'rw':
                                guy.inUse = 'rw'
                                break;
                            case 'd1':
                                guy.inUse = 'd1'
                                break;
                            case 'd2':
                                guy.inUse = 'd2'
                                break;
                            case 'g':
                                guy.inUse = 'g'
                                break;
                            case 'none':
                                guy.inUse = 'none'
                                break;                    
                            default:
                                break;
                        }
                        // guy.inUse = selectedPosition.current;
                        guy.inGame = gameId;
                    }else{
                        guy.inUse = 'none';
                    }
                    if(guy.tokenId === prevPlayer.tokenId){
                        guy.inUse = 'none';
                        guy.inGame = false;
                    }
                    return guy;
                })
                let newTeam = makeTeam(newDashboard,team);
                
                let teamC = {
                    lw:newTeam.lw.tokenId,
                    c:newTeam.c.tokenId,
                    rw:newTeam.rw.tokenId,
                    d1:newTeam.d1.tokenId,
                    d2:newTeam.d2.tokenId,
                    g:newTeam.g.tokenId
                }
                let cc = currentGame;
                if(userData === null || userData.userEmail === null) throw new Error('🚦user data errror🚦');
                if(userData.userEmail === action.payload.game.homeEmail){
                    // User is home
                  
                   cc.homeTeam = teamC;
                   
             
                }else{
                    cc.awayTeam = teamC;
                }
                setCurrentGame(cc);
                setTeam(newTeam);
                setPrevPlayer(nobody);
                setEditing(false);
                return newDashboard;
            case 'clear':
                setCurrentGame(blankGame);
                setTeam(blankTeam);
                setPrevPlayer(nobody);
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
                setTradeArray(action.payload.dbData.tradeArray);
                setAvailableGuys([]);
                setNotification(null)
                setOppTeam(blankTeam);
                setTeam(blankTeam);
                setCurrentGame(blankGame)
                setPrevPlayer(nobody);
                setDisplayName(action.payload.displayName);
                setPucks(action.payload.dbData.pucks);
                setActiveGames(action.payload.games);
                setTokens(action.payload.dbData.cards);
                setEditing(false);
                setActiveLeagues(action.payload.dbData.activeLeagues);
                setDisplayName(action.payload.displayName)
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
                setPucks(pucks + action.payload.amount);
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
                tonightsGames.forEach((game:NHLGame) => {
                           playingTeams.push(game.awayName);
                           playingTeams.push(game.homeName);
                });
                       // Create array of player objects
                       const dashboardPromises = await Promise.all(dbdata.cards.map(async(token:number) => {
                           // I have the integer of the token. 
               
                           // Determine if card is in an active game. If so set inuse position and ingameID
                           let inUse:GamePosition = 'none';
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
                        //    let url = baseURL + token.toString() + '.json';
                           let url = getIpfsUrl('json',token);
                         
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
                                image:getIpfsUrl('png',token),
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
                               username:dbdata.username,
                               tradeArray:dbdata.tradeArray
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
                let inUse:GamePosition = 'none';
                let inGame: StringBool = false;
                activeGames.forEach((gme:GameType) => {
                    if(gme.awayTeam.lw === token){
                        inUse = 'lw';
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.c === token){
                        inUse = 'c';
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.rw === token){
                        inUse = 'rw';
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.d1 === token){
                        inUse = 'd1';
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.d2 === token){
                        inUse = 'd2';
                        inGame = gme.id;
                    }
                    if(gme.awayTeam.g === token){
                        inUse = 'g';
                        inGame = gme.id;
                    }
                    if(gme.homeTeam.lw === token){
                        inUse = 'lw';

                        inGame = gme.id;
                    }
                    if(gme.homeTeam.c === token){
                        inUse = 'c';

                        inGame = gme.id;
                    }
                    if(gme.homeTeam.rw === token){
                        inUse = 'rw';

                        inGame = gme.id;
                    }
                    if(gme.homeTeam.d1 === token){
                        inUse = 'd1';

                        inGame = gme.id;
                    }
                    if(gme.homeTeam.d2 === token){
                        inUse = 'd2';
                        inGame = gme.id;
                    }
                    if(gme.homeTeam.g === token){
                        inUse = 'g';

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
                // let url = baseURL + token.toString() + '.json';
                let url = getIpfsUrl('json',token);                                
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
                    image:getIpfsUrl('png',token),
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
                rando = TokenMap.forwards[Math.floor(Math.random() * TokenMap.forwards.length)];
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
                rando = TokenMap.defense[Math.floor(Math.random() * TokenMap.defense.length)];
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
                rando = TokenMap.goalies[Math.floor(Math.random() * TokenMap.goalies.length)];
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
                        rando = TokenMap.forwards[Math.floor(Math.random() * TokenMap.forwards.length)];
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
                        rando = TokenMap.defense[Math.floor(Math.random() * TokenMap.defense.length)];
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
                        rando = TokenMap.goalies[Math.floor(Math.random() * TokenMap.goalies.length)];
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
    const createGameInDB = async(game:GameType):Promise <GameType | false>  => {
        try {
            const ref = await setDoc(doc(db,'lobbyGames', game.id),{
                awayEmail:game.awayEmail,
                awayName:game.awayName,
                homeEmail:game.homeEmail,
                homeName:displayName,
                date:game.date,
                id:game.id,
                value:game.value,
                private:game.private,
                homeTeam:game.homeTeam,
                awayTeam:game.awayTeam,
                open:game.open,
                gameState:game.gameState
            })  
            let h:string[] = [];
            activeGames.forEach((game) => {
                h.push(game.id);
            })
            let puckAmt = pucks - game.value;
            const userRes = await setDoc(doc(db,'users',game.homeEmail),{
                pucks:puckAmt,
                activeGames:[...h, game.id]
            },{ merge: true });
            let k = {
                awayEmail:game.awayEmail,
                awayName:game.awayName,
                homeEmail:game.homeEmail,
                homeName:displayName,
                date:game.date,
                id:game.id,
                value:game.value,
                private:game.private,
                homeTeam:game.homeTeam,
                awayTeam:game.awayTeam,
                open:game.open,
                gameState:game.gameState
            }
            // setActiveGames([...activeGames,k]);
            
            return k;
        } catch (e) {
            console.log("Erroro: ", e);
            return false;
        }
    }  
    const joinGameInDB = async():Promise <GameType | false> => {
        try {
            if(pucks < currentGame.value) throw new Error('🚦Not enough pucks to Join🚦')
            if(userData === null || userData.userEmail === null) throw new Error('🚦No User Dara🚦');
            const joinRef = await setDoc(doc(db,'lobbyGames',currentGame.id),{
                awayEmail:userData.userEmail,
                awayName:displayName,
                homeEmail:currentGame.homeEmail,
                homeName:currentGame.homeName,
                date:currentGame.date,
                id:currentGame.id,
                value:currentGame.value,
                private:currentGame.private,
                homeTeam:currentGame.homeTeam,
                awayTeam:currentGame.awayTeam,
                open:false,
                gameState:'Waiting for Game'
            })
            const upd:GameType = {
                awayEmail:userData.userEmail,
                awayName:displayName,
                homeEmail:currentGame.homeEmail,
                homeName:currentGame.homeName,
                date:currentGame.date,
                id:currentGame.id,
                value:currentGame.value,
                private:currentGame.private,
                homeTeam:currentGame.homeTeam,
                awayTeam:currentGame.awayTeam,
                open:false,
                gameState:'Waiting for Game'
            }
    
            const ref = doc(db,'users',userData.userEmail);
            const res = await getDoc(ref);
            let gameIds:string[] = [];
            if(res.exists()){
                const da = res.data();
                gameIds = da.activeGames;
                
            }
            gameIds.push(upd.id);
            console.log("GAME iDS: ", gameIds);
            let newAmount = pucks - currentGame.value;
            const addToUserRef = await setDoc(doc(db,'users',userData.userEmail),{
                activeGames:gameIds,
                pucks:newAmount
            },{ merge:true});
            return upd;
        } catch (e) {
            console.log("Error joining", e);
            return false;
        }
    }
    const addToTradeArrayDB = async(tokenId:number):Promise<boolean> => {
        try {
            let na: number[] = [...tradeArray,tokenId];
           
            if(userData === null || userData.userEmail === null) throw new Error('🚦No User Dara🚦');
            const updateTradeArrayRef = doc(db,'users',userData.userEmail);
            await updateDoc(updateTradeArrayRef,{
                tradeArray:na
            })
            return true;

            // await setDoc(doc(db,'users',userData.userEmail),{
            //     tradeArray:[tokenId]
            // },{merge:true});
            // return true;
        } catch (er) {
            console.log("Error adding to tradearray")
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
        getPacket:getPacket,
        availableGuys:availableGuys,
        currentGame:currentGame,
        team:team,
        oppTeam:oppTeam,
        prevPlayer:prevPlayer,
        createGameInDB:createGameInDB,
        joinGameInDB:joinGameInDB,
        tradeArray:tradeArray,
        addToTradeArrayDB:addToTradeArrayDB
    }
    return (
        <DashboardContext.Provider value={allVal}>{children}</DashboardContext.Provider>
    )
}
export function useDashboard(){
    return useContext(DashboardContext);
}