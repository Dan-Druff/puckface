import styles from '../styles/All.module.css';
import { CardType } from '../utility/constants';
const RightBenchCard = ({card}:{card:CardType}) => {
  return (
    <div className={styles.rightBenchCard}>
       
        {/* <img className={styles.cardImage} src="https://ipfs.io/ipfs/bafybeihpn2rwqud7ud26iyj7lpkjok4ytn2wwcnzmkrrsk4nau2dtnykxi/pics/4.png"/> */}
        <img alt='alt img' className={styles.cardImage} src={card.image}/>

        {card.playingTonight ? <p>Playing</p> : <p>No Game</p>}
        </div>
  )
}

export default RightBenchCard