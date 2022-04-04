import { db } from "../firebase/clientApp";
import {doc,getDoc,setDoc} from 'firebase/firestore';
import { createRandomId } from "./helpers";
import { baseURL } from "./constants";
import {CardType, GameType} from '../context/DashboardContext';
import type {DashboardType} from '../context/DashboardContext';
import type {NHLGamesArray} from './helpers';
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
export const postSignup = async(email:string, username:string):Promise<boolean | PostSignupReturnType> => {
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
export const postLogin = async(email:string,tonightsGames:NHLGamesArray):Promise <boolean | PostLoginReturnType> => {
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
