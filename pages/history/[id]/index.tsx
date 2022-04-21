import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css';
import { useRouter } from 'next/router'
import HistoryCard from '../../../components/HistoryCard';
import { useEffect,useState } from 'react';
import {getUsersTxAndMsg} from '../../../context/DashboardContext';
import { TxType } from '../../../utility/constants';
const History: NextPage = () => {
    const Router = useRouter();
    const {id} = Router.query;

    const [ts,setTs] = useState<TxType[]>([]);

    useEffect(() => {
      const initHistory = async() => {
        // get all transactions / messages
        if(typeof id !== 'string')throw new Error("Error initing histyory");
        const mandt = await getUsersTxAndMsg(id);
        if(mandt === false)throw new Error("Error hgetting txs");
        setTs(mandt);
    
      }
      initHistory();
    
      return () => {
        
      }
    }, [])
    
    return (
        <div className={styles.mainContainer}>
            <h2>HISTORY PAGE QUERY: {id}</h2>
            <div className={styles.contentContainerColumn}>
                <h3>Transactions</h3>

            {ts.filter(t => t.tx === true).map((tx) => {
                return (
                    <p key={tx.id}>{JSON.stringify(tx)}</p>
                )
            })}
            </div>
            <div className={styles.contentContainerColumn}>
                <h3>Messages</h3>
            {ts.filter(t => t.tx === false).map((m) => {
                return (
                    <p key={m.id}>{JSON.stringify(m)}</p>
                )
            })}
             </div>
            <HistoryCard />
        </div>
    )
}
export default History