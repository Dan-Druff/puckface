import styles from '../styles/All.module.css';
import { TxCompType } from '../utility/constants';
import { dateReader } from '../utility/helpers';
const Tx = (props:TxCompType) => {
console.log("What is date: ", props.tx.when);
  return (
    <div className={styles.rinkDiv}>
        <h3>Transaction:</h3>
        <hr className={styles.smallRedLine}/>
        {/* <p>{ds.fullDate}</p> */}
        <hr className={styles.blueLine}/>
        <p>{props.tx.type}</p>
        <hr className={styles.centerLine}/>
        <p>Regarding: {props.tx.regarding}</p>
        <hr className={styles.blueLine}/>
        <p>More Details:</p>
        <hr className={styles.smallRedLine}/>
    </div>
  )
}

export default Tx