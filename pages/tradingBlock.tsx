import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard,addToFreeAgents,getFreeAgents, logOnTheFire, puckfaceLog,setFreeAgents,removeFromFreeAgents,removeTokenFromUsersTradeArrayDB } from '../context/DashboardContext'
import BlockCard from '../components/BlockCard'
import { GamePosition,nobody, CardType,FreeAgentType, AskType, LogActionType, TxType } from '../utility/constants'
import AuthRoute from '../hoc/authRoute'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef, useState } from 'react'
import BenchCard from '../components/BenchCard';
import { createRandomId, getPlayerFromToken } from '../utility/helpers'
import { useNHL } from '../context/NHLContext'

const TradingBlock: NextPage = () => {
    const {addToTradeArrayDB, tradeArray,dashboardDispatch, dashboard} = useDashboard();
    const {userData} = useAuth();
    const {tonightsGames} = useNHL();
    const [myAgents, setMyAgents] = useState<FreeAgentType[]>([]);
    const [addCard, setAddCard] = useState<boolean>(false);
    const [options,setOptions] = useState<boolean>(false);
    const [typeOfTrade, setTypeOfTrade] = useState<{value:string}>({value:'sell'});
    const [currentGuy, setCurrentGuy] = useState<CardType>(nobody);
    const tradeValue = useRef(2);
   
    const getMyAgents = async():Promise<false | FreeAgentType[]> => {
        try {
            
            console.log("Getting my agents...");
            if(userData === null || userData.userEmail === null)throw new Error("Error user data.");
            
            let freeA = await getFreeAgents();
            if(Array.isArray(freeA)){
                let rz = await Promise.all(freeA.filter(fa => fa.by === userData.userEmail).map(async(a:any) => {
                    let py = await getPlayerFromToken(a.tokenId,tonightsGames);
                    if(py === false)throw new Error("Error gettinbg player from token");
                    let ob :FreeAgentType = {
                        ask:a.ask,
                        by:a.by,
                        tokenId:a.tokenId,
                        image:py.image,
                        playerId:py.playerId,
                        playerName:py.playerName,
                        rarity:py.rarity,
                        pos:py.pos,
                        value:a.value,
                        id:a.id
                    }
                    return ob;
                }))
                return rz;

           
            }else{
                throw new Error("Error getting agents");
            }
           
        } catch (er) {
            console.log("Error getting my agents",er);
            return false;
        }
    }
    const cardSelect = (posId:GamePosition,tokenId:number) => {
        try {
            // let tokenId = agent.tokenId;
            const arrayOfGuyIWant = dashboard.filter(g => g.tokenId === tokenId);
            setCurrentGuy(arrayOfGuyIWant[0]);
            // Figure out if this guys is ALREADY on the block...
            setOptions(true);
        } catch (er) {
            console.log("Err:", er);
        }
    }
    const optionsFormSubmit = async(e:any) => {
        e.preventDefault();
        try {
            const {howMuch} = e.target.elements;
            console.log("How much: ", howMuch.value);
            if(userData === null || userData.userEmail === null)throw new Error("Error User Data");
            const num = createRandomId();
            const playerAlreadyOnBlock = myAgents.filter(a => a.tokenId === currentGuy.tokenId);
            if(playerAlreadyOnBlock.length > 0){
                // This player is already an agent.
                // NO NEED to remove from users DB DOC
                const age = await getFreeAgents();
                if(Array.isArray(age)){
                       // remove him from free agents card arry
                    let newAgentArray = age.filter(a => a.tokenId !== currentGuy.tokenId);
                    // let newFAObject = {
                    //     ask:typeOfTrade.value,
                    //     tokenId:currentGuy.tokenId,
                    //     by:userData.userEmail,
                    //     value:Number(howMuch.value),
                    //     id:num
                    // }

                    newAgentArray.push({
                        ask:typeOfTrade.value,
                        tokenId:currentGuy.tokenId,
                        by:userData.userEmail,
                        value:Number(howMuch.value),
                        id:num
                    });
                    const faRes = await setFreeAgents(newAgentArray);
                    if(faRes){
                        // success saving to fa array
                        setOptions(false);
                        let ask : AskType = 'sell';
                        switch (typeOfTrade.value) {
                            case 'sell':
                          
                                break;
                            case 'trade':
                                ask = 'trade';
                           
                                break;
                            case 'either':
                                ask = 'either';
                                break;
                            default:
                                break;
                        }
                      
                        // const log :LogActionType = {
                        //     type:'sellCard',
                        //     payload:{
                        //         tokenIds:[currentGuy.tokenId],
                        //         id:num,
                        //         value:Number(howMuch.value),
                        //         when:new Date(),
                        //         by:userData.userEmail,
                        //         state:'open'
        
                        //     }
                       
        
                        // }
                        const l2 :TxType = {
                            by:userData.userEmail,
                            from:userData.userEmail,
                            id:createRandomId(),
                            regarding:num,
                            state:'open',
                            to:userData.userEmail,
                            tokens:[currentGuy.tokenId],
                            tx:true,
                            type:'submitFreeAgent',
                            value:Number(howMuch.value),
                            when: new Date(),
                            mString:ask,
                            freeAgentToken:currentGuy.tokenId
                            }
                        let obj:FreeAgentType = {
                            by:userData.userEmail,
                            ask:ask,
                            image:currentGuy.image,
                            playerId:currentGuy.playerId,
                            playerName:currentGuy.playerName,
                            pos:currentGuy.pos,
                            rarity:currentGuy.rarity,
                            tokenId:currentGuy.tokenId,
                            value:Number(howMuch.value),
                            id:num
                        }
                        // const logRes = await logOnTheFire(log);
                        const logRes = await puckfaceLog(l2);
                        if(logRes === false) {
                            console.log("Error Logging");
                        }
                        const newAge = myAgents.filter(a => a.tokenId !== currentGuy.tokenId);
                        setMyAgents([obj,...newAge]);
                    }else{
                        throw new Error("Error updating fa array");
                    }

                }else{
                    throw new Error("Error getting agents");
                }
            }else{
                //Player is not already on block, safe to do gfull operation.
                const addAgent = await addToFreeAgents(currentGuy.tokenId, userData.userEmail,typeOfTrade.value,Number(howMuch.value),num);
                if(addAgent){
                    const addRes = await addToTradeArrayDB(currentGuy.tokenId);
                    if(addRes === false)throw new Error("Error adding to trade array db");
                    dashboardDispatch({type:'addToTradingBlock',payload:{tokenId:currentGuy.tokenId}});
                    setOptions(false);
                    let ask : AskType = 'sell';
                    switch (typeOfTrade.value) {
                        case 'sell':
                      
                            break;
                        case 'trade':
                            ask = 'trade';
                       
                            break;
                        case 'either':
                            ask = 'either';
                            break;
                        default:
                            break;
                    }
                  
                    // const log :LogActionType = {
                    //     type:'sellCard',
                    //     payload:{
                    //         tokenIds:[currentGuy.tokenId],
                    //         id:num,
                    //         value:Number(howMuch.value),
                    //         when:new Date(),
                    //         by:userData.userEmail,
                    //         state:'open'
    
                    //     }
                   
    
                    // }
                    const l2 :TxType = {
                        by:userData.userEmail,
                        from:userData.userEmail,
                        id:createRandomId(),
                        regarding:num,
                        state:'open',
                        to:userData.userEmail,
                        tokens:[currentGuy.tokenId],
                        tx:true,
                        type:'submitFreeAgent',
                        value:Number(howMuch.value),
                        when: new Date(),
                        mString:ask,
                        freeAgentToken:currentGuy.tokenId
                        }
                    let obj:FreeAgentType = {
                        by:userData.userEmail,
                        ask:ask,
                        image:currentGuy.image,
                        playerId:currentGuy.playerId,
                        playerName:currentGuy.playerName,
                        pos:currentGuy.pos,
                        rarity:currentGuy.rarity,
                        tokenId:currentGuy.tokenId,
                        value:Number(howMuch.value),
                        id:num
                    }
                    // const logRes = await logOnTheFire(log);
                    const logRes = await puckfaceLog(l2);
                    if(logRes === false) {
                        console.log("Error Logging");
                    }
                    const newAge = myAgents.filter(a => a.tokenId !== currentGuy.tokenId);
                    setMyAgents([obj,...newAge]);
                }else{
                    throw new Error("Error adding agent");
                }
            }
       
        } catch (er) {
            console.log("Error Options Form", er);
            dashboardDispatch({type:'error',payload:{er:"Error Submitting Trade Form"}});
        }
    
    }
    const cancelTrade = () => {
        setOptions(false);
        setCurrentGuy(nobody);
    }
    const handleTradeTypeChange = (e:any) => {
        // tradeType.current = e.target.value;
        console.log("SEt trade type to: ", e.target.value);
        setTypeOfTrade({value:e.target.value});
    }
    const removeAgent = async(tokenId:number) => {
        try {
        
            // Remove from free agents array 
            const removeResult = await removeFromFreeAgents(tokenId);
            if(removeResult === false)throw new Error("Error removing agent");
            // remove from myAgents state
            setMyAgents(myAgents.filter(a => a.tokenId !== tokenId));
            if(userData === null || userData.userEmail === null)throw new Error("Error user data.");
            // remove from tradeArray DB
            const userResult = await removeTokenFromUsersTradeArrayDB(userData.userEmail, tokenId);
            if(userResult === false) throw new Error("Error removing token from users db");
            // remove from tradeAray State
            dashboardDispatch({type:'removeAgent',payload:{tokenId:tokenId}});
           
        
            return;
        } catch (er) {
            console.log("Error Removing agent:", tokenId, er);
            return;
        }
    }
    useEffect(() => {
        const initMyAgents = async() => {
            console.log("INITTING AGENST");
            const myAge = await getMyAgents();
            if(myAge === false)throw new Error("Error initting my agents");
            setMyAgents(myAge);
        }
        initMyAgents();
      return () => {
    
      }
    }, [])
    
    return (
        <AuthRoute>
        <div className={styles.mainContainer}>
            {options ? 
            <div className={styles.contentContainer}>
                <div className={styles.rinkDiv}>
                    <form onSubmit={optionsFormSubmit}>
                    <h2>Trade Options for:</h2><br />
                    <hr className={styles.smallRedLine} /><br />
                    <h3>{currentGuy.rarity} - {currentGuy.playerName} #{currentGuy.tokenId}</h3><br />
                    <hr className={styles.blueLine}/><br />
                    <div className={styles.inputDiv}>
                        <label htmlFor="tradeType">Trade / Sell:   </label>
                            <select onChange={handleTradeTypeChange} value={typeOfTrade.value}>
                                <option value="sell">SELL</option>
                                <option value="trade">TRADE</option>
                                <option value="either">EITHER</option>
                            </select> 
                    </div><br />
                    <hr className={styles.centerLine}/><br />
                    <div className={styles.inputDiv}>
                    {typeOfTrade.value === 'trade' ? 
                    <>
                    <label htmlFor="howMuch">SELL VALUE: (N/A) </label> 
                    <br />
                    <input name="howMuch" id="howMuch" type="number" placeholder="0" />
                   
                    </>
                    : 
                    <>
                    <label htmlFor="howMuch">SELL VALUE:  </label>
                    <br />
                    <input name="howMuch" id="howMuch" type="number" placeholder="2" required/>
                    
                    </>
                    }
                    </div>
           
                  <br />
                    <hr className={styles.blueLine}/><br />
                    <button className={styles.pfButton} type="submit">ADD CARD</button>
                    <br /><hr className={styles.smallRedLine} /><br />
                    <button className={styles.pfButton} type="button" onClick={cancelTrade}>CANCEL</button>
                    <br />
                    </form>
                </div>
            </div>
            :
            <>
           <div className={styles.contentContainer}>
                <h2>TRADING BLOCK</h2>
                
            </div>
            <div className={styles.contentContainer}>
       
            {tradeArray.length > 0 ? 
            <>
           
            <div className={styles.contentContainer}>
                <h2>⬇️ My cards on the block: ⬇️</h2>
                
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.lockerroom}>
                    {myAgents.length > 0 ? 
                    <>
                        {myAgents.map((ag) => {
                            return (
                                <BlockCard key={ag.tokenId} agent={ag} setOffer={cardSelect} removeAgent={removeAgent}/>
                            )
                        })}
                    </>
                    : 
                    <p>No Agents Listed</p>
                    }
                {/* {dashboard.filter(c => tradeArray.includes(c.tokenId)).map((cd) => {
                return (
                    <BlockCard key={cd.tokenId} card={cd} active={true} func={() => {}} posId='none' />
                )
            })} */}
                </div>
            </div>
            </>
            : 
            <p>No Guys On the trading block</p>
            }
            </div>
            {addCard ? 
            <div className={styles.contentContainer}>
                <h2>⬇️ SELECT CARD TO SELL / TRADE ⬇️</h2>
                <div className={styles.lockerroom}>
                    {dashboard.map((card) => {
                         return (
                             <BenchCard key={card.tokenId} active={true} card={card} func={cardSelect} posId={card.inUse} avail={tradeArray.indexOf(card.tokenId) > -1 ? false : true}/>
                         )
                     })}
                 </div>
            </div>
            : 
            <button className={styles.pfButton} onClick={() => setAddCard(true)}>ADD CARD TO SELL OR TRADE</button>
            }
      
            </>
            }
        </div>
        </AuthRoute>
    )
}
export default TradingBlock