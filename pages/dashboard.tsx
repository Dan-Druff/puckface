import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { logOnTheFire, sendMsgToUser, useDashboard,clearMsgByIdAndUser} from '../context/DashboardContext'
import { useGameState } from '../context/GameState'
import AuthRoute from '../hoc/authRoute'
import LobbyGameCard from '../components/LobbyGameCard'
import BenchCard from '../components/BenchCard'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import { GamePosition,MessageType, LogActionType } from '../utility/constants'
import { useAuth } from '../context/AuthContext'
import Message from '../components/Message';
import { createRandomId } from '../utility/helpers'
const Dashboard: NextPage = () => {
    const Router = useRouter();
    const {userData} = useAuth();
    const {gameStateDispatch} = useGameState();
    const {activeGames, pucks, dashboardDispatch, dashboard, displayName,messages} = useDashboard();
    console.log("Player has pucks: ", pucks);
    const acceptMessage = async(msg:MessageType) => {
        try {
            console.log("ACEPPTING MSG: ", msg.id);
            //REMOVE PUCkS AND TOKENS FROM OFFERER
            // ADD AGENT TO OFFERER
            // Add pucks and tokens to accepters db
            // add pucks & tokens to accepters state
            // create and send message
            // create and send offerers log
            // create and send accepters log
            // notify and route to dashboard
            return true;
        } catch (er) {
            console.log("Error: ", er);
            return false;
        }
       
    }
    const declineMessage = async(msg:MessageType) => {
    
        try {
            console.log("DECLINING MSG: ", msg.id);
            // Create Message object
            if(userData === null || userData.userEmail === null)throw new Error("Error userdata");
            const m : MessageType = {
                by:userData.userEmail,
                id:createRandomId(),
                message:"No Thanks",
                regarding:msg.id,
                tokens:[],
                type:"declineOffer",
                value:0,
                when:new Date()
            }
            // send message object
            const mRes = await sendMsgToUser(m,msg.by);
            if(mRes === false)throw new Error("Error sending message");

            // Deal with old transaction? BEST WAY TO CLOSE STATE OF FREE AGENT OFFER IN DB??

            // create log
            const l : LogActionType = {
                type:'declineFreeAgentOffer',
                payload:{
                    id:msg.id
                }
            }
            // send log
            const logRes = await logOnTheFire(l);
            if(logRes === false)throw new Error("Error Logging");

            // remove message from db  
            const c = await clearMsgByIdAndUser(msg.id,userData.userEmail);
            if(c === false)throw new Error("Error clearing message");
            
            // remove message from state
            dashboardDispatch({type:'clearMessage',payload:{id:msg.id}});

            
            return true;
        } catch (er) {
            console.log("Error: ", er);
            return false;
        }


    }
    const counterMessage = (msg:MessageType) => {
        try {
            console.log("COUNTERING MSG: ", msg.id);
 
            return true;
        } catch (er) {
            console.log("Error: ", er);
            return false;
        }

    }

    const cardSelect = async(posId:GamePosition, tokenId:number) => {
        try {
            console.log("You selected card: ", tokenId, posId);
            gameStateDispatch({type:'inspect'});
            Router.push(`/card/${tokenId.toString()}`);
        } catch (er) {
            console.log("Card select error: ",er);
        }
    }
    return (
        <AuthRoute>
            {displayName === 'NA' ? 
            <div className={styles.contentContainer}>
                <Loader message="Loading Dashboard..." />
            </div>
            :     
            <div className={styles.mainContainer}>
                <div className={styles.contentContainer}>
                    <h1>{displayName} has &#36;{pucks} Pucks.</h1>
                </div>
                <div className={styles.contentContainerColumn}>
                    <h3>MESSAGES:</h3>
                    {messages.length > 0 ? 
                    <>
                        
                        {messages.map((msg) => {
                            return (
                                <Message key={msg.id} msg={msg} accept={acceptMessage} decline={declineMessage} counter={counterMessage}/>
                            )
                        })}
                    </>
                    : 
                    <h3>You have NO messages.</h3>
                    }
                </div>
                <div className={styles.contentContainerColumn}>
             
             {activeGames.length > 0 ? 
             <>
                <h2>⬇ ACTIVE GAMES ⬇</h2>
                <div className={styles.contentContainer}>
                {activeGames.filter(gam => gam.gameState !== "Complete").map((g) => {
                    return (
                        <LobbyGameCard key={g.id} game={g}/>
                    )
                })}
    
                </div>
                <div className={styles.contentContainer}>
                    <h4>(Check out completed games on Profile Page)</h4>
                </div>
         
             </>
             :
             <h2>NO GAMES TO SHOW</h2>
             }
                </div>
                <div className={styles.contentContainer}>
                    {dashboard.length > 0 ? 
                    <>
                        <h2>⬇ ALL CARDS ⬇</h2>
                        <div className={styles.lockerroom}>
                        {dashboard.map((card) => {
                            return (
                                <BenchCard key={card.tokenId} card={card} active={true} func={cardSelect} posId={'none'}/>
                            )
                        })}           
                    </div>
                    </> 
                    : 
                    <div className={styles.contentContainerColumn}>
                        <h2>Welcome Puck Face! 🏒 </h2>
                        <h2>Checkout the store to start playing... 🥅</h2>
                    </div>
                    }
                </div>

            {/* <button onClick={() => dashboardDispatch({type:'notify',payload:{notObj:funnyObj}})}>NOTIFY</button> */}
            </div>}
        
        </AuthRoute>
    )
}
export default Dashboard