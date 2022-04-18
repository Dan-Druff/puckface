import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import AuthRoute from '../hoc/authRoute'
import { useState, useEffect } from 'react'
import { CardType, FreeAgentType, MessageType } from '../utility/constants'
import { useDashboard, getFreeAgents,sendMsgToUser } from '../context/DashboardContext'
import { createRandomId, getPlayerFromToken } from '../utility/helpers';
import { useNHL } from '../context/NHLContext'
import { useAuth } from '../context/AuthContext'
// import BenchCard from '../components/BenchCard'
import FreeAgentCard from '../components/FreeAgentCard';
import BuildAnOffer from '../components/BuildAnOffer'

const FreeAgents: NextPage = () => {
    const {userData} = useAuth();
    const {tonightsGames} = useNHL();
    const {tradeArray, dashboard, dashboardDispatch, prevPlayer, currentGame} = useDashboard();
    const [offering,setOffering] = useState<boolean>(false); 
    const [selectingCard, setSelectingCard] = useState<boolean>(false);
    const [cards,setCards] = useState<FreeAgentType[]>([]);
    const [offeredTokens, setOfferedTokens] = useState<number[]>([]);
    const [currentAgent,setCurrentAgent] = useState<FreeAgentType | false>(false);


    const cancelOffer = () => {
        setOfferedTokens([]);
        setSelectingCard(false);
        setOffering(false);
    }
    const setOffer = (agent:FreeAgentType) => {
        setOffering(true);
        setCurrentAgent(agent);
    }
    const submitTokens = () => {
        setSelectingCard(false);
        console.log("JHappy with tokens: ", offeredTokens);
    }
    const makeOfferHandler = async(e:any) => {
        e.preventDefault();
        try {
            const {offerValue} = e.target.elements;
            console.log("Value is: ", offerValue.value);
            if(userData === null || userData.userEmail === null)throw new Error("Error User Data");
            const h = createRandomId();
            if(currentAgent === false)throw new Error("Bad current agent data");
            let mg : MessageType = {
                value:Number(offerValue.value),
                by:userData.userEmail,
                id:h,
                message:"I'd like to offer you this for that...",
                regarding:currentAgent.id,
                tokens:offeredTokens,
                type:"counterOffer",
                when:new Date()
            }
            console.log("GOING TO RETURN: ", mg);
            const m = await sendMsgToUser(mg,currentAgent.by);
            if(m){
                console.log("Message sent to user: ", currentAgent.by);
            }else{
                throw new Error("Error sending message.");
            }
            // this is where i make a tx for the buyer

            // make a message and send to seller.
            return;
        } catch (er) {
            console.log("Error Making Offer", er);
            return;
        }
    }
    const addTokenToOffer = (token:number) => {
        try {
            setOfferedTokens([token,...offeredTokens]);
        } catch (er) {
            console.log("Error adding token to offer", er);

        }
    }
    const removeTokenFromOffer = (token:number) => {
        try {
     
            setOfferedTokens(offeredTokens.filter(t => t !== token));
        } catch (er) {
            console.log("Error removing token", er);

        }
    }
    const bringUpCardsToSelectFrom = () => {
        try {
            setSelectingCard(true);
        } catch (er) {
            console.log("Selecet a card error", er);
        }
    }
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
                  value:agent.value,
                  id:agent.id

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
         {selectingCard && <div className={styles.gameContainer}><BuildAnOffer guys={dashboard} add={addTokenToOffer} remove={removeTokenFromOffer} offeredTokens={offeredTokens} dismiss={cancelOffer} doAdd={submitTokens}/></div>}   
        <div className={styles.mainContainer}>
            {offering ? 
            <div className={styles.contentContainer}>
                <div className={styles.rinkDiv}>
                    <form onSubmit={makeOfferHandler}>
                        {currentAgent !== false && <h2>Offer options for {currentAgent.rarity} {currentAgent.playerName}</h2>}
                        {/* <h2>Offer Options for :</h2> */}
                        <hr className={styles.smallRedLine}/><br />
                        <div className={styles.inputDiv}>
                            <label htmlFor="offerValue"> $ VALUE:</label> 
                            <br />
                            <input name="offerValue" id="offerValue" type="number" placeholder="0" />
                        </div><br />
                        <hr className={styles.blueLine}/><br />
                        <p>Cards:</p>
                        <p>{JSON.stringify(offeredTokens)}</p><br />
                        <button className={styles.pfButton} type='button' onClick={() => bringUpCardsToSelectFrom()} >SELECT CARD(s) to OFFER</button>

                        <br /><br />
                        <hr className={styles.centerLine}/><br />
                        <button className={styles.pfButton} type="submit">SUBMIT OFFER</button>

                        <hr className={styles.blueLine}/><br />
                        <button className={styles.pfButton} type='button' onClick={() => cancelOffer()}>CANCEL</button>

                        <br />
                        <hr className={styles.smallRedLine}/><br />
                    </form>
                </div>
            </div> 
            :         
            <>
            <h2>FREE AGENTS:</h2>
            {cards.length > 0 ? 
            <div className={styles.contentContainer}>
                <div className={styles.lockerroom}>
                    {cards.map((c) => {
                        return (
                            <FreeAgentCard key={c.tokenId} agent={c} setOffer={setOffer}/>
                            // <BenchCard key={c.tokenId} card={c} posId='none' func={() => {}} active={true}/>
                        )
                    })}
                </div>
            </div>
            : 
            <h2>NO CURRENT FREE AGENTS</h2>
            }
            </>}
    
        </div>
        </AuthRoute>
    )
}
export default FreeAgents