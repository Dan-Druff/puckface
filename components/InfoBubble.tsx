import styles from '../styles/All.module.css';
import { BubbleType } from '../utility/constants';

const InfoBubble = ({bub}:{bub:BubbleType}) => {
  let x = '';
  try {
    x = bub.head.substring(0,8);
  } catch (er) {
    
  }
  return (
    <div className={styles.bubble}>
        <h3>{x}</h3>
        <h5>{bub.data.toString()}</h5>
    </div>
  )
}

export default InfoBubble