import styles from '../styles/All.module.css';
import { BenchCardType } from '../utility/constants';
const BenchCard = ({benchCardObj}:{benchCardObj:BenchCardType}) => {

    if(benchCardObj.active){
        return (
            <div className={styles.benchCard} onClick={() => benchCardObj.func(benchCardObj.posId, benchCardObj.card.tokenId)}>
               
                <img alt='alt img' className={styles.cardImage} src={benchCardObj.card.image}/>
               {benchCardObj.card.playingTonight && <p>Playing</p>}
                
                </div>
          )
    }else{
        return (
            <div className={styles.benchCard}>
               
                <img className={styles.cardImage} src={benchCardObj.card.image}/>
               {benchCardObj.card.playingTonight && <p>Playing</p>}
                
                </div>
          )
    }

}

export default BenchCard