import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import AuthRoute from '../hoc/authRoute'
import { useState, useEffect } from 'react'
import { CardType, FreeAgentType, LogActionType, MessageType, NoteType, TxType } from '../utility/constants'
import { useDashboard, getFreeAgents,sendMsgToUser, logOnTheFire, puckfaceLog } from '../context/DashboardContext'
import { createRandomId, getPlayerFromToken } from '../utility/helpers';
import { useNHL } from '../context/NHLContext'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
// import BenchCard from '../components/BenchCard'
import FreeAgentCard from '../components/FreeAgentCard';
import BuildAnOffer from '../components/BuildAnOffer'
import { useGameState } from '../context/GameState'

const FreeAgents: NextPage = () => {
    const {userData} = useAuth();
    const {tonightsGames} = useNHL();
    const {tradeArray, dashboard, dashboardDispatch, prevPlayer, currentGame} = useDashboard();
    const [offering,setOffering] = useState<boolean>(false); 
    const [selectingCard, setSelectingCard] = useState<boolean>(false);
    const [cards,setCards] = useState<FreeAgentType[]>([]);
    const [offeredTokens, setOfferedTokens] = useState<number[]>([]);
    const [currentAgent,setCurrentAgent] = useState<FreeAgentType | false>(false);
    const {gameStateDispatch} = useGameState();
    const Router = useRouter();

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
            if(userData === null || userData.userEmail === null || currentAgent === false)throw new Error("Error User Data");
            const tempId = createRandomId();
            
            let mg : MessageType = {
                value:Number(offerValue.value),
                by:userData.userEmail,
                id:tempId,
                message:"I'd like to offer you this for that...",
                regarding:currentAgent.id,
                tokens:offeredTokens,
                type:'offer',
                when:new Date(),
                state:'open',
                tx:false

            }
            
            const off : TxType = {
                value:Number(offerValue.value),
                by:userData.userEmail,
                id:tempId,
                regarding:currentAgent.id,
                tokens:offeredTokens,
                type:'submitOffer',
                when:new Date(),
                state:'open',
                tx:true,
                from:userData.userEmail,
                to:userData.userEmail,
                freeAgentToken:currentAgent.tokenId,
                mString:'offer'

            }
            const m = await sendMsgToUser(mg,currentAgent.by);
            const t = await puckfaceLog(off);
            if(m){
                if(t === false){
                    console.log("Error Logging");
                }
                console.log("Message sent to user: ", currentAgent.by);
                const n:NoteType = {
                    cancelFunction:() => {},
                    mainFunction:() => {},
                    mainTitle:'None',
                    cancelTitle:'COOL',
                    colorClass:'',
                    message:'Offer has been sent to seller. Standby...',
                    twoButtons:false
                }
                // const l:LogActionType = {
                //     type:'freeAgentOffer',
                //     payload:{
                //         by:userData.userEmail,
                //         id:currentAgent.id,
                //         state:'open',
                //         to:currentAgent.by,
                //         tokenIds:offeredTokens,
                //         value:Number(offerValue.value),
                //         when:new Date()                    
                //     }
                // }
                // const postLog = await logOnTheFire(l);
                // if(postLog === false)throw new Error("Error logging");
                dashboardDispatch({type:'notify',payload:{notObj:n}})
                gameStateDispatch({type:'dashboard'});
                Router.push('/dashboard');
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