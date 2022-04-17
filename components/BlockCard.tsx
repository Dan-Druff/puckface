import styles from '../styles/All.module.css';
import { FreeAgentCardType, FreeAgentType} from '../utility/constants';
import Image from 'next/image'

const BlockCard = (props:FreeAgentCardType) => {

    const editFreeAgent = (agent:FreeAgentType) => {
        console.log("EDITIING AGENT ", agent.tokenId);
    }

    return (
        <div className={styles.benchCard}>
           
            <img alt='alt img' className={styles.cardImage} src={props.agent.image}/>
            {/* <div className={styles.imageContainer}>
           <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
            </div> */}
           <button className={styles.pfButton} onClick={() => editFreeAgent(props.agent)}>CHANGE</button>
            
            </div>
      )

}

export default BlockCard