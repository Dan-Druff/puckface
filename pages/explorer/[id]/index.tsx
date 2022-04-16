import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css'
import { useRouter } from 'next/router'
import { getIpfsUrl, getPlayerFromToken } from '../../../utility/helpers'
import { CardType, nobody } from '../../../utility/constants'
import { useEffect, useRef, useState } from 'react'
import { useNHL } from '../../../context/NHLContext'
import ExplorerCard from '../../../components/ExplorerCard'

const Explorer: NextPage = () => {
    const {tonightsGames} = useNHL();
    const Router = useRouter();
    const {id} = Router.query;
    const idint = Number(id);
    const url = getIpfsUrl('png',idint);
    const [cCard, setCCard] = useState<CardType>(nobody);
    const [cardIndex,setCardIndex] = useState<number>(idint);
    const cardNumber = useRef(1);
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
                let player = await getPlayerFromToken(cardIndex, tonightsGames);
                if(player === false) throw new Error("Error get player from token.");
                setCCard(player);
               
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
            <div className={styles.contentContainer}>
                <ExplorerCard card={cCard} image={url} />
            </div>
        </div>
    )
}
export default Explorer