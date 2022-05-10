import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css'
import { useRouter } from 'next/router'
import { getIpfsUrl, getPlayerFromToken } from '../../../utility/helpers'
import { CardType, nobody, NoteType } from '../../../utility/constants'
import { useEffect, useRef, useState } from 'react'
import { useNHL } from '../../../context/NHLContext'
import ExplorerCard from '../../../components/ExplorerCard'
import { getMinted, useDashboard } from '../../../context/DashboardContext'

const Explorer: NextPage = () => {
    const {tonightsGames} = useNHL();
    const Router = useRouter();
    const {id} = Router.query;
    const idint = Number(id);
    const url = getIpfsUrl('png',idint);
    const [owned,setOwned] = useState<boolean>(false);
    const [cCard, setCCard] = useState<CardType>(nobody);
    const [cardIndex,setCardIndex] = useState<number>(idint);
    const cardNumber = useRef(1);
    const {activeGames, dashboardDispatch} = useDashboard();
    const makeOffer = () => {
        let n : NoteType = {
            cancelFunction:() => {},
            mainFunction:() => {},
            mainTitle:'',
            cancelTitle:"Got It",
            colorClass:'',
            message:"Feature Coming Soon....",
            twoButtons:false
        }
        dashboardDispatch({type:'notify',payload:{notObj:n}});
    }
    const cardSelectHandler = async(e:any) => {
        e.preventDefault();
        try {
            const {whatCard} = e.target.elements;
     
            const whereWeGoing = whatCard.value;
            console.log("HUH", whereWeGoing);
            let p = await getPlayerFromToken(whereWeGoing,tonightsGames,activeGames);
            let m = await getMinted();
            if(p === false || m === false) throw new Error("Error get player from token.");
            console.log(`Minted!!!==== ${m}`);
            setCCard(p);
            setOwned(m.indexOf(Number(whereWeGoing)) > -1);
            setCardIndex(Number(whereWeGoing));
            console.log(`🏝 What is this result: ${m.indexOf(Number(whereWeGoing)) > -1}`);

            Router.push(`/explorer/${whereWeGoing}`)
   
        } catch (er) {
            console.log("rror: ", er);
        }
    }

    useEffect(() => {
     const initEx = async() => {
        try {
            let player = await getPlayerFromToken(cardIndex, tonightsGames, activeGames);
            let minted = await getMinted();
            console.log(`Player is:`,cardIndex);
            if(player === false || minted === false) throw new Error("Error get player from token.");
            setCCard(player);
            setOwned(minted.indexOf(cardIndex) > -1);
            console.log(`🍟 What is this result: ${minted.indexOf(cardIndex) > -1}`);
          return;
        }catch(er){
          console.log(`🚦Error: ${er}🚦`)
          return;
        }
     }
     initEx();
   
        
    
      return () => {
 
      }
    }, [])
    
    return (
        <div className={styles.mainContainer}>
            <h2>EXPLORER</h2>
            <div className={styles.contentContainer}>
                <div className={styles.rinkDiv}>
                    <form onSubmit={cardSelectHandler}>
                    <hr className={styles.smallRedLine}/>
                    <div className={styles.inputDiv}>
                    <label htmlFor="whatCard">Token Search:  </label><br />
                    <input name="whatCard" id="whatCard" type="number" placeholder="1" required/>
                    </div><br />
                    <hr className={styles.blueLine}/>

                    <button className={styles.pfButton} type="submit">GO</button>
                    <hr className={styles.centerLine}/>

                    </form>
                </div>
            </div>
       
            <div className={styles.contentContainer}>
                <div className={styles.nhlTick}>
                    <h3>Search by Team</h3>
                    <input type='text'/>
                    <button className={styles.pfButton}>GO →</button>
                </div>
                <div className={styles.nhlTick}>
                    <h3>Search by Position</h3>
                    <input type='select'/>

                    <button className={styles.pfButton}>GO →</button>

                </div>
                <div className={styles.nhlTick}>
                    <h3>Search by Rarity</h3>
                    <input type='text'/>

                    <button className={styles.pfButton}>GO →</button>

                </div>
                <div className={styles.nhlTick}>
                    <h3>Search by Player</h3>
                    <input type='text'/>

                    <button className={styles.pfButton}>GO →</button>

                </div>
            </div>
            <div className={styles.contentContainerColumn}>
                
                <ExplorerCard card={cCard} image={url} />
                {owned ? <button className={styles.pfButton} onClick={() => makeOffer()}>MAKE TRADE OFFER TO CARD OWNER...</button>: <h3>CARD STILL AVAILABLE</h3>}
            </div>
        </div>
    )
}
export default Explorer