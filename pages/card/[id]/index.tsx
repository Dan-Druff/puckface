import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css'
import { useRouter } from 'next/router'
import { useDashboard, getGame } from '../../../context/DashboardContext'
import { dateReader, getPlayerFromToken, getPlayersPointsFromIdAndDate } from '../../../utility/helpers'
import { nobody } from '../../../utility/constants'
import { useGameState } from '../../../context/GameState'
import { useNHL } from '../../../context/NHLContext'
import { useAuth } from '../../../context/AuthContext'
import type { StringBool } from '../../../utility/constants'
const Card: NextPage = () => {
    const {userData} = useAuth();
    const {tonightsGames} = useNHL();
    const {gameStateDispatch} = useGameState();
    const {dashboard,dashboardDispatch} = useDashboard();
    const Router = useRouter();
    const {id} = Router.query;
    const idint = Number(id);
    const card = dashboard.filter(g => g.tokenId === idint);
    const pname = card[0].playerName;
    const prare = card[0].rarity;
    const prev = () => {
        let curr = dashboard.findIndex(obj => {
          return obj.tokenId === idint;
        });
        let p = curr - 1;
        if(p < 0){
          p = dashboard.length - 1;  
        }
        if(p > dashboard.length){
          p = 0;
        }
        Router.push(`/card/${dashboard[p].tokenId.toString()}`);
    
      }
      const nxt = () => {
        let curr = dashboard.findIndex(obj => {
          return obj.tokenId === idint;
        });
        let p = curr + 1;
        if(p < 0){
          p = dashboard.length - 1;  
        }
        if(p >= dashboard.length){
          p = 0;
        }
        Router.push(`/card/${dashboard[p].tokenId.toString()}`);
      }
      const goToGame = async(gameId:StringBool) => {
        try {
            if(typeof gameId === 'boolean')throw new Error('🚦Error On Boolean🚦')
          const gameResult = await getGame(gameId);
          let skaterIds:number[] = [];
          if(gameResult === false)throw new Error('🚦got to game error🚦')
          skaterIds.push(gameResult.homeTeam.lw,gameResult.homeTeam.c,gameResult.homeTeam.rw,gameResult.homeTeam.d1,gameResult.homeTeam.d2,gameResult.homeTeam.g,gameResult.awayTeam.lw,gameResult.awayTeam.c,gameResult.awayTeam.rw,gameResult.awayTeam.d1,gameResult.awayTeam.d2,gameResult.awayTeam.g)
          const relevantGuys = await Promise.all(skaterIds.map(async(tokId) => {
              if(tokId > 0){
               
                  let guy = await getPlayerFromToken(tokId,tonightsGames);
                  if(guy === false)throw new Error('🚦Error getting Game🚦')
                  let dt = gameResult.date;
                
                  let dateO = dateReader(dt);
 
    
                  let tot = await getPlayersPointsFromIdAndDate(guy.playerId, dateO, guy.rarity)
                  if(tot === false){
                    guy.points = 0;

                  }else{
                    guy.points = tot.total;
                  }
                  guy.inGame = gameId;
                 
                 
                  return guy;
              }else{
                  let copy = nobody;
                  copy.inGame = gameId;
                  copy.tokenId = 0;
                  return copy;
              }
          }))
          let teamCopy = {
              lw:nobody,
              c:nobody,
              rw:nobody,
              d1:nobody,
              d2:nobody,
              g:nobody
          }
          let oppTeamCopy = {
              lw:nobody,
              c:nobody,
              rw:nobody,
              d1:nobody,
              d2:nobody,
              g:nobody
          }
          if(userData === null || userData.userEmail === null)throw new Error('🚦Error Going to Game🚦')
          if(userData.userEmail === gameResult.homeEmail){
              // setGameState(GAMESTATES.observing);
         
              relevantGuys.forEach((dude) => {
                  if(dude.tokenId > 0){
                   
                      if(dude.tokenId === gameResult.homeTeam.lw){
                          teamCopy.lw = dude;
                          teamCopy.lw.inUse = 'lw';
                       
                      }
                      if(dude.tokenId === gameResult.homeTeam.c){
                          teamCopy.c = dude;
                          teamCopy.c.inUse = 'c';
                      }
                      if(dude.tokenId === gameResult.homeTeam.rw){
                          teamCopy.rw = dude;
                          teamCopy.rw.inUse = 'rw';
                      }
                      if(dude.tokenId === gameResult.homeTeam.d1){
                          teamCopy.d1 = dude;
                          teamCopy.d1.inUse = 'd1';
                      }
                      if(dude.tokenId === gameResult.homeTeam.d2){
                          teamCopy.d2 = dude;
                          teamCopy.d2.inUse = 'd2';
                      }
                      if(dude.tokenId === gameResult.homeTeam.g){
                          teamCopy.g = dude;
                          teamCopy.g.inUse = 'g';
                      }
                      if(dude.tokenId === gameResult.awayTeam.lw){
                          oppTeamCopy.lw = dude;
                          oppTeamCopy.lw.inUse = 'lw';
                      }
                      if(dude.tokenId === gameResult.awayTeam.c){
                          oppTeamCopy.c = dude;
                          oppTeamCopy.c.inUse = 'c';
                      }
                      if(dude.tokenId === gameResult.awayTeam.rw){
                          oppTeamCopy.rw = dude;
                          oppTeamCopy.rw.inUse = 'rw';
                      }
                      if(dude.tokenId === gameResult.awayTeam.d1){
                          oppTeamCopy.d1 = dude;
                          oppTeamCopy.d1.inUse = 'd1';
                      }
                      if(dude.tokenId === gameResult.awayTeam.d2){
                          oppTeamCopy.d2 = dude;
                          oppTeamCopy.d2.inUse = 'd2';
                      }
                      if(dude.tokenId === gameResult.awayTeam.g){
                          oppTeamCopy.g = dude;
                          oppTeamCopy.g.inUse = 'g';
                      }
                  }
              })
             
          }else{
              // USER IS AWAY, OR HASNT JOINED YET.
     
              
              relevantGuys.forEach((dude) => {
                  if(dude.tokenId > 0){
                   
                      if(dude.tokenId === gameResult.homeTeam.lw){
                          oppTeamCopy.lw = dude;
                          oppTeamCopy.lw.inUse = 'lw';
                      }
                      if(dude.tokenId === gameResult.homeTeam.c){
                          oppTeamCopy.c = dude;
                          oppTeamCopy.c.inUse = 'c';
                      }
                      if(dude.tokenId === gameResult.homeTeam.rw){
                          oppTeamCopy.rw = dude;
                          oppTeamCopy.rw.inUse = 'rw';
                      }
                      if(dude.tokenId === gameResult.homeTeam.d1){
                          oppTeamCopy.d1 = dude;
                          oppTeamCopy.d1.inUse = 'd1';
                      }
                      if(dude.tokenId === gameResult.homeTeam.d2){
                          oppTeamCopy.d2 = dude;
                          oppTeamCopy.d2.inUse = 'd2';
                      }
                      if(dude.tokenId === gameResult.homeTeam.g){
                          oppTeamCopy.g = dude;
                          oppTeamCopy.g.inUse = 'g';
                      }
                      if(dude.tokenId === gameResult.awayTeam.lw){
                          teamCopy.lw = dude;
                          teamCopy.lw.inUse = 'lw';
                      }
                      if(dude.tokenId === gameResult.awayTeam.c){
                          teamCopy.c = dude;
                          teamCopy.c.inUse = 'c';
                      }
                      if(dude.tokenId === gameResult.awayTeam.rw){
                          teamCopy.rw = dude;
                          teamCopy.rw.inUse = 'rw';
                      }
                      if(dude.tokenId === gameResult.awayTeam.d1){
                          teamCopy.d1 = dude;
                          teamCopy.d1.inUse = 'd1';
                      }
                      if(dude.tokenId === gameResult.awayTeam.d2){
                          teamCopy.d2 = dude;
                          teamCopy.d2.inUse = 'd2';
                      }
                      if(dude.tokenId === gameResult.awayTeam.g){
                          teamCopy.g = dude;
                          teamCopy.g.inUse = 'g';
                      }
                  }
              })
          }
          gameStateDispatch({type:"observingGame"});
         dashboardDispatch({type:'setTeams',payload:{game:gameResult,myTeam:teamCopy,oppTeam:oppTeamCopy}})
        
          
          Router.push(`/game/${gameId}`);
        } catch (er) {
          console.log("Goto game error: ", er);
          dashboardDispatch({type:'error',payload:{er:"🚦Error Going to Game🚦"}})
        }
    
      }
    return (
        <div className={styles.mainContainer}>
        <div className={styles.contentContainer}>
        <button className={styles.pfButtonSecondary} onClick={() => prev()}>PREV CARD</button>
        <button className={styles.pfButtonSecondary} onClick={() => nxt()}>NEXT CARD</button>
        </div>
        <h2>{prare} {pname}</h2>
        <div className={styles.contentContainer}>
      
       <img className={styles.cardImage} src={card[0].image}/>
       <div className={styles.contentContainerColumn}>
       {card[0].pos === 'Goalie' ? <p>Wins: {card[0].stats.wins.toString()} Shutouts: {card[0].stats.shutouts.toString()}</p> : <p>Goals: {card[0].stats.goals.toString()} Assists: {card[0].stats.assists.toString()} +/-: {card[0].stats.plusMinus.toString()}</p>}
       <p>What data do I want to see here?</p>
       <p>Recent Games...</p>
       <p>Player History and stuff...</p>
       {card[0].inGame && 
       <div>
          <p>Currently In game: {card[0].inGame}</p>
          <button className={styles.pfButtonSecondary} onClick={() => goToGame(card[0].inGame)}>Go There</button>
       </div>
   
       }
       </div>

   
      
       </div>
       <div className={styles.contentContainer}>
        <button className={styles.pfButtonSecondary} onClick={() => prev()}>PREV CARD</button>
        <button className={styles.pfButtonSecondary} onClick={() => nxt()}>NEXT CARD</button>
        </div>
       </div>
    )
}
export default Card