// import { SetStateAction } from "react";
// ----------------- TYPES -------------------
export const defaultState = {main:'none',sub:'none'}
export type GameState = typeof defaultState
export type StringBool = string | boolean;
export type GamePosition = 'none' | 'lw' | 'rw' | 'c' | 'd1' | 'd2' | 'g'
export type Rarity = 'Standard' | 'Rare' | 'Super Rare' | 'Unique'
export type AskType = 'either' | 'sell' | 'trade';
export type GameStateDispatch = (action:GameStateActions) => void
export type PossibleGameStates = 'Waiting for Opponent' | 'Waiting for Game' | 'Complete' | 'Initialized'
export type NHLGamesArray = NHLGame[];
export type DashboardType = CardType[];
export type DashDispatch = (action:DashboardActions) => void;
// export type MessageTypeStrings = 'counterOffer' | 'declineOffer' | 'acceptOffer'
export type TxTypeStrings = 'signup' | 'buyPucks' | 'buyCards' | 'createGame' | 'joinGame' | 'winGame' | 'loseGame' | 'tieGame' | 'submitFreeAgent' | 'buyFreeAgent' | 'submitOffer' | 'acceptOffer' | 'counterOffer' | 'declineOffer' | 'createLeague' | 'joinLeague' | 'removeFreeAgent' | 'invitePlayer' | 'acceptInvite';
export type MsgTypeStrings = 'offer' | 'offerAccepted' | 'offerDeclined' | 'sold' | 'gameOverW' | 'gameOverL' | 'gameOverT' | 'gameJoined' | 'leagueJoined' | 'leagueInvite' | 'inviteDeclined' | 'inviteAccepted' | 'message';


// ---------------  ACTION TYPES -------------
export type GameStateActions = 
{type:'inspect'} | 
{type:'inGame'} | 
{type:'observingGame'} | 
{type:'createGame'} | 
{type:'home'} | 
{type:'dashboard'} | 
{type:'leagues'} | 
{type:'leagueId'} |
{type:'createLeague'} |
{type:'lobby'} | 
{type:'profile'} | 
{type:'lockerroom'} | 
{type:'tradingBlock'} | 
{type:'freeAgents'} | 
{type:'store'}

export type DashboardActions = 
{type:'boughtAgent',payload:{agent:FreeAgentType, card:CardType}} | 
{type:'addToTradingBlock',payload:{tokenIds:number[]}} | 
{type:'dashboard'} | {type:'error',payload:{er:string}} | 
{type:'setTeams',payload:{game:GameType, myTeam:Team, oppTeam:Team}} | 
{type:'joinGame',payload:{game:GameType}} | 
{type:'leavingGame'} | 
{type:'calculatedGame',payload:{newGame:GameType, newPucks:number, winner:string}} | 
{type:'createLobbyGame',payload:{game:GameType}} | 
{type:'editPlayer',payload:{posId:GamePosition, player:CardType}} | 
{type:'cancelEdit'} | {type:'selectPlayer',payload:{tokenId:number, game:GameType}} | 
{type:'addPack',payload:{guys:DashboardType, newPucks:number}} | 
{type:'addPucks',payload:{amount:number}} | 
{type:'cancelNotify'} | 
{type:'notify',payload:{notObj:NoteType}} | 
{type:'clear'} | 
{type:'create',payload:{activeGames:GameType[],dbData:any}} | 
{type:'login',payload:{messages:MessageType[],displayName:string, dash:DashboardType,games:GameType[],dbData:any}} | 
{type:'signup',payload:{displayName:string,id:string}} |
{type:'clearMessage',payload:{id:string}} |
{type:'acceptOffer',payload:{pucks:number, cards:CardType[], tokens:number[],removeToken:number}} |
{type:'removeAgent', payload:{tokenId:number}} | 
{type:'enterPuckEscrow',payload:{amount:number}} |
{type:'joinLeague',payload:{id:string}} | 
{type:'addFriend',payload:{friend:string}}

export type LogActionType = 
{type:'buyPucks',payload:{howMany:number, when:Date, who:string}} | 
{type:'buyCards',payload:{when:Date,cost:number,cards:number[],who:string}} | 
{type:'createGame',payload:{game:GameType}} | 
{type:'joinGame',payload:{game:GameType}} | 
{type:'completeGame',payload:{game:GameType}} |
{type:'sellCard',payload:{id:string,value:number,when:Date,by:string,tokenIds:number[],state:string}} |
{type:'tradeCard',payload:{}} |
{type:'sellOrTradeCard',payload:{}} |
{type:'buyFreeAgent',payload:{id:string, value:number, when:Date, tokenIds:number[],state:string, by:string, to:string}} |
{type:'freeAgentOffer',payload:{id:string,value:number, tokenIds:number[],when:Date,state:string, by:string, to:string}} |
{type:'declineFreeAgentOffer',payload:{id:string}} |
{type:'acceptedOffer',payload:{tokens:number[],value:number,regarding:string, by:string, from:string, id:string, when:Date}}

// ----------------- INTERFACES ------------------
export interface CalculatedGameType {
    game:GameType,
    winner:string
}
export interface PuckfaceDate {
    month:string,
    day:string,
    year:string,
    fullDate:string,
    monthNumber:number,
    yearNumber:number,
    dayNumber:number
}
export interface StatsReturnType {
    goals:number,
    assists:number,
    plusMinus:number,
    points:number,
    shutouts:number,
    wins:number,
    total:number,
}
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
    pos:string;
    inGame:StringBool;
    inUse:GamePosition;
  

}
export interface FreeAgentType {
    ask:AskType;
    by:string;
    tokenId:number;
    value:number;
    image:string;
    playerId:string;
    playerName:string;
    rarity:Rarity;
    pos:string;
    id:string;

}
export interface BubbleType {
    head:string,
    data:number
}
export interface InfoBubbleState {
    home:BubbleType,
    away:BubbleType,
    pot:BubbleType,
    options:BubbleType
}
export interface ToggleType {
    label:string,
    setToggle:(toggle:boolean) => void,
    toggle:boolean
}
export interface BuildABenchType {
    guys:DashboardType,
    dispatch:DashDispatch,
    prevPlayer:CardType,
    game:GameType,
}
export interface BuildOfferType {
    guys:DashboardType,
    add:(token:number) => void,
    remove:(token:number) => void,
    offeredTokens:number[],
    dismiss:() => void,
    doAdd:() => void
}
export interface BenchCardType {
    card:CardType,
    active:boolean,
    func:(posId:GamePosition, tokenId:number) => void,
    posId:GamePosition,
    avail:boolean
}
export interface OfferCardType {
    card:CardType,
    selected:boolean,
    func:(card:CardType) => void
}
export interface FreeAgentCardType {
    agent:FreeAgentType,
    setOffer:(agent:FreeAgentType) => void,
    user:string

}
export interface BlockCardType {
    agent:FreeAgentType,
    setOffer:(posId:GamePosition, tokenId:number) => void
    removeAgent:(tokenId:number) => void
}
export interface LoaderType {
    message:string
}
export interface ExplorerCard {
    card:CardType,
    image:string
}
export interface Team {
    lw:CardType,
    c:CardType,
    rw:CardType,
    d1:CardType,
    d2:CardType,
    g:CardType,
}
export interface NHLGame {
    awayId:number,
    homeId:number,
    awayName:string,
    awayRecord:string,
    homeName:string,
    homeRecord:string,
    description:string
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
    gameState:PossibleGameStates,
    homeTeam:TeamTokens,
    awayTeam:TeamTokens

}
export interface NoteType {
    colorClass:string,
    message:string,
    twoButtons:boolean,
    mainTitle:string,
    cancelTitle:string,
    mainFunction:() => void,
    cancelFunction:() => void;
}
export interface PostSignupReturnType {
    displayName:string,
    id:string
}
export interface MessageType {
    message:string,
    by:string,
    when:Date,
    type:MsgTypeStrings,
    value:number,
    tokens:number[],
    regarding:string,
    id:string,
    state:string,
    tx:boolean
}
export interface MessageCompType {
    msg:MessageType,
    accept:(msg:MessageType) => void,
    decline:(msg:MessageType) => void,
    counter:(msg:MessageType) => void,
    exit:(msg:MessageType) => void    
}
export interface PostLoginReturnType {
    dashboardPromises:DashboardType,
    dataFromDB:{
        pucks:number,
        username:string,
        cards:number[],
        activeGames:string[],
        activeLeagues:string[],
        userId:string,
        tradeArray:number[],
        friends:string[]
    },
    activeGames:GameType[],
    messages:MessageType[]
}
export interface TxType {
    by:string,
    from:string,
    to:string,
    id:string,
    regarding:string,
    state:string,
    tokens:number[],
    type:TxTypeStrings,
    value:number,
    when:Date,
    freeAgentToken?:number,
    tx:boolean,
    mBool?:boolean,
    mString?:string,
    mNum?:number
}
export interface TxCompType {
    tx:TxType  
}
export interface LeagueGame {
    awayEmail:string,
    awayName:string,
    homeEmail:string,
    homeName:string,
    date:Date,
    id:string,
    value:number,
    private:boolean,
    open:boolean,
    gameState:PossibleGameStates,
    homeTeam:TeamTokens,
    awayTeam:TeamTokens,
    winner:string,
    league:string
}
export interface LeagueTeam {
    teamName:string,
    owner:string,
    wins:number,
    losses:number,
    ties:number,
    schedule:LeagueGame[]
}
export interface LeagueFormData {
    name:string,
    startDate:Date,
    endDate:Date,
    numberOfTeams:number,
    open:boolean,
    playoffs:boolean,
    public:boolean,
    champValue:number,
    buyIn:number,
    perGame:number,
    coffer:number
}
export interface LeagueType {
    name:string,
    owner:string,
    id:string,
    created:Date,
    startDate:Date,
    endDate:Date,
    targetDate:Date,
    numberOfTeams:number,
    open:boolean,
    playoffs:boolean,
    public:boolean,
    champValue:number,
    buyIn:number,
    perGame:number,
    coffer:number,
    teams:LeagueTeam[],
    results:LeagueGame[],
    schedule:LeagueGame[]
}
// ---------------- GAME REALATED CONSTANTS------------------
export const blankGame:GameType = {awayEmail:'',awayName:'',awayTeam:{c:0,lw:0,rw:0,d1:0,d2:0,g:0},date:new Date(),gameState:'Initialized',homeEmail:'',homeName:'blank home',homeTeam:{c:0,lw:0,rw:0,d1:0,d2:0,g:0},id:'blank',open:true,private:false,value:0}
export const lw:CardType = {"playerName":"Def F","playerId":"31","tokenId":-1,"rarity":"Standard","pos":"lw","inUse":"none","image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};
export const c:CardType = {"playerName":"Def F","playerId":"31","tokenId":-2,"rarity":"Standard","pos":"c","inUse":"none","image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};
export const rw:CardType = {"playerName":"Def F","playerId":"31","tokenId":-3,"rarity":"Standard","pos":"rw","inUse":"none","image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};

export const d1:CardType = {"playerName":"Def D","playerId":"31","tokenId":-4,"rarity":"Standard","pos":"d1","inUse":"none","image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};
export const d2:CardType = {"playerName":"Def D","playerId":"31","tokenId":-6,"rarity":"Standard","pos":"d2","inUse":"none","image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};

export const g:CardType = {"playerName":"Def G","playerId":"31","tokenId":-5,"rarity":"Standard","pos":"g","inUse":"none","image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};
export const nobody:CardType = {"playerName":"Select Player","playerId":"31","tokenId":-7,"rarity":"Standard","pos":"none","inUse":"none","image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};

export const blankTeam: Team = {
    lw:lw,
    c:c,
    rw:rw,
    d1:d1,
    d2:d2,
    g:g
}
const wayne:CardType = {"playerName":"Wayne Gretzky","playerId":"99","tokenId":-10,"rarity":"Unique","pos":"Left Wing","inUse":"lw","image":"https://hamtronmedia.com/media/images/wayne.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0},"points":0,"playingTonight":false,"inGame":false};
const mario:CardType = {"playerName":"Mario Lemieux","playerId":"66","tokenId":-9,"rarity":"Unique","pos":"Center","inUse":"c","image":"https://hamtronmedia.com/media/images/mario.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0},"points":0,"playingTonight":false,"inGame":false};
const gordie:CardType = {"playerName":"Gordie Howe","playerId":"9","tokenId":-8,"rarity":"Unique","pos":"Right Wing","inUse":"rw","image":"https://hamtronmedia.com/media/images/gordie.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0},"points":0,"playingTonight":false,"inGame":false};
const bobby:CardType = {"playerName":"Bobby Orr","playerId":"4","tokenId":-7,"rarity":"Unique","pos":"Defenseman","inUse":"d1","image":"https://hamtronmedia.com/media/images/bobby.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0},"points":0,"playingTonight":false,"inGame":false};
const zdeno:CardType = {"playerName":"Zdeno Chara","playerId":"13","tokenId":-6,"rarity":"Unique","pos":"Defenseman","inUse":"d2","image":"https://hamtronmedia.com/media/images/zdeno.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0},"points":0,"playingTonight":false,"inGame":false};
const patrick:CardType = {"playerName":"Patrick Roy","playerId":"31","tokenId":-5,"rarity":"Unique","pos":"Goalie","inUse":"g","image":"https://hamtronmedia.com/media/images/patrick.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0},"points":0,"playingTonight":false,"inGame":false};
export const dreamTeam:CardType[] = [wayne, mario, gordie, zdeno, bobby, patrick];

// --------------------DEFAULT FUNCTIONS --------------------
export const DefDashDisp = (action:DashboardActions) => {
    console.log("DEF DASH DISPATCH",action.type);
}
export const DefPostLog = async(email:string):Promise <false | PostLoginReturnType> => {
    return false;
}
export const DefGetPlayersFromTokenArray = async(tokenArray:number[],games:GameType[]):Promise<DashboardType | false> => {
    return false;
}
export const DefGetPacket = async(email:string,tokens:number[]):Promise <false | DashboardType> => {
    return false;
}
export const DefCreateGameDB = async(game:GameType):Promise <GameType | false> => {
    return false;
}
export const DefJoinGameDB = async():Promise<GameType | false> => {
    return false;
}
export const DefAddToTradeArrayDB = async(tokenId:number):Promise<boolean> => {
    return false;
}
export const DefBuyFreeAgent = async(agent:FreeAgentType):Promise<boolean> => {
    return false;
}
//------------  ACTUAL CONSTANTS -----------
export const multipliers = {
    standard:1,
    rare:1.5,
    superRare:2,
    unique:3
}
export const baseURL = 'https://ipfs.io/ipfs/bafybeiedfdak44r7owq5ytvvgb6cywkpfcnhlauroqqlrr7ta3jt2yqhee/files/';
export const PRICE_PER_PACK = 18;