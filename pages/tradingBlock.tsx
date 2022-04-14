import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard,addToFreeAgents,getFreeAgents } from '../context/DashboardContext'
import BlockCard from '../components/BlockCard'
import { GamePosition } from '../utility/constants'
import AuthRoute from '../hoc/authRoute'

const TradingBlock: NextPage = () => {
    const {addToTradeArrayDB, tradeArray,dashboardDispatch, dashboard} = useDashboard();
    const doTheAdd = async(posId:GamePosition,tokenId:number) => {
        try {
            console.log("DO THE ADD...");
            let agents = await getFreeAgents();
            if(agents === false) throw new Error("Error getting agents");
            agents.push(tokenId);
            const updRes = await addToFreeAgents(agents);
          
            const addRes = await addToTradeArrayDB(tokenId);
           
            if(addRes && updRes){
                dashboardDispatch({type:'addToTradingBlock',payload:{tokenId:tokenId}});
            }else{
                throw new Error("🚦Could not update db🚦");
            }
         
            return;
        } catch (er) {
            console.log("Error", er);
            return;
        }
    }
    return (
        <AuthRoute>
        <div className={styles.mainContainer}>
           <div className={styles.contentContainer}>
                <h2>TRADING BLOCK</h2>
                
            </div>
            <div className={styles.contentContainer}>
       
            {tradeArray.length > 0 ? 
            <>
           
            <div className={styles.contentContainer}>
                <h2>Guys To Trade:</h2>
                
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.lockerroom}>
                {dashboard.filter(c => tradeArray.includes(c.tokenId)).map((cd) => {
                return (
                    <BlockCard key={cd.tokenId} card={cd} active={true} func={() => {}} posId='none' />
                )
            })}
                </div>
            </div>
            </>
            : 
            <p>No Guys On the trading block</p>
            }
            </div>
            <div className={styles.contentContainer}>
                <h2>ALL GUYS:</h2>
            <div className={styles.lockerroom}>
                    {dashboard.map((card) => {
                        return (
                            <BlockCard key={card.tokenId} active={true} card={card} func={doTheAdd} posId={card.inUse} />
                        )
                    })}
                    </div>
            </div>
        </div>
        </AuthRoute>
    )
}
export default TradingBlock