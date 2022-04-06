
export const multipliers = {
    standard:1,
    rare:1.5,
    superRare:2,
    unique:3
}
export const baseURL = 'https://ipfs.io/ipfs/bafybeiedfdak44r7owq5ytvvgb6cywkpfcnhlauroqqlrr7ta3jt2yqhee/files/';

export const PRICE_PER_PACK = 18;
export type LobbyGameState = 'Waiting for Opponent' | 'Waiting for Game' | 'Game Complete'
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
export type StringBool = string | boolean;
export enum GamePosition {
    NONE = "na",
    LW = "lw",
    C = "c",
    RW = "rw",
    D1 = "d1",
    D2 = "d2",
    G = "g"
}
export enum Rarity {
    Standard = "Standard",
    Rare = "Rare",
    Super_Rare = "Super Rare",
    Unique = "Unique"
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
    inUse:GamePosition | false;
  

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
export interface BenchCardType {
    card:CardType,
    active:boolean,
    func:(posId:GamePosition, tokenId:number) => void,
    posId:GamePosition
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
export type NHLGamesArray = NHLGame[];
export enum GameStates {
    waitForOpp = "Waiting for Opponent",
    waitForGame = "Waiting for Game",
    complete = "Completed",
    init = "Initialized"
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
export type DashboardType = CardType[];

export interface PostLoginReturnType {
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
export type DashboardActions = {type:'createLobbyGame',payload:{game:GameType, newPucks:number}} | {type:'editPlayer',payload:{posId:GamePosition, player:CardType}} | {type:'cancelEdit'} | {type:'selectPlayer',payload:{tokenId:number, game:GameType}} | {type:'addPack',payload:{guys:DashboardType, newPucks:number}} | {type:'addPucks',payload:{amount:number}} | {type:'cancelNotify'} | {type:'notify',payload:{notObj:NoteType}} | {type:'clear'} | {type:'create',payload:{activeGames:GameType[],dbData:any}} | {type:'login',payload:{displayName:string, dash:DashboardType,games:GameType[],dbData:any}} | {type:'signup',payload:{displayName:string,id:string}}

export type DashDispatch = (action:DashboardActions) => void;

export const blankGame:GameType = {awayEmail:'',awayName:'',awayTeam:{c:0,lw:0,rw:0,d1:0,d2:0,g:0},date:new Date(),gameState:GameStates.init,homeEmail:'',homeName:'blank home',homeTeam:{c:0,lw:0,rw:0,d1:0,d2:0,g:0},id:'blank',open:true,private:false,value:0}
export const lw:CardType = {"playerName":"Def F","playerId":"31","tokenId":-1,"rarity":Rarity.Standard,"pos":GamePosition.LW,"inUse":false,"image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};
export const c:CardType = {"playerName":"Def F","playerId":"31","tokenId":-2,"rarity":Rarity.Standard,"pos":GamePosition.C,"inUse":false,"image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};
export const rw:CardType = {"playerName":"Def F","playerId":"31","tokenId":-3,"rarity":Rarity.Standard,"pos":GamePosition.RW,"inUse":false,"image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};

export const d1:CardType = {"playerName":"Def D","playerId":"31","tokenId":-4,"rarity":Rarity.Standard,"pos":GamePosition.D1,"inUse":false,"image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};
export const d2:CardType = {"playerName":"Def D","playerId":"31","tokenId":-6,"rarity":Rarity.Standard,"pos":GamePosition.D2,"inUse":false,"image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};

export const g:CardType = {"playerName":"Def G","playerId":"31","tokenId":-5,"rarity":Rarity.Standard,"pos":GamePosition.G,"inUse":false,"image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};
export const nobody:CardType = {"playerName":"Select Player","playerId":"31","tokenId":-7,"rarity":Rarity.Standard,"pos":GamePosition.NONE,"inUse":false,"image":"https://hamtronmedia.com/media/images/spongebob.jpeg","stats":{"goals":0,"assists":0,"plusMinus":0,"wins":0,"shutouts":0,},"points":0,"playingTonight":false,"inGame":false};

export const blankTeam: Team = {
    lw:lw,
    c:c,
    rw:rw,
    d1:d1,
    d2:d2,
    g:g
}

export const DefDashDisp = (action:DashboardActions) => {
    console.log("DEF DASH DISPATCH",action.type);
}
export const DefPostLog = async(email:string):Promise <false | PostLoginReturnType> => {
    return false;
}
export const DefGetPlayersFromTokenArray = async(tokenArray:number[]):Promise<DashboardType | false> => {
    return false;
}
export const DefGetPacket = async(email:string,tokens:number[]):Promise <false | DashboardType> => {
    return false;
}
export const DefCreateGameDB = async(game:GameType):Promise <GameType | false> => {
    return false;
}