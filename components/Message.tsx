import { MessageCompType, Team, nobody } from "../utility/constants"
import styles from '../styles/All.module.css';
import { useRouter } from "next/router";
import { useDashboard, getGame } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import { useGameState } from "../context/GameState";
const Message = (props:MessageCompType) => {
  const Router = useRouter();
  const {userData} = useAuth();
  const {getPlayersFromTokenArray, dashboardDispatch, activeGames} = useDashboard();
  const {gameStateDispatch} = useGameState();
  const goToGame = async(gameId:string) => {
    try {
      const game = await getGame(gameId);
      if(game === false)throw new Error("Game is false");
      const skaterIds = [game.homeTeam.lw,game.homeTeam.c,game.homeTeam.rw,game.homeTeam.d1,game.homeTeam.d2,game.homeTeam.g,game.awayTeam.lw,game.awayTeam.c,game.awayTeam.rw,game.awayTeam.d1,game.awayTeam.d2,game.awayTeam.g];
      const relevantGuys = await getPlayersFromTokenArray(skaterIds, activeGames);
      if(relevantGuys === false)throw new Error("Error, getting players");
      if(userData === null || userData.userEmail === null) throw new Error('🚦No user data🚦');
  
      let teamCopy:Team = {
        lw:nobody,
        c:nobody,
        rw:nobody,
        d1:nobody,
        d2:nobody,
        g:nobody
    }
    let oppTeamCopy:Team = {
        lw:nobody,
        c:nobody,
        rw:nobody,
        d1:nobody,
        d2:nobody,
        g:nobody
    }
    if(userData.userEmail === game.homeEmail){
      relevantGuys.forEach((dude) => {
        if(dude.tokenId > 0){
          switch (dude.tokenId) {
            case game.homeTeam.lw:
              teamCopy.lw = dude;
              teamCopy.lw.inUse = 'lw';
              teamCopy.lw.inGame = game.id;
              break;
            case game.homeTeam.c:
              teamCopy.c = dude;
              teamCopy.c.inUse = 'c';
              teamCopy.c.inGame = game.id;
              break;
            case game.homeTeam.rw:
              teamCopy.rw = dude;
              teamCopy.rw.inUse = 'rw';
              teamCopy.rw.inGame = game.id;
              break;
            case game.homeTeam.d1:
              teamCopy.d1 = dude;
              teamCopy.d1.inUse = 'd1';
              teamCopy.d1.inGame = game.id;
              break;
            case game.homeTeam.d2:
              teamCopy.d2 = dude;
              teamCopy.d2.inUse = 'd2';
              teamCopy.d2.inGame = game.id;
              break;
            case game.homeTeam.g:
              teamCopy.g = dude;
              teamCopy.g.inUse = 'g';
              teamCopy.g.inGame = game.id;
              break;  
              case game.awayTeam.lw:
              oppTeamCopy.lw = dude;
              oppTeamCopy.lw.inUse = 'lw';
              oppTeamCopy.lw.inGame = game.id;
              break;
            case game.awayTeam.c:
              oppTeamCopy.c = dude;
              oppTeamCopy.c.inUse = 'c';
              oppTeamCopy.c.inGame = game.id;
              break;
            case game.awayTeam.rw:
              oppTeamCopy.rw = dude;
              oppTeamCopy.rw.inUse = 'rw';
              oppTeamCopy.rw.inGame = game.id;
              break;
            case game.awayTeam.d1:
              oppTeamCopy.d1 = dude;
              oppTeamCopy.d1.inUse = 'd1';
              oppTeamCopy.d1.inGame = game.id;
              break;
            case game.awayTeam.d2:
              oppTeamCopy.d2 = dude;
              oppTeamCopy.d2.inUse = 'd2';
              oppTeamCopy.d2.inGame = game.id;
              break;
            case game.awayTeam.g:
              oppTeamCopy.g = dude;
              oppTeamCopy.g.inUse = 'g';
              oppTeamCopy.g.inGame = game.id;
              break;          
            default:
              break;
          }
        }
      })
      gameStateDispatch({type:'observingGame'})
    }else{
      // User is Either away team, hasnt joined yet, or just viewing it.
      relevantGuys.forEach((dude) => {
        if(dude.tokenId > 0){
          switch (dude.tokenId) {
            case game.awayTeam.lw:
              teamCopy.lw = dude;
              teamCopy.lw.inUse = 'lw';
              teamCopy.lw.inGame = game.id;
              break;
            case game.awayTeam.c:
              teamCopy.c = dude;
              teamCopy.c.inUse = 'c';
              teamCopy.c.inGame = game.id;
              break;
            case game.awayTeam.rw:
              teamCopy.rw = dude;
              teamCopy.rw.inUse = 'rw';
              teamCopy.rw.inGame = game.id;
              break;
            case game.awayTeam.d1:
              teamCopy.d1 = dude;
              teamCopy.d1.inUse = 'd1';
              teamCopy.d1.inGame = game.id;
              break;
            case game.awayTeam.d2:
              teamCopy.d2 = dude;
              teamCopy.d2.inUse = 'd2';
              teamCopy.d2.inGame = game.id;
              break;
            case game.awayTeam.g:
              teamCopy.g = dude;
              teamCopy.g.inUse = 'g';
              teamCopy.g.inGame = game.id;
              break;  
            case game.homeTeam.lw:
              oppTeamCopy.lw = dude;
              oppTeamCopy.lw.inUse = 'lw';
              oppTeamCopy.lw.inGame = game.id;
              break;
            case game.homeTeam.c:
              oppTeamCopy.c = dude;
              oppTeamCopy.c.inUse = 'c';
              oppTeamCopy.c.inGame = game.id;
              break;
            case game.homeTeam.rw:
              oppTeamCopy.rw = dude;
              oppTeamCopy.rw.inUse = 'rw';
              oppTeamCopy.rw.inGame = game.id;
              break;
            case game.homeTeam.d1:
              oppTeamCopy.d1 = dude;
              oppTeamCopy.d1.inUse = 'd1';
              oppTeamCopy.d1.inGame = game.id;
              break;
            case game.homeTeam.d2:
              oppTeamCopy.d2 = dude;
              oppTeamCopy.d2.inUse = 'd2';
              oppTeamCopy.d2.inGame = game.id;
              break;
            case game.homeTeam.g:
              oppTeamCopy.g = dude;
              oppTeamCopy.g.inUse = 'g';
              oppTeamCopy.g.inGame = game.id;
              break;          
            default:
              break;
          }
        }
      })
      if(game.open === true){
        gameStateDispatch({type:'inGame'})
      }else{
        gameStateDispatch({type:'observingGame'})
      }
    }
    dashboardDispatch({type:'setTeams',payload:{game:game, myTeam:teamCopy, oppTeam:oppTeamCopy}})

    props.exit(props.msg);
    Router.push(`/game/${gameId}`);
    return;
    } catch (er) {
      console.log("Go To game Error");
      return;
    }

  }

  switch (props.msg.type) {
    case 'offer':
      return (
        <div className={styles.rinkDiv}>
          
                <p>{props.msg.message}</p>
                <hr className={styles.smallRedLine}/>
                <p>{props.msg.type}</p>
                <p>Regarding: {props.msg.regarding}</p>
                <hr className={styles.blueLine}/>
                <p>OFFER:</p>
                <p>${props.msg.value} {JSON.stringify(props.msg.tokens)}</p>
                <hr className={styles.centerLine}/>
                <button className={styles.pfButton} onClick={() => props.accept(props.msg)}>ACCEPT</button>
                <hr className={styles.blueLine}/>
                <button className={styles.pfButton} onClick={() => props.decline(props.msg)}>DECLINE</button>
                <hr className={styles.smallRedLine}/>
                <button className={styles.pfButton} onClick={() => props.counter(props.msg)}>COUNTER</button>
    
      
        </div>
      )
    case 'offerDeclined':
      return (
        <div className={styles.rinkDiv}>
          
                <p>{props.msg.message}</p>
                <hr className={styles.smallRedLine}/>
                <p>{props.msg.type}</p>
                <p>Regarding: {props.msg.regarding}</p>
                <hr className={styles.blueLine}/>
                <h2>OFFER DECLINED</h2>
                
                <hr className={styles.centerLine}/>
                <p>Offer Details:</p>
                <hr className={styles.blueLine}/>
                <button className={styles.pfButton} onClick={() => props.exit(props.msg)}>CLEAR</button>

                <hr className={styles.smallRedLine}/>
    
      
        </div>
      )
    case 'offerAccepted':
      return (
        <div className={styles.rinkDiv}>
          
                <p>{props.msg.message}</p>
                <hr className={styles.smallRedLine}/>
                <p>{props.msg.type}</p>
                <p>Regarding: {props.msg.regarding}</p>
                <hr className={styles.blueLine}/>
                <p>OFFER ACCEPTED</p>
                <p>${props.msg.value} {JSON.stringify(props.msg.tokens)}</p>
                <hr className={styles.centerLine}/>
                <p>SHOW OFFER DETAILS</p>
                <hr className={styles.blueLine}/>
                <p>DETAILS 2</p>
                <hr className={styles.smallRedLine}/>
                <button className={styles.pfButton} onClick={() => props.exit(props.msg)}>COOL</button>
    
      
        </div>
      )    
    case 'sold':  
      return (
        <div className={styles.rinkDiv}>
          
                <p>{props.msg.message}</p>
                <hr className={styles.smallRedLine}/>
                <p>{props.msg.type}</p>
                <p>Regarding: {props.msg.regarding}</p>
                <hr className={styles.blueLine}/>
                <p>TOKEN SOLD:</p>
                <p>details...</p>
                <hr className={styles.centerLine}/>
                <hr className={styles.blueLine}/>
                <hr className={styles.smallRedLine}/>
                <button className={styles.pfButton} onClick={() => props.exit(props.msg)}>COOL</button>
    
      
        </div>
      )
    case 'gameOverW':
      return (
        <div className={styles.rinkDiv}>
          
                <p>{props.msg.message}</p>
                <hr className={styles.smallRedLine}/>
                <p>You won game {props.msg.regarding}!</p>
               
                <hr className={styles.blueLine}/>
               
                <p>details...</p>
                <hr className={styles.centerLine}/>
                <p>details...</p>
                <hr className={styles.blueLine}/>
                <button className={styles.pfButton} onClick={() => goToGame(props.msg.regarding)}>GO THERE</button>

                <hr className={styles.smallRedLine}/>
                <button className={styles.pfButton} onClick={() => props.exit(props.msg)}>CLEAR</button>
    
      
        </div>
      )
    case 'gameOverL':
      return (
        <div className={styles.rinkDiv}>
          
                <p>{props.msg.message}</p>
                <hr className={styles.smallRedLine}/>
                <p>You lost game {props.msg.regarding}.</p>
               
                <hr className={styles.blueLine}/>
               
                <p>details...</p>
                <hr className={styles.centerLine}/>
                <p>details...</p>
                <hr className={styles.blueLine}/>
                <button className={styles.pfButton} onClick={() => goToGame(props.msg.regarding)}>GO THERE</button>

                <hr className={styles.smallRedLine}/>
                <button className={styles.pfButton} onClick={() => props.exit(props.msg)}>CLEAR</button>
    
      
        </div>
      )
    case 'gameOverT':
      return (
        <div className={styles.rinkDiv}>
          
                <p>{props.msg.message}</p>
                <hr className={styles.smallRedLine}/>
                <p>You tied game {props.msg.regarding}.</p>
               
                <hr className={styles.blueLine}/>
               
                <p>details...</p>
                <hr className={styles.centerLine}/>
                <p>details...</p>
                <hr className={styles.blueLine}/>
                <button className={styles.pfButton} onClick={() => goToGame(props.msg.regarding)}>GO THERE</button>

                <hr className={styles.smallRedLine}/>
                <button className={styles.pfButton} onClick={() => props.exit(props.msg)}>CLEAR</button>
    
      
        </div>
      )
      case 'gameJoined':
        return (
          <div className={styles.rinkDiv}>
            
                  <p>{props.msg.message}</p>
                  <hr className={styles.smallRedLine}/>
                  <p>A player joined game {props.msg.regarding}!</p>
                 
                  <hr className={styles.blueLine}/>
                 
                  <p>details...</p>
                  <hr className={styles.centerLine}/>
                  <p>details...</p>
                  <hr className={styles.blueLine}/>
                  <button className={styles.pfButton} onClick={() => goToGame(props.msg.regarding)}>GO THERE</button>
  
                  <hr className={styles.smallRedLine}/>
                  <button className={styles.pfButton} onClick={() => props.exit(props.msg)}>CLEAR</button>
      
        
          </div>
        )   
    default:
      return (
        <div className={styles.rinkDiv}>
          
                <p>{props.msg.message}</p>
                <hr className={styles.smallRedLine}/>
                <p>{props.msg.type}</p>
                <p>Regarding: {props.msg.regarding}</p>
                <hr className={styles.blueLine}/>
                <p>OFFER:</p>
                <p>${props.msg.value} {JSON.stringify(props.msg.tokens)}</p>
                <hr className={styles.centerLine}/>
                <button className={styles.pfButton} onClick={() => props.accept(props.msg)}>ACCEPT</button>
                <hr className={styles.blueLine}/>
                <button className={styles.pfButton} onClick={() => props.decline(props.msg)}>DECLINE</button>
                <hr className={styles.smallRedLine}/>
                <button className={styles.pfButton} onClick={() => props.counter(props.msg)}>COUNTER</button>
    
      
        </div>
      )
  }

}

export default Message