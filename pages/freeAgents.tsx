import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import AuthRoute from '../hoc/authRoute'
import { useState, useEffect } from 'react'
import { CardType } from '../utility/constants'
import { useDashboard, getFreeAgents } from '../context/DashboardContext'
import { getPlayerFromToken } from '../utility/helpers';
import { useNHL } from '../context/NHLContext'
import BenchCard from '../components/BenchCard'
const FreeAgents: NextPage = () => {
    const {tonightsGames} = useNHL();
    const {tradeArray} = useDashboard();
    const [cards, setcards] = useState<CardType[]>([]);

    useEffect(() => {
        const initFreeAgents = async() => {
            let allCards:CardType[] = [];
            let free = await getFreeAgents();
            if(free === false) throw new Error("Error getting free aganets");
            // console.log("UE IS: ", free);
            // free.forEach(async(token:number) => {
            //     let p = await getPlayerFromToken(token, tonightsGames);
            //     if (p === false) throw new Error("Error getting player from token");
            //     allCards.push(p);
            // })
            const rez = await Promise.all(free.map(async(tok:any) => {
              let py = await getPlayerFromToken(tok.token, tonightsGames);
              if (py === false) throw new Error("Error getting player from token");
                return py;

            }))
            console.log("SETTING ALL CARDS: ", rez);
            setcards(rez);
         
        }
        initFreeAgents();
    
      return () => {

      }
    }, [])
    
    return (
        <AuthRoute>
        <div className={styles.mainContainer}>
            <h2>FREE AGENTS:</h2>
            {cards.length > 0 ? 
            <div className={styles.contentContainer}>
                <div className={styles.lockerroom}>
                    {cards.map((c) => {
                        return (
                            <BenchCard key={c.tokenId} card={c} posId='none' func={() => {}} active={true}/>
                        )
                    })}
                </div>
            </div>
            : 
            <h2>NO CURRENT FREE AGENTS</h2>
            }
        </div>
        </AuthRoute>
    )
}
export default FreeAgents