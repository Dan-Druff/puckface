import styles from '../styles/Loader.module.css';
const Loader = () => {
    return (
        <div className={styles.mainContainer}>
            <p>LOADING...</p>
            <div className={styles.ldscircle}><div></div></div>
        </div>
    )
}
export default Loader