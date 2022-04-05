import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard,NoteType } from '../context/DashboardContext'
import AuthRoute from '../hoc/authRoute'


const Dashboard: NextPage = () => {
    const {pucks, dashboardDispatch, dashboard} = useDashboard();
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
        <AuthRoute>
            <div className={styles.mainContainer}>
                <h2>Dashboard</h2>
            <p>Pucks: {pucks}</p>
            {dashboard.map((guy) => {
                return (
                    <div key={guy.tokenId}>
                        <p>Guys nmae: {guy.playerName}</p>
                    </div>
                )
            })}
            <button onClick={() => dashboardDispatch({type:'notify',payload:{notObj:funnyObj}})}>NOTIFY</button>
            </div>
        </AuthRoute>
    )
}
export default Dashboard