import { OfferCardType } from "../utility/constants"
import styles from '../styles/All.module.css';

const OfferCard = (props:OfferCardType) => {
  return (
    // <div className={styles.benchCard}>
    <div onClick={() => props.func(props.card)} className={props.selected ?  styles.benchCardSelected : styles.benchCardUnSelected}>
        <img alt='alt img' className={styles.cardImage} src={props.card.image}/>
        <p>{props.card.rarity} {props.card.playerName}</p>
    </div>
  )
}

export default OfferCard