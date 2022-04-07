import { multipliers, Team } from "./constants";
import { CardType, GameType,StatsReturnType,PuckfaceDate,TeamTokens,NHLGame } from "../utility/constants"
import type {LobbyGameState,NHLGamesArray, GamePosition, Rarity} from '../utility/constants'

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
export const gameIsOver = (game:GameType) => {
    try {
        let d = {
            year:0,
            day:0,
            month:0
        }
        let t = dateReader(new Date);
        let today = {
            year:Number(t.yearNumber),
            month:Number(t.monthNumber),
            day:Number(t.dayNumber)
        }
        if(game.date instanceof Date){
            const x = dateReader(game.date);
            d.year = Number(x.yearNumber);
            d.month = Number(x.monthNumber);
            d.day = Number(x.dayNumber);
        }
        if(today.year > d.year || today.month > d.month || today.day > d.day){
            return true;
        }else{
            return false;
        }
        
    } catch (er) {
        console.log("Er game isover",er);
        return false;
    }
}
export const getPlayerFromToken = async(token:number, tonightsGames:NHLGamesArray):Promise <CardType | false> => {
    try {
       
        let playingTeams:string[] = [];
        tonightsGames.forEach((game) => {
            playingTeams.push(game.awayName);
            playingTeams.push(game.homeName);
        });
        let inUse: GamePosition = 'none';
        let goals = 0;
        let assists = 0;
        let plusMinus = 0;
        let points = 0;
        let wins = 0;
        let shutouts = 0;
        let active = false;
        let url = 'https://ipfs.io/ipfs/bafybeiedfdak44r7owq5ytvvgb6cywkpfcnhlauroqqlrr7ta3jt2yqhee/files/' + token.toString() + '.json';

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
            inGame:'',
            stats:{
                goals:goals,
                assists:assists,
                plusMinus:plusMinus,
                wins:wins,
                shutouts:shutouts
            }

        }
        return player;
    } catch (e) {
        console.log("Error", e);
        return false;
    }
    

}
export const getPlayersPointsFromIdAndDate = async(playerId:string,gameDate:PuckfaceDate,rarity:Rarity):Promise <StatsReturnType | false> => {
    try {
        // TO DO: All error checking, make sure its the right goalie and not the back. TOI?


        // gameDate shoudle be an object: {year:'2022',month:'02',day:'18'}

        // Get all games for tonight
        let playerIsGoalie = false;
        let playerIsHome = false;
        let playingTeamsIntArray:number[] = [];
        let homeTeams:number[] = [];
        let awayTeams: number[] = [];
        const raw = await (await fetch(`https://statsapi.web.nhl.com/api/v1/schedule?date=${gameDate.yearNumber.toString()}-${gameDate.monthNumber.toString()}-${gameDate.dayNumber.toString()}`)).json();
        const tonightsGames:any[] = raw.dates[0].games;

        tonightsGames.forEach((game:any) => {
            playingTeamsIntArray.push(game.teams.away.team.id);
            playingTeamsIntArray.push(game.teams.home.team.id);
            homeTeams.push(game.teams.home.team.id);
            awayTeams.push(game.teams.away.team.id);
        })
  
        // Get players team ID
        const rawPlayer = await (await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`)).json();
        console.log("RAW:🍎 ", rawPlayer.people[0].fullName);
        if(rawPlayer.people[0].primaryPosition.type === 'Goalie'){
            playerIsGoalie = true;
        }
        
        // See if team ID is in the tonightsGames array
        if(playingTeamsIntArray.indexOf(rawPlayer.people[0].currentTeam.id) > -1){
  
            if(homeTeams.indexOf(rawPlayer.people[0].currentTeam.id) > -1){
                playerIsHome = true;
         
            }
            // Get the game ID
            let filt = tonightsGames.filter(g => g.teams.away.team.id === rawPlayer.people[0].currentTeam.id || g.teams.home.team.id === rawPlayer.people[0].currentTeam.id);
            // let gamePk = filt[0].gamePk;
            let gameLink = `https://statsapi.web.nhl.com${filt[0].link}`;
            let gameData = await (await fetch(gameLink)).json();
            
            let objId = `ID${playerId}`;
            console.log("🌵 Cactus: ", gameData.liveData.boxscore.teams.away.players);
            if(playerIsHome){
                if(playerIsGoalie){
                    let win = 0;
                    let shutout = 0;
                    let goalieStats = gameData.liveData.boxscore.teams.home.players[objId] !== undefined ? gameData.liveData.boxscore.teams.home.players[objId].stats.goalieStats : false;
                    // let goalieStats = gameData.liveData.boxscore.teams.home.players[objId].stats.goalieStats;
                    if(goalieStats.decision === 'W'){
                        win = 2;
                    }
                    if(goalieStats.savePercentage === 100){
                        shutout = 3;
                    }
                   
                    if(goalieStats){
                        let tots = 0;
                        switch (rarity) {
                            case "Standard":
                                tots = win + shutout;
                                break;
                            case "Rare":
                                tots = win + shutout;
                                tots = tots * multipliers.rare;
                                break;
                            case "Super Rare":
                                tots = win + shutout;
                                tots = tots * multipliers.superRare;
                                break;
                            case "Unique":
                                tots = win + shutout;
                                tots = tots * multipliers.unique;
                                break;
                        
                            default:
                                break;
                        }
                        return {
                            goals:goalieStats.goals,
                            assists:goalieStats.assists,
                            plusMinus:0,
                            points:goalieStats.goals + goalieStats.assists,
                            shutouts:shutout,
                            wins:win,
                            total:tots
                        }
                    }else{
                        
                        return {
                            goals:0,
                            assists:0,
                            plusMinus:0,
                            points:0,
                            shutouts:0,
                            wins:0,
                            total:0
                        }
                    }
                
                }else{
                    let playerStats = gameData.liveData.boxscore.teams.home.players[objId] !== undefined ? gameData.liveData.boxscore.teams.home.players[objId].stats.skaterStats : false;
                    // let playerStats = gameData.liveData.boxscore.teams.home.players[objId].stats.skaterStats;
                    if(playerStats){
                        let plu = playerStats.plusMinus / 2
                        console.log("PLAYER STSTA ",playerStats);
                        let tots = 0;
                        switch (rarity) {
                            case "Standard":
                                tots = playerStats.goals + playerStats.assists + plu;
                                break;
                            case "Rare":
                                tots = playerStats.goals + playerStats.assists + plu;
                                tots = tots * multipliers.rare;
                                break;
                            case "Super Rare":
                                tots = playerStats.goals + playerStats.assists + plu;
                                tots = tots * multipliers.superRare;
                                break;
                            case "Unique":
                                tots = playerStats.goals + playerStats.assists + plu;
                                tots = tots * multipliers.unique;
                                break;
                        
                            default:
                                break;
                        }

                        return {
                            goals:playerStats.goals,
                            assists:playerStats.assists,
                            plusMinus:playerStats.plusMinus,
                            points:playerStats.goals + playerStats.assists,
                            shutouts:0,
                            wins:0,
                            total:tots
                        }
                    }else{
              
                        return {
                            goals:0,
                            assists:0,
                            plusMinus:0,
                            points:0,
                            shutouts:0,
                            wins:0,
                            total:0
                        }
                    }
                 
                }
         
            }else{
                if(playerIsGoalie){
                    let win = 0;
                    let shutout = 0;
                    let goalieStats = gameData.liveData.boxscore.teams.away.players[objId] !== undefined ? gameData.liveData.boxscore.teams.away.players[objId].stats.goalieStats : false;
                    // let goalieStats = gameData.liveData.boxscore.teams.away.players[objId].stats.goalieStats;
                    if(goalieStats.decision === 'W'){
                        win = 2;
                    }
                    if(goalieStats.savePercentage === 100){
                        shutout = 3;
                    }
                    if(goalieStats){
                        console.log("HOME GOALIEEEE", goalieStats);
                        let tots = 0;
                        switch (rarity) {
                            case "Standard":
                                tots = win + shutout;
                                break;
                            case "Rare":
                                tots = win + shutout;
                                tots = tots * multipliers.rare;
                                break;
                            case "Super Rare":
                                tots = win + shutout;
                                tots = tots * multipliers.superRare;
                                break;
                            case "Unique":
                                tots = win + shutout;
                                tots = tots * multipliers.unique;
                                break;
                        
                            default:
                                break;
                        }
                        return {
                            goals:goalieStats.goals,
                            assists:goalieStats.assists,
                            plusMinus:0,
                            points:goalieStats.goals + goalieStats.assists,
                            shutouts:shutout,
                            wins:win,
                            total:tots
                        }
                    }else{
                        console.log("HOME GOALIEEEE", goalieStats);
                        return {
                            goals:0,
                            assists:0,
                            plusMinus:0,
                            points:0,
                            shutouts:0,
                            wins:0,
                            total:0
                        }
                    }
                 
                }else{
                    let playerStats = gameData.liveData.boxscore.teams.away.players[objId] !== undefined ? gameData.liveData.boxscore.teams.away.players[objId].stats.skaterStats : false;
                    // let playerStats = gameData.liveData.boxscore.teams.away.players[objId].stats.skaterStats;
                    if(playerStats){
                        let plu = playerStats.plusMinus / 2;
                        console.log("PLAYER STSTA ",playerStats);
                        let tots = 0;
                        switch (rarity) {
                            case "Standard":
                                tots = playerStats.goals + playerStats.assists + plu;
                                break;
                            case "Rare":
                                tots = playerStats.goals + playerStats.assists + plu;
                                tots = tots * multipliers.rare;
                                break;
                            case "Super Rare":
                                tots = playerStats.goals + playerStats.assists + plu;
                                tots = tots * multipliers.superRare;
                                break;
                            case "Unique":
                                tots = playerStats.goals + playerStats.assists + plu;
                                tots = tots * multipliers.unique;
                                break;
                        
                            default:
                                break;
                        }
                        return {
                            goals:playerStats.goals,
                            assists:playerStats.assists,
                            plusMinus:playerStats.plusMinus,
                            points:playerStats.goals + playerStats.assists,
                            shutouts:0,
                            wins:0,
                            total:tots
                        }
                    }else{
                   
                        console.log("PLAYER STSTA ",playerStats);
                        return {
                            goals:0,
                            assists:0,
                            plusMinus:0,
                            points:0,
                            shutouts:0,
                            wins:0,
                            total:0
                        }
                    }
          
                }
           
            }
         
           
        }else{
            console.log("Player DID NOT Play this day");
            return false;

        }
    } catch (e) {
        console.log("Error getting players game data", e);
        return false;
    }
}
export const makeTeam = (teamArray:CardType[], theTeam:Team) => {
    let teamCopy = {
        lw:theTeam.lw,
        c:theTeam.c,
        rw:theTeam.rw,
        d1:theTeam.d1,
        d2:theTeam.d2,
        g:theTeam.g
    };
 
    teamArray.forEach((guy) => {

            switch (guy.inUse) {
                case 'lw':
                    teamCopy.lw = guy;
                    break;
                case 'c':
                    teamCopy.c = guy;
                    break;
                case 'rw':
                    teamCopy.rw = guy;
                    break;
                case 'd1':
                    teamCopy.d1 = guy;
                    break;
                case 'd2':
                    teamCopy.d2 = guy;
                    break;
                case 'g':
                    teamCopy.g = guy;
                    break;
                default:
                    break;
            }
     
    })
    return teamCopy;
} 