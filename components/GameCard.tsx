
import styles from '../styles/All.module.css';
import { BenchCardType } from '../utility/constants';

    const GameCard = (props:BenchCardType) => {

    if(props.active){
        return (
            <div className={styles.testCard} onClick={() => props.func(props.posId, props.card.tokenId)}>
               
                <img className={styles.cardImage} src={props.card.image}/>
             
                <p>{props.card.points}</p>
                </div>
          )
    }else{
        return (
            <div className={styles.testCard}>
               
                <img className={styles.cardImage} src={props.card.image}/>
    
                <p>{props.card.points}</p>
                </div>
          )
    }

}

export default GameCard