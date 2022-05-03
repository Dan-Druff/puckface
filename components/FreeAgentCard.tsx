import styles from '../styles/All.module.css';
import Image from 'next/image'
import { useDashboard, removeFromFreeAgents,logOnTheFire, sendMsgToUser, puckfaceLog, clearTxByIdAndUser } from '../context/DashboardContext';
import { FreeAgentCardType, FreeAgentType, LogActionType, MessageType, NoteType, TxType } from '../utility/constants';
import { createRandomId, getPlayerFromToken } from '../utility/helpers';
import { useNHL } from '../context/NHLContext';
import { useRouter } from 'next/router';
import { useGameState } from '../context/GameState';
import { useAuth } from '../context/AuthContext';
const FreeAgentCard = (props:FreeAgentCardType) => {
    const Router = useRouter();
    const {userData} = useAuth();
    const {tonightsGames} = useNHL();
    const {gameStateDispatch} = useGameState();
    const {buyFreeAgent, dashboardDispatch, activeGames} = useDashboard();
    const buyCard = async(agent:FreeAgentType) => {
        try {
            const agentResult = await buyFreeAgent(agent);
            if(agentResult){
                // subtract puck from state.
                // add token to buyers state
                const newCard = await getPlayerFromToken(agent.tokenId,tonightsGames, activeGames);
                if(newCard === false) throw new Error("Error getting card");
                dashboardDispatch({type:'boughtAgent',payload:{agent:agent, card:newCard}});
  
                const freeUpdate = await removeFromFreeAgents(newCard.tokenId);
                if(freeUpdate){
               
                    if(userData === null || userData.userEmail === null)throw new Error("Error user data");
          
                    const tempId = createRandomId();
                    const tempDate = new Date();

                    const l2 : TxType = {
                        by:agent.by,
                        from:agent.by,
                        id:tempId,
                        regarding:agent.id,
                        state:'closed',
                        to:userData.userEmail,
                        tokens:[newCard.tokenId],
                        tx:true,
                        type:'buyFreeAgent',
                        value:agent.value,
                        when:tempDate,
                        freeAgentToken:agent.tokenId
                    }
                    
                  
                    const marioTx : TxType = {
                        by:agent.by,
                        from:userData.userEmail,
                        id:tempId,
                        regarding:agent.id,
                        state:'closed',
                        to:agent.by,
                        tokens:[newCard.tokenId],
                        tx:true,
                        type:'buyFreeAgent',
                        value:agent.value,
                        when:tempDate,
                        freeAgentToken:agent.tokenId
                    }
                    const msg : MessageType = {
                        by:userData.userEmail,
                        id:tempId,
                        message:`I bought your card: ${agent.tokenId}. Thanks.`,
                        regarding:agent.id,
                        state:'open',
                        tokens:[],
                        tx:false,
                        type:'sold',
                        value:0,
                        when:tempDate
                    }
                    const logResult = await puckfaceLog(l2);
                    const msgResult = await sendMsgToUser(msg,agent.by);
                    const marioResult = await puckfaceLog(marioTx);

                    const clearAgent = await clearTxByIdAndUser(agent.id,agent.by);
                  
                    if(clearAgent === false || logResult === false || msgResult === false || marioResult === false){
                        console.log("Error LOGGING SOMEWHERERE!");
                    }
                    const nt : NoteType = {
                        cancelFunction:() => {},
                        mainFunction:() => {},
                        cancelTitle:"COOL!",
                        mainTitle:"COOL!",
                        twoButtons:false,
                        colorClass:"",
                        message:`You just got a ${newCard.rarity} ${newCard.playerName} for $${agent.value}.`
                    }
                    dashboardDispatch({type:'notify',payload:{notObj:nt}});
                    gameStateDispatch({type:'dashboard'});
                    Router.push('/dashboard');
                    return;
                }else{
                    throw new Error("Error removing free agent");
                }
          
                
          
       
            }else{
                throw new Error("Error buying free agent");
            }
            
        } catch (er) {
            console.log("Buy Card Error", er);
            dashboardDispatch({type:'error',payload:{er:"Error buying free agent"}});
            return;
        }
    }
    
 
    if(props.user === props.agent.by){
        return (
            <div className={styles.benchCard}>
                {/* <div className={styles.imageContainer}>
               <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
                </div> */}
                <img alt='alt img' className={styles.cardImage} src={props.agent.image}/>
                <p>{props.agent.rarity} {props.agent.playerName}</p>
                <p>${props.agent.value}</p>
                <p>Edit on Trading Block.</p>
    
                
                </div>
          )
    }else{
        return (
            <div className={styles.benchCard}>
                {/* <div className={styles.imageContainer}>
               <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
                </div> */}
                <img alt='alt img' className={styles.cardImage} src={props.agent.image}/>
                <p>{props.agent.rarity} {props.agent.playerName}</p>
                <p>${props.agent.value}</p>
                <button className={styles.pfButton} onClick={() => buyCard(props.agent)}>BUY CARD</button>
                <button className={styles.pfButton} onClick={() => props.setOffer(props.agent)}>MAKE OFFER</button>
    
                
                </div>
          )
    }


   

}

export default FreeAgentCard