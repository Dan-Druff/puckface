import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { logOnTheFire, sendMsgToUser, useDashboard,clearMsgByIdAndUser,clearTxByIdAndUser,getFreeAgents,getUsersPucksFromDB,getUsersTokensFromDB,confirmUserData,updateUsersPucksAndTokensInDB,removeFromFreeAgents} from '../context/DashboardContext'
import { useGameState } from '../context/GameState'
import AuthRoute from '../hoc/authRoute'
import LobbyGameCard from '../components/LobbyGameCard'
import BenchCard from '../components/BenchCard'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import { GamePosition,MessageType, LogActionType, NHLGame, CardType, NoteType } from '../utility/constants'
import { useAuth } from '../context/AuthContext'
import Message from '../components/Message';
import { createRandomId, getIpfsUrl } from '../utility/helpers'
import { useNHL } from '../context/NHLContext'
const Dashboard: NextPage = () => {
    const Router = useRouter();
    const {userData} = useAuth();
    const {gameStateDispatch} = useGameState();
    const {activeGames, pucks, dashboardDispatch, dashboard, displayName,messages, tokens} = useDashboard();
    const {tonightsGames} = useNHL();
    console.log("Player has pucks: ", pucks);
    const exitMessage = async(msg:MessageType) => {
        try {
            if(userData === null || userData.userEmail === null)throw new Error("Error user data");
            const m = await clearMsgByIdAndUser(msg.id,userData.userEmail);
            if(m === false)throw new Error("Error clearing msg");
            dashboardDispatch({type:'clearMessage',payload:{id:msg.id}});
            return;
        } catch (er) {
            console.log("Error exiting message", er);
            return;
        }
    }
    const acceptMessage = async(msg:MessageType) => {
        try {
            console.log("ACEPPTING MSG: ", msg.id);
            switch (msg.type) {
                case 'counterOffer':
                    // find full tx obj / free agent 
                    if(userData === null || userData.userEmail === null)throw new Error("Error User Data");
                    const agents = await getFreeAgents();
                    if(Array.isArray(agents)){
                        let singleArray = agents.filter(a => a.id === msg.regarding);
                        const agent = singleArray[0];
                        const faTx = agent.tokenId;
                        if(typeof faTx !== 'number')throw new Error("Error Transferring agent");
                        let offererData = await confirmUserData(msg.by);
                        if(offererData === false)throw new Error("Error getting user data")
                        // let pux = await getUsersPucksFromDB(msg.by);
                        let arith = offererData.pucks - msg.value;
                        if(arith < 0)throw new Error("Not enough pucks to do it");
                        // let tox = await getUsersTokensFromDB(msg.by);
                        // let valid:boolean = true;
                        let newTokArray = offererData.cards;
                        msg.tokens.forEach((tok) => {
                            if(offererData.cards.indexOf(tok) < 0){
                                // valid = false;
                                throw new Error("Offerer does not have required tokens");
                               
                            }
                            let ind = newTokArray.indexOf(tok);
                            newTokArray.splice(ind,1);
                            
                        })
                        newTokArray.push(faTx);
                        const updUsr = await updateUsersPucksAndTokensInDB(msg.by,arith,newTokArray);
                        if(updUsr === false)throw new Error("Error Updating User");

                  
                        // const faTx = await transferFreeAgent(msg.regarding,msg.by, userData.userEmail);

                        // const faTx = await txFreeAgent(agents,agent.id,msg.by,userData.userEmail);
                       
                        console.log("Got FATX: ", faTx);
                        const removeResult = await removeFromFreeAgents(faTx);
                        let hPux = pucks + msg.value
                       
                        let hTox = [...msg.tokens,...tokens];

                        let playingTeams: string[] = [];
                        tonightsGames.forEach((game:NHLGame) => {
                            playingTeams.push(game.awayName);
                            playingTeams.push(game.homeName);
                         });

                        const newCardPromises = await Promise.all(msg.tokens.map(async(token:number) => {
                                         // I have the integer of the token. 
               
                           // Determine if card is in an active game. If so set inuse position and ingameID
                           let inUse:GamePosition = 'none';
                           let inGame = false;
                         
                          
                           let goals = 0;
                           let assists = 0;
                           let plusMinus = 0;
                           let points = 0;
                           let wins = 0;
                           let shutouts = 0;
                           let active = false;
                        //    let url = baseURL + token.toString() + '.json';
                           let url = getIpfsUrl('json',token);
                         
                           // Get players json object
                           let data = await fetch(url);
                           let guy = await data.json();
           
                           let playerId = guy.attributes[3].value;
                           let pos = guy.attributes[0].value;
                           
                           let data2 = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=20212022`);
                           let playerStats = await data2.json();
                           let teamName = guy.attributes[1].value;
                           if(playingTeams.indexOf(teamName) > -1){
                               // this means the player is playing tonight
                               active = true;
                           }
                           if(playerStats.stats[0].splits[0] !== undefined){
                               plusMinus = playerStats.stats[0].splits[0].stat.plusMinus || playerStats.stats[0].splits[0].stat.plusMinus === typeof 'number' ? playerStats.stats[0].splits[0].stat.plusMinus : 0;
                               assists = playerStats.stats[0].splits[0].stat.assists || playerStats.stats[0].splits[0].stat.assists === typeof 'number' ? playerStats.stats[0].splits[0].stat.assists : 0;
                               wins = playerStats.stats[0].splits[0].stat.wins || playerStats.stats[0].splits[0].stat.wins === typeof 'number' ? playerStats.stats[0].splits[0].stat.wins : 0;
                               shutouts = playerStats.stats[0].splits[0].stat.shutouts || playerStats.stats[0].splits[0].stat.shutouts === typeof 'number' ? playerStats.stats[0].splits[0].stat.shutouts : 0;
                               points = playerStats.stats[0].splits[0].stat.points || playerStats.stats[0].splits[0].stat.points === typeof 'number' ? playerStats.stats[0].splits[0].stat.points : 0;
                               goals = playerStats.stats[0].splits[0].stat.goals || playerStats.stats[0].splits[0].stat.goals === typeof 'number' ? playerStats.stats[0].splits[0].stat.goals : 0;
                           }else{
                               console.log("Errror 263");
                               plusMinus = 0;
                               assists = 0;
                               wins = 0;
                               shutouts = 0;
                               points = 0;
                               goals = 0;
                           }
                           let player:CardType = {
                                tokenId:token,
                                image:getIpfsUrl('png',token),
                                playerId:playerId,
                                rarity:guy.attributes[2].value,
                                inUse:inUse,
                                playerName:guy.name,
                                points:points,
                                pos:pos,
                                playingTonight:active,
                                inGame:inGame,
                                stats:{
                                    wins:wins,
                                    shutouts:shutouts,
                                    goals:goals,
                                    assists:assists,
                                    plusMinus:plusMinus
                               }
                           }
                           return player;
                        }))
                        let newTox = hTox.filter(h => h !== faTx);
                        const updLocUsr = await updateUsersPucksAndTokensInDB(userData.userEmail,hPux,newTox);
                        if(updLocUsr === false)throw new Error("Error updating local user");
                        dashboardDispatch({type:'acceptOffer',payload:{pucks:hPux,cards:newCardPromises,tokens:hTox,removeToken:faTx}})
                        
                        // send a message to offerer
                        const mto : MessageType = {
                            by:userData.userEmail,
                            id:createRandomId(),
                            message:"I accepted your offer. Nice doing busoness with you",
                            regarding:msg.regarding,
                            state:'open',
                            tokens:[],
                            type:'acceptedOffer',
                            value:0,
                            when:new Date(),
                            tx:false
                        }
                        const ur = await sendMsgToUser(mto, msg.by);
                        if(ur === false)throw new Error("Error sending message to user");


                        // make a tx for offerer
                        const offLog : LogActionType = {
                            type:'acceptedOffer',
                            payload:{
                             by:userData.userEmail,
                             regarding:msg.regarding,
                             from:msg.by,
                             tokens:[...msg.tokens],
                             value:msg.value,
                             id:createRandomId(),
                             when:new Date()
                            }
                        }
                        const logRes = await logOnTheFire(offLog);
                        // make a tx for recipient

                        // clear original message in db
                        const msgRes = await clearMsgByIdAndUser(msg.id, userData.userEmail);
                        if(msgRes === false)throw new Error("Error clearing message.");

                        // clear original message in state
                        dashboardDispatch({type:'clearMessage',payload:{id:msg.id}});

                        let N : NoteType = {
                            cancelFunction:() => {},
                            mainFunction:() => {},
                            cancelTitle:"COOL",
                            mainTitle:"COOL",
                            colorClass:'',
                            message:"You just accepted an offer",
                            twoButtons:false
                        }
                        dashboardDispatch({type:"notify",payload:{notObj:N}});
                        gameStateDispatch({type:'dashboard'});
                        Router.push('/dashboard');

                        
                        
                        

                    }else{
                        throw new Error("Error getting free agents");
                    }
                    //REMOVE PUCkS AND TOKENS FROM OFFERER
                    // ADD AGENT TO OFFERER
                    // Add pucks and tokens to accepters db
                    // add pucks & tokens to accepters state
                    // create and send message
                    // create and send offerers log
                    // create and send accepters log
                    // notify and route to dashboard
                    break;
            
                default:
                    break;
            }
    
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
                when:new Date(),
                state:'open',
                tx:false
            }

            // send message object
            const mRes = await sendMsgToUser(m,msg.by);
            if(mRes === false)throw new Error("Error sending message");

            // Deal with old transaction? BEST WAY TO CLOSE STATE OF FREE AGENT OFFER IN DB??
            // Deal with 'luigis' transaction state
            const luigisTx = await clearTxByIdAndUser(msg.regarding,msg.by);
            if(luigisTx === false)throw new Error("Error updating luigis tx");
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
                                <Message key={msg.id} msg={msg} accept={acceptMessage} decline={declineMessage} counter={counterMessage} exit={exitMessage}/>
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