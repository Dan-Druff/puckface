import Card from '../pages/card/[id]';
import styles from '../styles/All.module.css';
import { ExplorerCard} from '../utility/constants';
// import Image from 'next/image'

const ExplorerCard = (props:ExplorerCard) => {

    return (
        <div className={styles.benchCard}>
           
            <img alt='alt img' className={styles.cardImage} src={props.image}/>
            {/* <div className={styles.imageContainer}>
           <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
            </div> */}
           {/* {props.card.playingTonight && <p>Playing</p>} */}
            <p>Name: {props.card.playerName}</p>
            <p>Rarity: {props.card.rarity}</p>
            <p>Position: {props.card.pos}</p>
            <p>Token: {props.card.tokenId}</p>
       

            </div>
      )

}

export default ExplorerCard