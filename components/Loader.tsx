import styles from '../styles/Loader.module.css';
import { LoaderType } from '../utility/constants';
const Loader = (props:LoaderType) => {
    return (
        <div className={styles.mainContainer}>
            <h3>{props.message}</h3>
            <div className={styles.ldscircle}><div></div></div>
        </div>
    )
}
export default Loader