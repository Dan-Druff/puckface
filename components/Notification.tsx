
import styles from '../styles/All.module.css';
import { NoteType } from '../context/DashboardContext';
const Notification = ({notObj}:{notObj:NoteType}) => {
    const hello = () => {
        console.log("Hello????");
    }
    return (
    <div className={styles.notification}>
        <br /><br /><br />
        <hr className={styles.smallRedLine}/>
        <h2>{notObj.message}</h2>
        <hr className={styles.blueLine}/>
        <br />
        {notObj.twoButtons && <button className={styles.pfButton} onClick={() => notObj.mainFunction()}>{notObj.mainTitle}</button>}
        <hr className={styles.centerLine}/>
        <br />
        <button className={styles.pfButton} onClick={() => notObj.cancelFunction()}>{notObj.cancelTitle}</button>

        <hr className={styles.blueLine}/>
        <br /><br />
        <hr className={styles.smallRedLine} />
    </div>
    )
}
export default Notification