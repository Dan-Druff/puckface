import { MessageCompType } from "../utility/constants"
import styles from '../styles/All.module.css';
import { useRouter } from "next/router";
const Message = (props:MessageCompType) => {
  const Router = useRouter();
  const goToGame = async(gameId:string) => {
    props.exit(props.msg);
    Router.push(`/game/${gameId}`);
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