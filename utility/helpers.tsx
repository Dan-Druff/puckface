import { multipliers } from "./constants";

export interface PuckfaceDate {
    month:string,
    day:string,
    year:string,
    fullDate:string,
    monthNumber:number,
    yearNumber:number,
    dayNumber:number
}
export interface TeamTokens {
    lw:number,
    c:number,
    rw:number,
    d1:number,
    d2:number,
    g:number
}
export type LobbyGameState = 'Waiting for Opponent' | 'Waiting for Game' | 'Game Complete'
export interface Game {
    awayEmail:string,
    awayName:string,
    homeEmail:string,
    homeName:string,
    homeTeam:TeamTokens,
    awayTeam:TeamTokens,
    date:Date,
    gameState:LobbyGameState,
    id:string,
    open:boolean,
    private:boolean,
    value:number
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

export const dateReader = (date:Date):PuckfaceDate => {
       
    let month = '';
    let day = '';
    let year = '';

    let months = ['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];
    let days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday','Saturday'];

    year = date.getFullYear().toString();
    let yearNumber = date.getFullYear();
    let monthNumber = date.getMonth();
    month = months[monthNumber];
    monthNumber = monthNumber + 1;
    // monthNumber = monthNumber.toString()
    
    let dayNumber = date.getDate();
    day = days[date.getDay()];

    return {
        month:month,
        day:day,
        year:year,
        fullDate: '📆 ' + day + ' ' + month + ' '+ dayNumber.toString() + ' ' + year + ' 📆 ',
        monthNumber:monthNumber,
        yearNumber:yearNumber,
        dayNumber:dayNumber
        
    }


}
export const todaysDateString = (td:Date):string => {
    // let td = new Date();
    let yr = td.getFullYear();
    let month = td.getMonth();
    let monthString = month.toString()
    let day = td.getDate();
    let dayString = day.toString();
    month = month + 1;
    if(month < 10){
     
        monthString = '0'+ monthString;
    }
  
    if(day < 10){
   
        dayString = '0'+ dayString;

    }
    return `${yr.toString}-${monthString}-${dayString}`;
}
export const createRandomId = ():string => {
    let length = 10;
    let str = '';
    let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVQXYZ';

    for(let i=1; i<= length; i++){
        let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        str += randomCharacter;
    }
    return str;

}
export const calculateGame = async(game:any, homeScore:number, awayScore:number) => {
    try {
        let gCopy = game;
        
        if(homeScore > awayScore){
            // home person wins, add pucks
        }
        if(awayScore > homeScore){
            // away team wins, add pucks
        }
        if(awayScore === homeScore){
            // game tied distributre evenly
        }

        gCopy.gameState = "complete"
        gCopy.open = false;
        return {
            game:gCopy,
            
        }
        
    } catch (er) {
        console.log("Calulate Erro: ", er);
        return false;
    }
}
export const getTodaysSchedule = async(year:string,month:string,day:string):Promise <NHLGamesArray> => {
    // date is month THEN day

    console.log("GETTING SCHEDHULE: ");
    console.log(`https://statsapi.web.nhl.com/api/v1/schedule?date=${year}-${month}-${day}`);
    const raw = await fetch(`https://statsapi.web.nhl.com/api/v1/schedule?date=${year}-${month}-${day}`);
    const formatted = await raw.json()
    let gameArray = formatted.dates[0].games;
    let NHLGames:NHLGamesArray = [];
    gameArray.forEach((game:any) => {
      
        let o = {
            awayId:game.teams.away.team.id,
            awayName:game.teams.away.team.name,
            awayRecord:game.teams.away.leagueRecord.wins.toString() + '-'+game.teams.away.leagueRecord.losses.toString() + '-' + game.teams.away.leagueRecord.ot.toString(),
            homeId:game.teams.home.team.id,
            homeName:game.teams.home.team.name,
            homeRecord:game.teams.home.leagueRecord.wins.toString() + '-'+game.teams.home.leagueRecord.losses.toString() + '-' + game.teams.home.leagueRecord.ot.toString(),
            description:game.teams.away.team.name + ' @ ' + game.teams.home.team.name
        }
        NHLGames.push(o);
        console.log("Pushing: ", o.description);
    })
    return NHLGames;

}