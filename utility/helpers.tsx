import { multipliers, nobody, Team } from "./constants";
import { StringBool, CardType, GameType,StatsReturnType,PuckfaceDate,TeamTokens,NHLGame } from "../utility/constants"
import type {NHLGamesArray, GamePosition, Rarity} from '../utility/constants'
// import { ALL } from "./AllPlayersJson";
const LightALL = require('./LightALL.json');
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
// export const getPlayerFromToken2 = async(token:number, tonightsGames:NHLGamesArray):Promise <CardType | false> => {
//     try {
       
//         let playingTeams:string[] = [];
//         tonightsGames.forEach((game) => {
//             playingTeams.push(game.awayName);
//             playingTeams.push(game.homeName);
//         });
//         let inUse: GamePosition = 'none';
//         let goals = 0;
//         let assists = 0;
//         let plusMinus = 0;
//         let points = 0;
//         let wins = 0;
//         let shutouts = 0;
//         let active = false;
//         // let url = 'https://ipfs.io/ipfs/bafybeiedfdak44r7owq5ytvvgb6cywkpfcnhlauroqqlrr7ta3jt2yqhee/files/' + token.toString() + '.json';
//         let url = getIpfsUrl('json',token);
//         let data = await fetch(url);
//         let guy = await data.json();

//         let playerId = guy.attributes[3].value;
//         let pos = guy.attributes[0].value;
        
//         let data2 = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=20212022`);
//         let playerStats = await data2.json();

//         let teamName = guy.attributes[1].value;
//         if(playingTeams.indexOf(teamName) > -1){
//             // this means the player is playing tonight
//             active = true;
//         }

//         if(playerStats.stats[0].splits[0] !== undefined){
//             plusMinus = playerStats.stats[0].splits[0].stat.plusMinus || playerStats.stats[0].splits[0].stat.plusMinus === typeof 'number' ? playerStats.stats[0].splits[0].stat.plusMinus : 0;
//             assists = playerStats.stats[0].splits[0].stat.assists || playerStats.stats[0].splits[0].stat.assists === typeof 'number' ? playerStats.stats[0].splits[0].stat.assists : 0;
//             wins = playerStats.stats[0].splits[0].stat.wins || playerStats.stats[0].splits[0].stat.wins === typeof 'number' ? playerStats.stats[0].splits[0].stat.wins : 0;
//             shutouts = playerStats.stats[0].splits[0].stat.shutouts || playerStats.stats[0].splits[0].stat.shutouts === typeof 'number' ? playerStats.stats[0].splits[0].stat.shutouts : 0;
//             points = playerStats.stats[0].splits[0].stat.points || playerStats.stats[0].splits[0].stat.points === typeof 'number' ? playerStats.stats[0].splits[0].stat.points : 0;
//             goals = playerStats.stats[0].splits[0].stat.goals || playerStats.stats[0].splits[0].stat.goals === typeof 'number' ? playerStats.stats[0].splits[0].stat.goals : 0;
//         }else{
//             plusMinus = 0;
//             assists = 0;
//             wins = 0;
//             shutouts = 0;
//             points = 0;
//             goals = 0;
//         }
     
     
//         let player:CardType = {
//             tokenId:token,
//             image:getIpfsUrl('png',token),
//             playerId:playerId,
//             rarity:guy.attributes[2].value,
//             inUse:inUse,
//             playerName:guy.name,
//             points:points,
//             pos:pos,
//             playingTonight:active,
//             inGame:'',
//             stats:{
//                 goals:goals,
//                 assists:assists,
//                 plusMinus:plusMinus,
//                 wins:wins,
//                 shutouts:shutouts
//             }

//         }
//         return player;
//     } catch (e) {
//         console.log("Error", e);
//         return false;
//     }
    

// }
// export const getPlayerFromToken3 = async(token:number, tonightsGames:NHLGamesArray):Promise <CardType | false> => {
//     try {
//         if(token === 0 || token < 0){
//             return nobody;
//         }else{
//             let playingTeams:string[] = [];
//         tonightsGames.forEach((game) => {
//             playingTeams.push(game.awayName);
//             playingTeams.push(game.homeName);
//         });
//         let inUse: GamePosition = 'none';
//         let goals = 0;
//         let assists = 0;
//         let plusMinus = 0;
//         let points = 0;
//         let wins = 0;
//         let shutouts = 0;
//         let active = false;
//         // let url = 'https://ipfs.io/ipfs/bafybeiedfdak44r7owq5ytvvgb6cywkpfcnhlauroqqlrr7ta3jt2yqhee/files/' + token.toString() + '.json';
//         // let url = getIpfsUrl('json',token);
//         // let data = await fetch(url);
//         // let guy = await data.json();
//         // This is where I get guy from js Object.
//         let arrayOfGuysObject = [];
//         const tokenString = token.toString();
//         arrayOfGuysObject = ALL.forwards.filter(g => g.attributes[5].value === tokenString);
//         if(arrayOfGuysObject.length === 0){
//             arrayOfGuysObject = ALL.defense.filter(g => g.attributes[5].value === tokenString);
//         }
//         if(arrayOfGuysObject.length === 0){
//             arrayOfGuysObject = ALL.goalies.filter(g => g.attributes[5].value === tokenString);
//         }
//         if(arrayOfGuysObject.length === 0){
//             console.log("Error getting array of guy");
//         }
//         const guy = arrayOfGuysObject[0];

//         let playerId = guy.attributes[3].value;
//         let pos = guy.attributes[0].value;
        
//         let data2 = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=20212022`);
//         let playerStats = await data2.json();

//         let teamName = guy.attributes[1].value;
//         if(playingTeams.indexOf(teamName) > -1){
//             // this means the player is playing tonight
//             active = true;
//         }

//         if(playerStats.stats[0].splits[0] !== undefined){
//             plusMinus = playerStats.stats[0].splits[0].stat.plusMinus || playerStats.stats[0].splits[0].stat.plusMinus === typeof 'number' ? playerStats.stats[0].splits[0].stat.plusMinus : 0;
//             assists = playerStats.stats[0].splits[0].stat.assists || playerStats.stats[0].splits[0].stat.assists === typeof 'number' ? playerStats.stats[0].splits[0].stat.assists : 0;
//             wins = playerStats.stats[0].splits[0].stat.wins || playerStats.stats[0].splits[0].stat.wins === typeof 'number' ? playerStats.stats[0].splits[0].stat.wins : 0;
//             shutouts = playerStats.stats[0].splits[0].stat.shutouts || playerStats.stats[0].splits[0].stat.shutouts === typeof 'number' ? playerStats.stats[0].splits[0].stat.shutouts : 0;
//             points = playerStats.stats[0].splits[0].stat.points || playerStats.stats[0].splits[0].stat.points === typeof 'number' ? playerStats.stats[0].splits[0].stat.points : 0;
//             goals = playerStats.stats[0].splits[0].stat.goals || playerStats.stats[0].splits[0].stat.goals === typeof 'number' ? playerStats.stats[0].splits[0].stat.goals : 0;
//         }else{
//             plusMinus = 0;
//             assists = 0;
//             wins = 0;
//             shutouts = 0;
//             points = 0;
//             goals = 0;
//         }
//         let r:Rarity = 'Standard'
//         switch (guy.attributes[2].value) {
//             case 'Rare':
//                 r = 'Rare'
//                 break;
//             case 'Super Rare':
//                 r = 'Super Rare';
//                 break;
//             case 'Unique':
//                 r = 'Unique';
//                 break;        
        
//             default:
//                 break;
//         }
     
//         let player:CardType = {
//             tokenId:token,
//             image:getIpfsUrl('png',token),
//             playerId:playerId,
//             rarity:r,
//             inUse:inUse,
//             playerName:guy.name,
//             points:points,
//             pos:pos,
//             playingTonight:active,
//             inGame:'',
//             stats:{
//                 goals:goals,
//                 assists:assists,
//                 plusMinus:plusMinus,
//                 wins:wins,
//                 shutouts:shutouts
//             }

//         }
//         return player;
//         }
       
        
//     } catch (e) {
//         console.log("Error", e);
//         return false;
//     }
    

// }
export const getPlayerFromToken = async(token:number, tonightsGames:NHLGamesArray, activeGames:GameType[]):Promise <CardType | false> => {
    try {
        if(token === 0 || token < 0){
            return nobody;
        }else{
      
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
        // let url = 'https://ipfs.io/ipfs/bafybeiedfdak44r7owq5ytvvgb6cywkpfcnhlauroqqlrr7ta3jt2yqhee/files/' + token.toString() + '.json';
        // let url = getIpfsUrl('json',token);
        // let data = await fetch(url);
        // let guy = await data.json();
        // This is where I get guy from js Object.
        let arrayOfGuysObject:any[] = [];
        const tokenString = token.toString();
      
        const fff : any[] = LightALL.forwards;
       
        arrayOfGuysObject = fff.filter(g => g.tokenId === tokenString);
        // arrayOfGuysObject = ALL.forwards.filter(g => g.attributes[5].value === tokenString);
        if(arrayOfGuysObject.length === 0){
            const ddd : any[] = LightALL.defense;
            arrayOfGuysObject = ddd.filter(g => g.tokenId === tokenString);
       
        }
        if(arrayOfGuysObject.length === 0){
            const ggg : any[] = LightALL.goalies;
            arrayOfGuysObject = ggg.filter(g => g.tokenId === tokenString);
          
        }
        if(arrayOfGuysObject.length === 0){
            console.log("Error getting array of guy");
         
        }
        const guy = arrayOfGuysObject[0];
        console.log("Getting player from token: ", token);
        console.log(`Guy is: ${guy}`);
        // let playerId = guy.attributes[3].value;
        let playerId = guy.playerId
        // let pos = guy.attributes[0].value;
     
   
        let data2 = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=20212022`);
        let playerStats = await data2.json();

        // let teamName = guy.attributes[1].value;
        let teamName = guy.team;
        // let pos = guy.pos;
        if(playingTeams.indexOf(teamName) > -1){
            // this means the player is playing tonight
            active = true;
        }
        let inGame: StringBool = false;
        console.log(`Acitve Games??????🌈 ${activeGames.length}`);
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
        let r:Rarity = 'Standard'
        switch (guy.rarity) {
            case 'Rare':
                r = 'Rare'
                break;
            case 'Super Rare':
                r = 'Super Rare';
                break;
            case 'Unique':
                r = 'Unique';
                break;        
        
            default:
                break;
        }
     
        let player:CardType = {
            tokenId:token,
            image:getIpfsUrl('png',token),
            playerId:playerId,
            rarity:r,
            inUse:inUse,
            playerName:guy.playerName,
            points:points,
            pos:guy.pos,
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
        }
       
        
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
export const makeTeam = (teamArray:CardType[], theTeam:Team):Team => {
    let teamCopy:Team = {
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
export const getIpfsUrl = (type:string, token:number):string => {
    try {
        let u = '';
        if(type === 'json'){
            if(token > 0 && token < 501){
                u = 'https://ipfs.io/ipfs/bafybeibvgu32pidnlir5fvgkdum65d6mzb25gol7f5z2hoq6r5jzaf3oz4/';
            }else if(token > 500 && token < 1001){
                u = 'https://ipfs.io/ipfs/bafybeigiugrbnji7scw5gz33qa4wuo4ahsk2x5yihbeeq3ridskj5s3fye/';
            }else if(token > 1000 && token < 1501){
                u = 'https://ipfs.io/ipfs/bafybeibadwygro3xvwealyug2myi3cqwkwawjxzhdidadd25ow26lnnjvm/';
            }else if(token > 1500 && token < 2001){
                u = 'https://ipfs.io/ipfs/bafybeicrelkkzokpiupoj4u5finch7ub6x5ejikv54wkhlpupase46sai4/';
            }else if(token > 2000 && token < 2501){
                u = 'https://ipfs.io/ipfs/bafybeigsbrhh2y4lpse2qsavqmfqrhvvhhkuj3a2l6ts3zmkydk24i36we/';
            }else if(token > 2500 && token < 3001){
                u = 'https://ipfs.io/ipfs/bafybeicgqxdl3j2n3rhdcvdwrjlfedf4tqstfjdcfpfzut7obuxc4azwne/';
            }else if(token > 3000 && token < 3501){
                u = 'https://ipfs.io/ipfs/bafybeiha373ldxxv7j5xb6qk3l3rojaio4fsy4mfnrvskf4wxijnxhqe3a/';
            }else if(token > 3500 && token < 4001){
                u = 'https://ipfs.io/ipfs/bafybeic5i4627bt6b2njnnphf5ghvq5rwzk2gmeabv6ieqvf64lsj4wsga/';
            }else if(token > 4000 && token < 4501){
                u = 'https://ipfs.io/ipfs/bafybeibrqca6rnxu3enmq7npj4t3yboggigyalvbijmbomdcji3a3rgtsy/';    
            }else if(token > 4500 && token < 5001){
                u = 'https://ipfs.io/ipfs/bafybeihucxpfeeoko6twwdaww56ksggq6gip6x647ryxwyife7c33vzbly/';
            }else if(token > 5000 && token < 5501){
                u = 'https://ipfs.io/ipfs/bafybeibfr4nbsrjmoxxd66hf2rpm4wnq3alwoijom5vggayaflg6v245iu/';
            }else if(token > 5500 && token < 6001){
                u = 'https://ipfs.io/ipfs/bafybeigczujltfkzndhfur73hzzuurlakbau7nbqklk2xtuxervklxclpq/';
            }else if(token > 6000 && token < 6501){
                u = 'https://ipfs.io/ipfs/bafybeifqp4qo52lo37gdsti3fiz5jwp5hy5yz5ahl2tsukglktyknoktvq/';
            }else if(token > 6500 && token < 7001){
                u = 'https://ipfs.io/ipfs/bafybeihpwgfeos6p55n6eolf5bymy6r7vuerh2z5rzsipn6eqzrww7ju5i/';
            }else if(token > 7000 && token < 7501){
                u = 'https://ipfs.io/ipfs/bafybeigg4nyztimobwynrsanuidpqr7m45mca47ki5f46gjkw3tebexy6i/';
            }else if(token > 7500 && token < 8001){
                u = 'https://ipfs.io/ipfs/bafybeiehknnby7tggyqnmfrye3bldgnrkxsxbmrq4t5fogd2hiin6g6qzu/';
            }else if(token > 8000 && token < 8501){
                u = 'https://ipfs.io/ipfs/bafybeiddb7nwayoj4tiilxxeo7sno4g44vsc4n65cycrg4qi2ale4g5z5e/';
            }else if(token > 8500 && token < 9001){
                u = 'https://ipfs.io/ipfs/bafybeihbmwpr64g53kdm7oib6ag24finhwax7atjo5wzamldunc6acy34a/';
            }else if(token > 9000 && token < 9501){
                u = 'https://ipfs.io/ipfs/bafybeianpgw6jofg3heyzism4qqqtowaotfeyyvlv25nork56y2wvs35fm/';
            }else if(token > 9500 && token < 10001){
                u = 'https://ipfs.io/ipfs/bafybeiah6lnqlcxlrhhrjhrt2kidszacij67fjwxun6s4weu44kekpc2cy/';
            }else if(token > 10000 && token < 10882){
                u = 'https://ipfs.io/ipfs/bafybeihg3i6now2es26vp44e2keuin5leufaybnsd32wlxmpm2tw6rf6tq/';
            }
            u = `${u}${token.toString()}.json`;

        }
        if(type === 'png'){
            if(token > 0 && token < 501){
                u = 'https://ipfs.io/ipfs/bafybeigudx22ha2w6lf76h5nzxjtylx6nq2aerwk63qonocuixteblbcp4/';
            }else if(token > 500 && token < 1001){
                u = 'https://ipfs.io/ipfs/bafybeidzqiyg3aum5qkj2677pxa6npsc6yvbxs6nqfpthrm3ot46s3aibi/';
            }else if(token > 1000 && token < 1501){
                u = 'https://ipfs.io/ipfs/bafybeif7cjgn3ibsh3pzmgxjo3nskcrmtmsfyempkb6nyh7xqvq5i464l4/';
            }else if(token > 1500 && token < 2001){
                u = 'https://ipfs.io/ipfs/bafybeigqxz7thllsrndq4nqqbrk4pvcfhtva3dy6q62pr66i63jrryuf5a/';
            }else if(token > 2000 && token < 2501){
                u = 'https://ipfs.io/ipfs/bafybeigzvaenfc5gihibxvzdemsonpgejsukmk6xkgnf5yhtp67xf2tqba/';
            }else if(token > 2500 && token < 3001){
                u = 'https://ipfs.io/ipfs/bafybeiejzb4vw7angcnlojvgggip2j7ghtyzz3hu3tbbw5mx7lg2obum2a/';
            }else if(token > 3000 && token < 3501){
                u = 'https://ipfs.io/ipfs/bafybeidysn4nmewdhr5te3wtfvno4klza2okimjuvvbpxdlpj4wd4vvrsq/';
            }else if(token > 3500 && token < 4001){
                u = 'https://ipfs.io/ipfs/bafybeieoxwugjvs2xpepgaahxyollywl246yl3rcnumpqzughj2rq4scfq/';
            }else if(token > 4000 && token < 4501){
                u = 'https://ipfs.io/ipfs/bafybeihoqo64cxfcx7gnsvb2mgiq5a2v3re3pq4ukxgzkv2iri63oiys7a/';
            }else if(token > 4500 && token < 5001){
                u = 'https://ipfs.io/ipfs/bafybeid22wbkpf47z4ijiugvzqvpztkqsmagiqznto5yyu2lm4hwlooype/';
            }else if(token > 5000 && token < 5501){
                u = 'https://ipfs.io/ipfs/bafybeidqiknzz5svv3zkbhj3t3h4aitrdgdboiial4jdbhlltaiml5d3oa/';
            }else if(token > 5500 && token < 6001){
                u = 'https://ipfs.io/ipfs/bafybeiafwwi6nm3njpmlkmv7bfvkb23y2d2ye7z2u3hpd4dy4fidx3meje/';
            }else if(token > 6000 && token < 6501){
                u = 'https://ipfs.io/ipfs/bafybeiedq53tsfscipc5ydy6ivq37k6rngb3irg7siovu7ipwimheoopqq/';
            }else if(token > 6500 && token < 7001){
                u = 'https://ipfs.io/ipfs/bafybeiekiutxiwviokiuysecqugunuzgsh5toi2jszm4a3qcbeifhfpvnu/';
            }else if(token > 7000 && token < 7501){
                u = 'https://ipfs.io/ipfs/bafybeiabtlg7sdxhwzefn2hnlg5ovcn7qy4ixjlb7jumxto5ikdzna7g5u/';
            }else if(token > 7500 && token < 8001){
                u = 'https://ipfs.io/ipfs/bafybeicxhdjosz3gyyyltacialxjiarwetn4yeaqctgzrdgxjqeceh7qr4/';
            }else if(token > 8000 && token < 8501){
                u = 'https://ipfs.io/ipfs/bafybeicnquac32qtp4zmuye34z3p4fchtwgpflcv3blhcajsomz7a5m3oa/';
            }else if(token > 8500 && token < 9001){
                u = 'https://ipfs.io/ipfs/bafybeibgw5v7wenuqy7ezm73elxo7e2revnv4vbuakztpigurs6br75euu/';
            }else if(token > 9000 && token < 9501){
                u = 'https://ipfs.io/ipfs/bafybeib3g4l2fomz2brzw2ov6gganqayxdot5d6j5wqenrcdbroe22kuga/';
            }else if(token > 9500 && token < 10001){
                u = 'https://ipfs.io/ipfs/bafybeiez4mw2qdol2ehigrrncosvabtp4of45yjx2jfcerxqm2c4u2gc3e/';
            }else if(token > 10000 && token < 10501){
                u = 'https://ipfs.io/ipfs/bafybeifpt4c3bs6bb34ddpjkle6e7wrutoe5osaf352c65b6xtaklfdhgq/';
            }else if(token > 10500 && token < 10882){
                u = 'https://ipfs.io/ipfs/bafybeicnwgnkyxrmgt3ymerydoxadis7ensa7o4kpoiuitwujyos5j47g4/';
            }
            u = `${u}${token.toString()}.png`;
        }
        return u;
    } catch (er) {
        console.log("Error getting url", er)
        return "Error";
    }
}
export const dealWithDate = (d:string):{year:number,day:number,month:number} | false => {
   try {
        let x = {
            year:0,
            month:0,
            day:0
        }
        let m = -1;
        let m1 = d[5];
        let m2 = d[6];
        // if(m1 === 0){
        //     m = Number(m2);
        // }else{
        //     m = Number(`${m1}${m2}`)
        // }
        m = Number(`${m1}${m2}`)
        let mNum = Number(m);
        mNum = mNum - 1;
        let yNum = Number(`${d[0]}${d[1]}${d[2]}${d[3]}`);
        let dNum = -1;
        // if(startD[8] === 0){
        //     dNum = Number(`${startD[9]}`);
        // }else{
        //     dNum = Number(`${startD[8]}${startD[9]}`);
        // }
        dNum = Number(`${d[8]}${d[9]}`);
        // if(mNum < 0 || dNum < 0)throw new Error("Some error with dates");
        console.log(`Year: ${yNum}, Month: ${mNum}, Day: ${dNum}`);
     return x;
   }catch(er){
     console.log(`🚦Error: ${er}🚦`)
     return false;
   }
}