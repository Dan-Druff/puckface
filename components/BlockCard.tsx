import styles from '../styles/All.module.css';
import { BenchCardType} from '../utility/constants';
import Image from 'next/image'

const BlockCard = (props:BenchCardType) => {

    if(props.active){
        return (
            <div className={styles.benchCard} onClick={() => props.func(props.posId, props.card.tokenId)}>
                {/* <div className={styles.imageContainer}>
               <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
                </div> */}
                <img alt='alt img' className={styles.cardImage} src={props.card.image}/>
               {props.card.playingTonight && <p>Playing</p>}
                
                </div>
          )
    }else{
        return (
            <div className={styles.benchCard}>
               
                <img alt='alt img' className={styles.cardImage} src={props.card.image}/>
                {/* <div className={styles.imageContainer}>
               <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
                </div> */}
               {props.card.playingTonight && <p>Playing</p>}
                
                </div>
          )
    }

}

export default BlockCard