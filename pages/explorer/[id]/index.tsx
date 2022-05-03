import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css'
import { useRouter } from 'next/router'
import { getIpfsUrl, getPlayerFromToken } from '../../../utility/helpers'
import { CardType, nobody } from '../../../utility/constants'
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
    const {activeGames} = useDashboard();
    const cardSelectHandler = (e:any) => {
        e.preventDefault();
        try {
            const {whatCard} = e.target.elements;
     
            const whereWeGoing = whatCard.value;
            console.log("HUH", whereWeGoing);
            setCardIndex(whereWeGoing);
            Router.push(`/explorer/${whereWeGoing}`)
   
        } catch (er) {
            console.log("rror: ", er);
        }
    }
    // useEffect(() => {
   
    //     const init = async() => {
    //         try {
    //             const co = await getPlayerFromToken(cardIndex,tonightsGames);
    //             if(co === false) throw new Error("Error get player from token.");
    //             console.log("SAetting card");
    //             setCCard(co);
    //         } catch (er) {
    //             console.log("Error: ", er);
    //         }
         
    //     }
    //     init();
    
    //   return () => {
    
    //   }
    // },[cardIndex])
    useEffect(() => {
        let didCancel = false;
        const getData = async() => {
            if(!didCancel){
                let player = await getPlayerFromToken(cardIndex, tonightsGames, activeGames);
                let minted = await getMinted();
                console.log(`Player is:`,player);
                if(player === false || minted === false) throw new Error("Error get player from token.");
                setCCard(player);
                setOwned(minted.indexOf(cardIndex) > -1);
               
            }
        }
        getData();
    
      return () => {
        didCancel = true;
      }
    }, [cardIndex])
    
    return (
        <div className={styles.mainContainer}>
            <h2>EXPLORER</h2>
            <div className={styles.contentContainer}>
                <form onSubmit={cardSelectHandler}>
                <div className={styles.inputDiv}>
                <label htmlFor="whatCard">Token ID:  </label><br />
                <input name="whatCard" id="whatCard" type="number" placeholder="1" required/>
                </div><br />
                <button className={styles.pfButton} type="submit">GO</button>

                </form>
            </div>
            <div className={styles.contentContainerColumn}>
                
                <ExplorerCard card={cCard} image={url} />
                {owned ? <button className={styles.pfButton}>MAKE TRADE OFFER TO CARD OWNER...</button>: <h3>CARD STILL AVAILABLE</h3>}
            </div>
        </div>
    )
}
export default Explorer