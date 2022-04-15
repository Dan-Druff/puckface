import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import AuthRoute from '../hoc/authRoute'
import { useState, useEffect } from 'react'
import { CardType, FreeAgentType } from '../utility/constants'
import { useDashboard, getFreeAgents } from '../context/DashboardContext'
import { getPlayerFromToken } from '../utility/helpers';
import { useNHL } from '../context/NHLContext'
// import BenchCard from '../components/BenchCard'
import FreeAgentCard from '../components/FreeAgentCard';

const FreeAgents: NextPage = () => {
    const {tonightsGames} = useNHL();
    const {tradeArray} = useDashboard();
    // const [cards, setcards] = useState<CardType[]>([]);
    const [cards,setCards] = useState<FreeAgentType[]>([]);
    useEffect(() => {
        const initFreeAgents = async() => {
            let allCards:CardType[] = [];
            let free = await getFreeAgents();
            if(free === false) throw new Error("Error getting free aganets");
      
            const rez = await Promise.all(free.map(async(agent:any) => {
              let py = await getPlayerFromToken(agent.tokenId, tonightsGames);
              if (py === false) throw new Error("Error getting player from token");
              let o:FreeAgentType = {
                  ask:agent.ask,
                  by:agent.by,
                  tokenId:py.tokenId,
                  image:py.image,
                  playerId:py.playerId,
                  playerName:py.playerName,
                  rarity:py.rarity,
                  pos:py.pos,
                  value:agent.value

              }
                return o;

            }))
            console.log("SETTING ALL CARDS: ", rez);
            setCards(rez);
         
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
                            <FreeAgentCard key={c.tokenId} agent={c}/>
                            // <BenchCard key={c.tokenId} card={c} posId='none' func={() => {}} active={true}/>
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