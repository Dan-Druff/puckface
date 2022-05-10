import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css';
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react';
import { LeagueType } from '../../../utility/constants';
import { getLeagueFromDB } from '../../../context/DashboardContext';
const League: NextPage = () => {
    const Router = useRouter();
    const {id} = Router.query;
    const [currentLeague, setCurrentLeague] = useState<LeagueType>({name:'Name of League...',owner:'',id:'',created:new Date, startDate:new Date, endDate:new Date(2022,8,1), targetDate: new Date, numberOfTeams:32,open:true,playoffs:false,public:true,champValue:0,buyIn:0,perGame:0,coffer:0,teams:[],results:[],schedule:[]})
    
    useEffect(() => {
        
        const initLeague = async() => {
           try {
               if(typeof id === 'string'){
                const leeg = await getLeagueFromDB(id);
                if(leeg === false)throw new Error("Error gettin league from db");
                setCurrentLeague(leeg);
               }else{
                   throw new Error("ID is not string:");
               }
         
             return;
           }catch(er){
             console.log(`🚦Error: ${er}🚦`)
             return;
           }
        }
        initLeague();
      return () => {
        
      }
    }, [])
    
    return (
        <div className={styles.contentContainerColumn}>
           <h1>League Name: {currentLeague.name}</h1>
            <h2>League ID: {id}</h2>
           
            
        </div>
    )
}
export default League