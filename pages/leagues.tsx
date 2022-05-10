import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import AuthRoute from '../hoc/authRoute'
import {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { useDashboard, getOpenLeagues } from '../context/DashboardContext'
import { LeagueType } from '../utility/constants';
import { useAuth } from '../context/AuthContext';
const Leagues: NextPage = () => {
    const {userData} = useAuth();
    const Router = useRouter();
    const {activeLeagues} = useDashboard();
    const [openLeagues,setOpenLeagues] = useState<LeagueType[]>([]);
   
    const goToLeague = (lId:string) => {
       try {
        Router.push(`/league/${lId}`);
         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    useEffect(() => {
      const initLeagues = async() => {
         try {
             if(userData === null || userData.userEmail === null)throw new Error("Error UD");
            const ls = await getOpenLeagues(userData.userEmail);
            if(ls === false)throw new Error("Error getting open leagues");
            setOpenLeagues(ls);
           return;
         }catch(er){
           console.log(`🚦Error: ${er}🚦`)
           return;
         }
      }
      
      initLeagues();
      return () => {
        
      }
    }, [])
    
    return (
        <AuthRoute>
        <div className={styles.mainContainer}>
        <h2>Leagues:</h2>
        <hr className={styles.smallRedLine}/>
        <div className={styles.contentContainerColumn}>
            <h2>Active Leagues:</h2>
            {activeLeagues.length > 0 ? 
            <>
                {activeLeagues.map((al) => {
                    return (
                        <div key={al} className={styles.nhlTick}>
                            <p>League: {al}</p>
                            <button className={styles.pfButton} onClick={() => goToLeague(al)}>Go There →</button>
                        </div>
                    )
                })}
            </> 
            : 
            <p>No Active Leagues</p>
            }
        </div>
        <hr className={styles.blueLine}/>

        <div className={styles.contentContainerColumn}>
            <h2>OPEN LEAGUES:</h2>
            {openLeagues.length > 0 ? 
            <>
      
                {openLeagues.map((l) => {
                    return (
                        <div key={l.id} className={styles.nhlTick}>
                            <p>Name: {l.name}</p>
                            <p>Value: {l.champValue}</p>
                            <button className={styles.pfButton} onClick={() => goToLeague(l.id)}>Go There →</button>
                        </div>
                    )
                })}
            </> 
            : 
            <h2>No Open Games to show.</h2>
            }
        </div>
        <hr className={styles.centerLine}/>

    
  
  
      </div>
      </AuthRoute>
    )
}
export default Leagues