import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { removeTokenFromUsersTradeArrayDB, sendMsgToUser, useDashboard,clearMsgByIdAndUser,clearTxByIdAndUser,getFreeAgents,getUsersPucksFromDB,getUsersTokensFromDB,confirmUserData,updateUsersPucksAndTokensInDB,removeFromFreeAgents, puckfaceLog, updateUsersPucksInDB, updateUsersTokensInDB, addIdToUsersLeagueArrayDB, addTeamToLeagueDB} from '../context/DashboardContext'
import { useGameState } from '../context/GameState'
import AuthRoute from '../hoc/authRoute'
// import LobbyGameCard from '../components/LobbyGameCard'
import DashLobbyGameCard from '../components/DashLobbyGameCard'
import BenchCard from '../components/BenchCard'
import { useRouter } from 'next/router'
import Loader from '../components/Loader'
import { GamePosition,MessageType, LogActionType, NHLGame, CardType, NoteType, TxType, LeagueTeam } from '../utility/constants'
import { useAuth } from '../context/AuthContext'
import Message from '../components/Message';
import { createRandomId, getIpfsUrl,getPlayerFromToken } from '../utility/helpers'
import { useNHL } from '../context/NHLContext'

const Dashboard: NextPage = () => {
    const Router = useRouter();
    const {userData} = useAuth();
    const {gameStateDispatch} = useGameState();
    const {activeGames, pucks, dashboardDispatch, dashboard, displayName,messages, tokens, tradeArray, activeLeagues} = useDashboard();
    const {tonightsGames} = useNHL();
   
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
            if(userData === null || userData.userEmail === null)throw new Error("Error ud");            
            const tId = createRandomId();
            switch (msg.type) {
                case 'leagueInvite':
                    const mInviteAccept : MessageType = {
                        by:userData.userEmail,
                        id:tId,
                        message:"YES! I joined your league Lets GO!!!",
                        regarding:msg.id,
                        tokens:[],
                        type:'inviteAccepted',
                        value:0,
                        when:new Date(),
                        state:'open',
                        tx:false
                    }
                    sendMsgToUser(mInviteAccept,msg.by);
                    const txAcceptToInviter : TxType = {
                        by:userData.userEmail,
                        from:userData.userEmail,
                        id:tId,
                        regarding:msg.id,
                        state:'closed',
                        to:msg.by,
                        tokens:[],
                        tx:true,
                        type:'acceptInvite',
                        value:0,
                        when:new Date,
                        freeAgentToken:0
                    }
                    const txAcceptLocal : TxType = {
                        by:userData.userEmail,
                        from:msg.by,
                        id:tId,
                        regarding:msg.id,
                        state:'closed',
                        to:userData.userEmail,
                        tokens:[],
                        tx:true,
                        type:'acceptInvite',
                        value:0,
                        when:new Date,
                        freeAgentToken:0
                    }
                    puckfaceLog(txAcceptToInviter);
                    puckfaceLog(txAcceptLocal);
                    const clearTx = await clearTxByIdAndUser(msg.id, msg.by);
                    if(clearTx === false){
                        console.log(`Error clearing Tx `);
                    }
                    const dbRes = await addIdToUsersLeagueArrayDB(userData.userEmail, msg.id);
                    if(dbRes === false){
                        console.log(`Error adding id to users league array`);
                    }
                    const lgt : LeagueTeam = {
                        losses:0,
                        owner:userData.userEmail,
                        schedule:[],
                        teamName:userData.userEmail,
                        ties:0,
                        wins:0
                    }
                    const teamRes = await addTeamToLeagueDB(msg.regarding,lgt);
                    if(teamRes === false){
                        console.log(`Error Adding Team To League DB`);
                    }
                    clearMsgByIdAndUser(msg.id,userData.userEmail);
                    dashboardDispatch({type:'clearMessage',payload:{id:msg.id}});
                    dashboardDispatch({type:'joinLeague',payload:{id:msg.regarding}});
                    gameStateDispatch({type:'leagueId'});
                    Router.push(`/league/${msg.regarding}`);
                    break;
                case 'offer':
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
                        // let arith = offererData.pucks - msg.value;
                        // if(arith < 0)throw new Error("Not enough pucks to do it");
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

                        const updUsr = await updateUsersTokensInDB(msg.by,newTokArray);
                        if(updUsr === false)throw new Error("Error Updating User");

             
                        const removeResult = await removeFromFreeAgents(faTx);
                        if(removeResult === false)throw new Error("Error clearing FA");
                        let hPux = pucks + msg.value
                       
                        let hTox = [...msg.tokens,...tokens];

                        const newCardPromises = await Promise.all(msg.tokens.map(async(token:number) => {
                            const p = await getPlayerFromToken(token,tonightsGames,activeGames);
                            if(p === false)throw new Error("Error getting player from token");
                            return p;
                        }))

                        // let playingTeams: string[] = [];
                        // tonightsGames.forEach((game:NHLGame) => {
                        //     playingTeams.push(game.awayName);
                        //     playingTeams.push(game.homeName);
                        //  });

                         
                        // const newCardPromises = await Promise.all(msg.tokens.map(async(token:number) => {
                        //                  // I have the integer of the token. 
               
                        //    // Determine if card is in an active game. If so set inuse position and ingameID
                        //    let inUse:GamePosition = 'none';
                        //    let inGame = false;
                         
                          
                        //    let goals = 0;
                        //    let assists = 0;
                        //    let plusMinus = 0;
                        //    let points = 0;
                        //    let wins = 0;
                        //    let shutouts = 0;
                        //    let active = false;
                        // //    let url = baseURL + token.toString() + '.json';
                        //    let url = getIpfsUrl('json',token);
                         
                        //    // Get players json object
                        //    let data = await fetch(url);
                        //    let guy = await data.json();
           
                        //    let playerId = guy.attributes[3].value;
                        //    let pos = guy.attributes[0].value;
                           
                        //    let data2 = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=statsSingleSeason&season=20212022`);
                        //    let playerStats = await data2.json();
                        //    let teamName = guy.attributes[1].value;
                        //    if(playingTeams.indexOf(teamName) > -1){
                        //        // this means the player is playing tonight
                        //        active = true;
                        //    }
                        //    if(playerStats.stats[0].splits[0] !== undefined){
                        //        plusMinus = playerStats.stats[0].splits[0].stat.plusMinus || playerStats.stats[0].splits[0].stat.plusMinus === typeof 'number' ? playerStats.stats[0].splits[0].stat.plusMinus : 0;
                        //        assists = playerStats.stats[0].splits[0].stat.assists || playerStats.stats[0].splits[0].stat.assists === typeof 'number' ? playerStats.stats[0].splits[0].stat.assists : 0;
                        //        wins = playerStats.stats[0].splits[0].stat.wins || playerStats.stats[0].splits[0].stat.wins === typeof 'number' ? playerStats.stats[0].splits[0].stat.wins : 0;
                        //        shutouts = playerStats.stats[0].splits[0].stat.shutouts || playerStats.stats[0].splits[0].stat.shutouts === typeof 'number' ? playerStats.stats[0].splits[0].stat.shutouts : 0;
                        //        points = playerStats.stats[0].splits[0].stat.points || playerStats.stats[0].splits[0].stat.points === typeof 'number' ? playerStats.stats[0].splits[0].stat.points : 0;
                        //        goals = playerStats.stats[0].splits[0].stat.goals || playerStats.stats[0].splits[0].stat.goals === typeof 'number' ? playerStats.stats[0].splits[0].stat.goals : 0;
                        //    }else{
                        //        console.log("Errror 263");
                        //        plusMinus = 0;
                        //        assists = 0;
                        //        wins = 0;
                        //        shutouts = 0;
                        //        points = 0;
                        //        goals = 0;
                        //    }
                        //    let player:CardType = {
                        //         tokenId:token,
                        //         image:getIpfsUrl('png',token),
                        //         playerId:playerId,
                        //         rarity:guy.attributes[2].value,
                        //         inUse:inUse,
                        //         playerName:guy.name,
                        //         points:points,
                        //         pos:pos,
                        //         playingTonight:active,
                        //         inGame:inGame,
                        //         stats:{
                        //             wins:wins,
                        //             shutouts:shutouts,
                        //             goals:goals,
                        //             assists:assists,
                        //             plusMinus:plusMinus
                        //        }
                        //    }
                        //    return player;
                        // }))
                        let newTox = hTox.filter(h => h !== faTx);
                        const updLocUsr = await updateUsersPucksAndTokensInDB(userData.userEmail,hPux,newTox);
                        if(updLocUsr === false)throw new Error("Error updating local user");
                        dashboardDispatch({type:'acceptOffer',payload:{pucks:hPux,cards:newCardPromises,tokens:hTox,removeToken:faTx}})
                        let tempId = createRandomId();
                        // send a message to offerer
                        const mto : MessageType = {
                            by:userData.userEmail,
                            id:tempId,
                            message:"I accepted your offer. Nice doing busoness with you",
                            regarding:msg.regarding,
                            state:'open',
                            tokens:[],
                            type:'offerAccepted',
                            value:0,
                            when:new Date(),
                            tx:false
                        }
                        const ur = await sendMsgToUser(mto, msg.by);
                        if(ur === false)throw new Error("Error sending message to user");

                         

                        const t : TxType = {
                            by:msg.by,
                            from:msg.by,
                            to:userData.userEmail,
                            id:tempId,
                            regarding:msg.regarding,
                            state:'closed',
                            tokens:msg.tokens,
                            tx:true,
                            type:'acceptOffer',
                            value:msg.value,
                            when:new Date(),
                            freeAgentToken:faTx
                        }
                       const logRes = await puckfaceLog(t);

                       const sellerTx : TxType = {
                            by:userData.userEmail,
                            from:userData.userEmail,
                            to:msg.by,
                            id:tempId,
                            regarding:msg.regarding,
                            state:'closed',
                            tokens:msg.tokens,
                            tx:true,
                            type:'acceptOffer',
                            value:msg.value,
                            when:new Date(),
                            freeAgentToken:faTx
                       }
                       const sellerRes = await puckfaceLog(sellerTx);

                       const rem = await removeTokenFromUsersTradeArrayDB(userData.userEmail,faTx);
                       const luigisTokenClear = await Promise.all(msg.tokens.map(async(lc) => {
                           return await removeTokenFromUsersTradeArrayDB(msg.by,lc);
                       }))
                       luigisTokenClear.forEach((tok) => {
                           if(tok === false)throw new Error("Couldnt clear token");
                       })
                       
                       const marioClear = await clearTxByIdAndUser(msg.regarding,userData.userEmail);
                       const luigiClear = await clearTxByIdAndUser(msg.regarding,msg.by);
                       
                       if(logRes === false || sellerRes === false || rem === false || luigiClear === false || marioClear === false){
                           console.log("Errror setting tx SOMEWHERE.");
                       }
                        // make a tx for offerer
                        // const offLog : LogActionType = {
                        //     type:'acceptedOffer',
                        //     payload:{
                        //      by:userData.userEmail,
                        //      regarding:msg.regarding,
                        //      from:msg.by,
                        //      tokens:[...msg.tokens],
                        //      value:msg.value,
                        //      id:createRandomId(),
                        //      when:new Date()
                        //     }
                        // }
                        // const logRes = await logOnTheFire(offLog);
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
                            message:`You just accepted $${msg.value} & tokens: ${JSON.stringify(msg.tokens)}, for card: #${faTx}`,
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

            if(userData === null || userData.userEmail === null)throw new Error("Error userdata");

            switch (msg.type) {
                case 'offerDeclined':
                
                    const m : MessageType = {
                        by:userData.userEmail,
                        id:createRandomId(),
                        message:"No Thanks",
                        regarding:msg.id,
                        tokens:[],
                        type:'offerDeclined',
                        value:0,
                        when:new Date(),
                        state:'open',
                        tx:false
                    }
        
                    // send message object
                    const mRes = await sendMsgToUser(m,msg.by);
                    if(mRes === false)throw new Error("Error sending message");
        
                    const up = await getUsersPucksFromDB(msg.by);
                    // Needsom erreor checking here
                    const newPuck = up + msg.value;
                    const upNew = await updateUsersPucksInDB(msg.by,newPuck);
                    if(upNew === false)throw new Error("errior updating pucks");
                    const tokRes = await Promise.all(msg.tokens.map(async(t) => {
                        return await removeTokenFromUsersTradeArrayDB(msg.by,t);
                    }))
                    tokRes.forEach((tk) => {
                        if(tk === false)throw new Error("Error removing tokens from users tradeArray DB");
                    })
                    // Deal with old transaction? BEST WAY TO CLOSE STATE OF FREE AGENT OFFER IN DB??
                    // Deal with 'luigis' transaction state
                    console.log("Clearing tx id: ",msg.id);
                    console.log("By User: ", msg.by);
                    const luigisTx = await clearTxByIdAndUser(msg.id,msg.by);
                    if(luigisTx === false)throw new Error("Error updating luigis tx");
                    // create log
        
                   const tempId = createRandomId();
                    const marioTx: TxType = {
                        by:userData.userEmail,
                        from:userData.userEmail,
                        id:tempId,
                        regarding:msg.regarding,
                        state:'closed',
                        to:userData.userEmail,
                        tokens:msg.tokens,
                        tx:true,
                        type:'declineOffer',
                        value:msg.value,
                        when:new Date()
                      
                    }
                    const luigiTx : TxType = {
                        by:userData.userEmail,
                        from:userData.userEmail,
                        id:tempId,
                        regarding:msg.regarding,
                        state:'closed',
                        to:msg.by,
                        tokens:msg.tokens,
                        tx:true,
                        type:'declineOffer',
                        value:msg.value,
                        when:new Date()
                    }
      
        
                    // remove message from db  
                    const mTx = await puckfaceLog(marioTx);
                    const lTx = await puckfaceLog(luigiTx);
                    if(mTx === false || lTx === false){
                        console.log("Error With Transactions");
                    }
                    const c = await clearMsgByIdAndUser(msg.id,userData.userEmail);
                    if(c === false)throw new Error("Error clearing message");
                    
                    // remove message from state
                    dashboardDispatch({type:'clearMessage',payload:{id:msg.id}});
        
                    
                    return true;
                    
                case 'leagueInvite':
                    const mInvite : MessageType = {
                        by:userData.userEmail,
                        id:createRandomId(),
                        message:"No Thanks",
                        regarding:msg.id,
                        tokens:[],
                        type:'inviteDeclined',
                        value:0,
                        when:new Date(),
                        state:'open',
                        tx:false
                    }
                    const c2 = await clearMsgByIdAndUser(msg.id,userData.userEmail);
                    if(c2 === false)throw new Error("Error clearing message");

                    sendMsgToUser(mInvite,msg.by);
                    clearTxByIdAndUser(msg.id,msg.by);
                    dashboardDispatch({type:'clearMessage',payload:{id:msg.id}});
                    break;    
            
                default:
                    throw new Error("Error switch statement");
                    
            }
         
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
    const exploreButton = () => {
       try {
        gameStateDispatch({type:'home'});
        Router.push('/explorer/3432');
         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    const goThere = (leagueId:string) => {
        gameStateDispatch({type:'leagueId'});
        Router.push(`/league/${leagueId}`);
    }    
    return (
        <AuthRoute>
            {displayName === 'NA' ? 
            <div className={styles.contentContainer}>
               <Loader message='LOADING' />
            </div>
            :     
            <div className={styles.mainContainer}>
             
                <div className={styles.contentContainer}>
                    <button className={styles.pfButtonSecondary} onClick={() => exploreButton()}> CARD EXPLORER 🏒</button>
              
                </div>
                <hr className={styles.smallRedLine}/>
           
                <div className={styles.contentContainer}>
                    <h1>{displayName}: &#36;{pucks}</h1>
                </div>
                <hr className={styles.blueLine}/>
            
                <div className={styles.contentContainerColumn}>
                <h2>⬇ MESSAGES ⬇</h2>
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
                    <button className={styles.pfButton}>SEND MESSAGE →</button>
                </div>
                <hr className={styles.centerLine}/>
        
                <div className={styles.contentContainerColumn}>
             
             {activeGames.length > 0 ? 
             <>
                <h2>⬇ ACTIVE GAMES ⬇</h2>
                <div className={styles.contentContainer}>
                {activeGames.filter(gam => gam.gameState !== "Complete").map((g) => {
                    return (
                        <DashLobbyGameCard key={g.id} game={g}/>
                    )
                })}
    
                </div>
                <div className={styles.contentContainer}>
                    <h4>(Check out completed games on Profile Page)</h4>
                </div>
         
             </>
             :
             <>
              <h2>⬇ ACTIVE GAMES ⬇</h2>
             <h4>NO GAMES TO SHOW</h4>
             </>
             }
                </div>
                <hr className={styles.blueLine}/>
               
                <div className={styles.contentContainerColumn}>
                <h2>⬇ ACTIVE LEAGUES ⬇</h2>
                    {activeLeagues.length > 0 ? 
                    <>
                        {activeLeagues.map((al) => {
                            return (
                                <div key={al} className={styles.nhlTick}>
                                    <p>League: {al}</p>
                                    <button className={styles.pfButton} onClick={() => goThere(al)}>Go There →</button>
                                </div>
                            )
                        })}
                    </> 
                    : 
                    <h4>No Active Leagues</h4>
                    }
                </div>
                <hr className={styles.smallRedLine}/>
           
                <div className={styles.contentContainer}>
                    {dashboard.length > 0 ? 
                    <>
                        <h2>⬇ ALL CARDS ⬇</h2>
                        <div className={styles.lockerroom}>
                        {dashboard.map((card) => {
                            return (
                                <BenchCard key={card.tokenId} card={card} active={true} func={cardSelect} posId={'none'} avail={tradeArray.indexOf(card.tokenId) > -1 ? false : true}/>
                            )
                        })}           
                    </div>
                    </> 
                    : 
                    <div className={styles.contentContainerColumn}>
                           <h2>⬇ ALL CARDS ⬇</h2>
                        <h3>🥅 Welcome Puck Face! 🏒 </h3>
                        <h3>You need somne cards to get started.</h3>
                        <button className={styles.pfButton} onClick={() => Router.push('/store')}>GET CARDS</button>
                    </div>
                    }
                </div>

            {/* <button onClick={() => dashboardDispatch({type:'notify',payload:{notObj:funnyObj}})}>NOTIFY</button> */}
            </div>}
        
        </AuthRoute>
    )
}
export default Dashboard