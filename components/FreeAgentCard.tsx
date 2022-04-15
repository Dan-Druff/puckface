import styles from '../styles/All.module.css';
import Image from 'next/image'

import { FreeAgentCardType } from '../utility/constants';

const FreeAgentCard = (props:FreeAgentCardType) => {

    return (
        <div className={styles.benchCard} onClick={() => {}}>
            {/* <div className={styles.imageContainer}>
           <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
            </div> */}
            <img alt='alt img' className={styles.cardImage} src={props.agent.image}/>
            <p>{props.agent.rarity} {props.agent.playerName}</p>
            <p>${props.agent.value}</p>
            
            </div>
      )
   

}

export default FreeAgentCard