import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard } from '../context/DashboardContext'


const Dashboard: NextPage = () => {
    const {pucks} = useDashboard();
    console.log("Player has pucks: ", pucks);
  

    return (
        <div className={styles.mainContainer}>
            <h2>Dashboard</h2>
           <p>Pucks: {pucks}</p>
        </div>
    )
}
export default Dashboard