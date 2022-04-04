import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard,NoteType } from '../context/DashboardContext'


const Dashboard: NextPage = () => {
    const {pucks, dashboardDispatch} = useDashboard();
    console.log("Player has pucks: ", pucks);
    const funnyFunction = () => {
        console.log("Calling funny function");
    }
    const canc = () => {
        dashboardDispatch({type:'cancelNotify'})
    }
    const funnyObj:NoteType = {
        mainTitle:'main butt',
        cancelTitle:'Cancel',
        twoButtons:true,
        message:'Youre a fuckin cunt',
        colorClass:'M/a',
        mainFunction:funnyFunction,
        cancelFunction:canc
    }

    return (
        <div className={styles.mainContainer}>
            <h2>Dashboard</h2>
           <p>Pucks: {pucks}</p>
           <button onClick={() => dashboardDispatch({type:'notify',payload:{notObj:funnyObj}})}>NOTIFY</button>
        </div>
    )
}
export default Dashboard