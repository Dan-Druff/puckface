import { MessageCompType } from "../utility/constants"
import styles from '../styles/All.module.css';
const Message = (props:MessageCompType) => {


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
                <p>${props.msg.value} {props.msg.id}</p>
                <hr className={styles.centerLine}/>
                <hr className={styles.blueLine}/>
                <hr className={styles.smallRedLine}/>
                <button className={styles.pfButton} onClick={() => props.exit(props.msg)}>COOL</button>
    
      
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