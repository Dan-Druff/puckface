import styles from '../styles/All.module.css';
import Image from 'next/image'
import { useDashboard, removeFromFreeAgents } from '../context/DashboardContext';
import { FreeAgentCardType, FreeAgentType, NoteType } from '../utility/constants';
import { getPlayerFromToken } from '../utility/helpers';
import { useNHL } from '../context/NHLContext';
import { useRouter } from 'next/router';
import { useGameState } from '../context/GameState';
const FreeAgentCard = (props:FreeAgentCardType) => {
    const Router = useRouter();
    const {tonightsGames} = useNHL();
    const {gameStateDispatch} = useGameState();
    const {buyFreeAgent, dashboardDispatch} = useDashboard();
    const buyCard = async(agent:FreeAgentType) => {
        try {
            const agentResult = await buyFreeAgent(agent);
            if(agentResult){
                // subtract puck from state.
                // add token to buyers state
                const newCard = await getPlayerFromToken(agent.tokenId,tonightsGames);
                if(newCard === false) throw new Error("Error getting card");
                dashboardDispatch({type:'boughtAgent',payload:{agent:agent, card:newCard}});
                const nt : NoteType = {
                    cancelFunction:() => {},
                    mainFunction:() => {},
                    cancelTitle:"COOL!",
                    mainTitle:"COOL!",
                    twoButtons:false,
                    colorClass:"",
                    message:`You just got a ${newCard.rarity} ${newCard.playerName} for $${agent.value}.`
                }
                const freeUpdate = await removeFromFreeAgents(newCard.tokenId);
                if(freeUpdate){
                    dashboardDispatch({type:'notify',payload:{notObj:nt}});
                    gameStateDispatch({type:'dashboard'});
                    // can i router push here under nptify?
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
    const makeOffer = async() => {
        try {
            return;
        } catch (er) {
            console.log("makeOfferd Error", er);
            return;
        }
    }

    return (
        <div className={styles.benchCard}>
            {/* <div className={styles.imageContainer}>
           <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
            </div> */}
            <img alt='alt img' className={styles.cardImage} src={props.agent.image}/>
            <p>{props.agent.rarity} {props.agent.playerName}</p>
            <p>${props.agent.value}</p>
            <button className={styles.pfButton} onClick={() => buyCard(props.agent)}>BUY CARD</button>
            <button className={styles.pfButton}>MAKE OFFER</button>

            
            </div>
      )
   

}

export default FreeAgentCard