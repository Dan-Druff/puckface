import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import BenchCard from '../components/BenchCard'
import { useDashboard } from '../context/DashboardContext'
import { useRouter } from 'next/router'
import { GamePosition } from '../utility/constants'
import AuthRoute from '../hoc/authRoute'
const Lockerroom: NextPage = () => {
    const {dashboard, tradeArray} = useDashboard();
    const Router = useRouter();
    const cardSelect = async(posId:GamePosition, tokenId:number) => {
        try {
            console.log("You selected card: ", tokenId, posId);
            Router.push(`/card/${tokenId.toString()}`);
        } catch (er) {
            console.log("Card select error: ",er);
        }
    }
    return (
        <AuthRoute>
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <h2>ALL CARDS:</h2>
            </div>
            {dashboard.length > 0 ? 
                <div className={styles.contentContainer}>
                    <div className={styles.lockerroom}>
                    {dashboard.map((card) => {
                        return (
                            <BenchCard key={card.tokenId} active={true} card={card} func={cardSelect} posId={card.inUse} avail={tradeArray.indexOf(card.tokenId) > -1 ? false : true}/>
                        )
                    })}
                    </div>
                </div>
            : 
            <div className={styles.contentContainer}>
                <h3>NO CARDS YET.</h3>
            </div>
            }
        
        </div>
        </AuthRoute>
    )
}
export default Lockerroom