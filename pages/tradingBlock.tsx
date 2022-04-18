import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard,addToFreeAgents,getFreeAgents, logOnTheFire } from '../context/DashboardContext'
import BlockCard from '../components/BlockCard'
import { GamePosition,nobody, CardType,FreeAgentType, AskType, LogActionType } from '../utility/constants'
import AuthRoute from '../hoc/authRoute'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef, useState } from 'react'
import BenchCard from '../components/BenchCard';
import { createRandomId } from '../utility/helpers'


const TradingBlock: NextPage = () => {
    const {addToTradeArrayDB, tradeArray,dashboardDispatch, dashboard} = useDashboard();
    const {userData} = useAuth();
    const [myAgents, setMyAgents] = useState<FreeAgentType[]>([]);
    const [addCard, setAddCard] = useState<boolean>(false);
    const [options,setOptions] = useState<boolean>(false);
    const [typeOfTrade, setTypeOfTrade] = useState<{value:string}>({value:'sell'});
    const [currentGuy, setCurrentGuy] = useState<CardType>(nobody);
    const tradeValue = useRef(2);
    const getMyAgents = async():Promise<false | FreeAgentType[]> => {
        try {
            if(userData === null || userData.userEmail === null)throw new Error("Error user data.");
            
            const freeA = await getFreeAgents();
            if(Array.isArray(freeA)){

                return freeA.filter(fa => fa.by === userData.userEmail);
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
            const arrayOfGuyIWant = dashboard.filter(g => g.tokenId === tokenId);
            setCurrentGuy(arrayOfGuyIWant[0]);
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
              
                const log :LogActionType = {
                    type:'sellCard',
                    payload:{
                        tokenIds:[currentGuy.tokenId],
                        id:num,
                        value:Number(howMuch.value),
                        when:new Date(),
                        by:userData.userEmail,
                        state:'open'

                    }
               

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
                const logRes = await logOnTheFire(log);
                if(logRes === false) throw new Error("Error logging");
                setMyAgents([obj,...myAgents]);
            }else{
                throw new Error("Error adding agent");
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

    useEffect(() => {
        const initMyAgents = async() => {
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
                                <BlockCard key={ag.tokenId} agent={ag} setOffer={() => {}}/>
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
                             <BenchCard key={card.tokenId} active={true} card={card} func={cardSelect} posId={card.inUse} />
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