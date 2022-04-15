import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useDashboard,addToFreeAgents,getFreeAgents } from '../context/DashboardContext'
import BlockCard from '../components/BlockCard'
import { GamePosition,nobody, CardType } from '../utility/constants'
import AuthRoute from '../hoc/authRoute'
import { useAuth } from '../context/AuthContext'
import { useRef, useState } from 'react'


const TradingBlock: NextPage = () => {
    const {addToTradeArrayDB, tradeArray,dashboardDispatch, dashboard} = useDashboard();
    const {userData} = useAuth();
    const [options,setOptions] = useState<boolean>(false);
    const [typeOfTrade, setTypeOfTrade] = useState<{value:string}>({value:'sell'});
    const [currentGuy, setCurrentGuy] = useState<CardType>(nobody);
    const tradeValue = useRef(2);
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
            const addAgent = await addToFreeAgents(currentGuy.tokenId, userData.userEmail,typeOfTrade.value,Number(howMuch.value));
            if(addAgent){
                const addRes = await addToTradeArrayDB(currentGuy.tokenId);
                if(!addRes)throw new Error("Error adding to trade array db");
                dashboardDispatch({type:'addToTradingBlock',payload:{tokenId:currentGuy.tokenId}});
                setOptions(false);
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
    const doTheAdd = async(posId:GamePosition,tokenId:number) => {
        try {
            console.log("DO THE ADD...");
            let agents = await getFreeAgents();
            if(agents === false) throw new Error("Error getting agents");
            agents.push(tokenId);
            if(userData === null || userData.userEmail === null) throw new Error("No user data");
            const updRes = await addToFreeAgents(tokenId,userData.userEmail,'sell',12);
          
            const addRes = await addToTradeArrayDB(tokenId);
           
            if(addRes && updRes){
                dashboardDispatch({type:'addToTradingBlock',payload:{tokenId:tokenId}});
            }else{
                throw new Error("🚦Could not update db🚦");
            }
         
            return;
        } catch (er) {
            console.log("Error", er);
            return;
        }
    }
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
                    {/* <label htmlFor="howMuch">SELL VALUE:  </label> */}
                
                    {/* {typeOfTrade.value !== 'trade' ?   
                    <div className={styles.inputDiv}>
                    <label htmlFor="howMuch">SELL VALUE:  </label><br />
                    <input name="howMuch" id="howMuch" type="number" placeholder="1" required/>
                    </div>
                    :
                    <div className={styles.inputDiv}>
                    <label htmlFor="howMuch">SELL VALUE:  </label><br />
                    <input name="howMuch" id="howMuch" type="number" placeholder="1" required/>
                    </div>
                    } */}
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
                <h2>Guys To Trade:</h2>
                
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.lockerroom}>
                {dashboard.filter(c => tradeArray.includes(c.tokenId)).map((cd) => {
                return (
                    <BlockCard key={cd.tokenId} card={cd} active={true} func={() => {}} posId='none' />
                )
            })}
                </div>
            </div>
            </>
            : 
            <p>No Guys On the trading block</p>
            }
            </div>
            <div className={styles.contentContainer}>
                <h2>ALL GUYS:</h2>
            <div className={styles.lockerroom}>
                    {dashboard.map((card) => {
                        return (
                            <BlockCard key={card.tokenId} active={true} card={card} func={cardSelect} posId={card.inUse} />
                        )
                    })}
                    </div>
            </div>
            </>
            }
        </div>
        </AuthRoute>
    )
}
export default TradingBlock