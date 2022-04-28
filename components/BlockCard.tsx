import styles from '../styles/All.module.css';
import { FreeAgentCardType, FreeAgentType, BlockCardType} from '../utility/constants';
import Image from 'next/image'

const BlockCard = (props:BlockCardType) => {

 

    return (
        <div className={styles.benchCard}>
           
            <img alt='alt img' className={styles.cardImage} src={props.agent.image}/>
            {/* <div className={styles.imageContainer}>
           <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
            </div> */}
            <p>{props.agent.ask}</p>
            <p>{props.agent.rarity} {props.agent.playerName} {props.agent.tokenId}</p>
            <p>${props.agent.value}</p>
            <button className={styles.pfButton} onClick={() => props.setOffer('none', props.agent.tokenId)}>EDIT FREE AGENT</button>
            <button className={styles.pfButton} onClick={() => props.removeAgent(props.agent.tokenId)}>REMOVE FROM FREE AGENTS</button>
            </div>
      )

}

export default BlockCard