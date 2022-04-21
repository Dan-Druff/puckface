import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useAuth } from '../context/AuthContext'
import { useGameState } from '../context/GameState'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { PRICE_PER_PACK, TxType } from '../utility/constants'
import { buyPucks,updateUsersPucksInDB,puckfaceLog,useDashboard, logOnTheFire } from '../context/DashboardContext'
import AuthRoute from '../hoc/authRoute'
import Loader from '../components/Loader'
const Store: NextPage = () => {
    // buyPucks,setNotification,getPacket,updateUsersPucksInDB,
    const {tokens,pucks,dashboardDispatch, displayName, getPacket} = useDashboard();
    const {gameStateDispatch} = useGameState();
    const {userData} = useAuth();
    const [buyPuckPage, setBuyPuckPage] = useState<boolean>(false);
    const [buyCardPage, setBuyCardPage] = useState<boolean>(false);
    const [load,setLoad] = useState<boolean>(false);
    const Router = useRouter();
    const howManyPucks = useRef(0);
    const cancelOut = () => {
        setBuyCardPage(false);
        setBuyPuckPage(false);

    }
    const cancelIt = () => {
        dashboardDispatch({type:'cancelNotify'});
        cancelOut();
    }
    const puckHandler = async(e:any) => {
        e.preventDefault();
        try {
        
            const {howMany} = e.target.elements;
            howManyPucks.current = howMany.value;
            console.log("Puck Handler",howMany.value);
            const doIt = async() => {
                    console.log("BUY CARDSSSSSSSS");
                    const numb = Number(howMany.value);
                    const toSave = numb + pucks;
                    if(userData === null || userData.userEmail === null) throw new Error('🚦 Do it error 🚦');
                    const dbSuccess = await buyPucks(toSave,userData.userEmail);
                  
                    const log = await logOnTheFire({type:'buyPucks',payload:{howMany:numb,when:new Date(),who:userData.userEmail}})
                    if(dbSuccess && log){
                        dashboardDispatch({type:'cancelNotify'});
                        gameStateDispatch({type:'dashboard'});
                        dashboardDispatch({type:'addPucks',payload:{amount:numb}});
                        Router.push('/dashboard');
                        return;
                    }else{
                        throw new Error('🚦 buy poucks error 🚦');
                    }
                  
                    
               
                   
                }
         
            let n = {
                    colorClass:'',
                    message:`This will cost ${howMany.value} USD`,
                    twoButtons:true,
                    mainTitle:'BUY',
                    mainFunction:doIt,
                    cancelTitle:'CANCEL',
                    cancelFunction:cancelIt,
                }
            dashboardDispatch({type:'notify',payload:{notObj:n}});
            console.log("Buy some cards");
            return;
        } catch (er) {
            console.log("Error: ", er);
            return;
        }

    }
    const buyCards = () => {
        try {
         
            setBuyCardPage(true);
            const doIt = async() => {
                try {
                    setLoad(true);
                    dashboardDispatch({type:'cancelNotify'});
                    console.log("BUY CARDSSSSSSSS");
                    let newAmount = pucks - PRICE_PER_PACK;
                    if(userData !== null && userData.userEmail !== null){
                        await updateUsersPucksInDB(userData.userEmail,newAmount);
                        const returnedPlayers = await getPacket(userData.userEmail,tokens);
                        if(returnedPlayers === false) throw new Error('🚦 Do it error 🚦');
                        console.log("Got returned players... ", returnedPlayers);
                        const tokAray:number[] = [];
                        returnedPlayers.forEach((guy) => {
                            tokAray.push(guy.tokenId);
                        })
                        await logOnTheFire({type:'buyCards',payload:{who:userData.userEmail,cards:tokAray,cost:PRICE_PER_PACK,when:new Date()}})
                        console.log("LOG ON THE FIRE DONe")
                        dashboardDispatch({type:'addPack',payload:{guys:returnedPlayers, newPucks:newAmount}});
                        console.log("DASHBOARD DISPATCH")
                        gameStateDispatch({type:'dashboard'})
                        console.log("Gamestate dispatch");
                        setLoad(false);
                        Router.push('/dashboard');
    
                    }else{
                        throw new Error('🚦 User Data is effed 🚦');
                    }
                } catch (er) {
                    console.log("Get cards error", er);
                    setLoad(false);
                    let erm = {
                        colorClass:'',
                        message:'Sorry, something went wrong getting cards. Logout, then refresh the home page, then log back in.',
                        twoButtons:false,
                        mainTitle:'CANCEL',
                        mainFunction:cancelIt,
                        cancelTitle:'CANCEL',
                        cancelFunction:cancelIt,
                    }
                    dashboardDispatch({type:'notify',payload:{notObj:erm}})

                }
      
                
   

      
            }
     
            
            let good = {
                colorClass:'',
                message:'$18 USD for 1 pack of 8 cards...',
                twoButtons:true,
                mainTitle:'BUY',
                mainFunction:doIt,
                cancelTitle:'CANCEL',
                cancelFunction:cancelIt,
            }
            let bad = {
                colorClass:'',
                message:'You do not have enough pucks. 18 per Pack.',
                twoButtons:false,
                mainTitle:'BUY',
                mainFunction:cancelIt,
                cancelTitle:'CANCEL',
                cancelFunction:cancelIt,
            }
            if(pucks < 18){
                dashboardDispatch({type:'notify',payload:{notObj:bad}})
             
            }else{
                dashboardDispatch({type:'notify',payload:{notObj:good}})

            }
           
            console.log("Buy some cards");
            return;
        } catch (e) {

            console.log("Buy cards error", e);
            return;
        }
    }
    if(load){
        return (
            <div className={styles.contentContainer}>
                <Loader message="Generating Cards. This can take a minute..." />
            </div>
            
        )
    }else{
        return (
            <AuthRoute>
            <div className={styles.mainContainer}>
                <div className={styles.contentContainerColumn}>
                    <h2>STORE</h2>
                    <p>You have {pucks} pucks.</p>
                </div>
                {!buyCardPage && !buyPuckPage &&  
                <div className={styles.contentContainer}>
    
                    <button className={styles.pfButtonSecondary} onClick={() => setBuyPuckPage(true)}>BUY PUCKS</button>
                    <button className={styles.pfButtonSecondary} onClick={() => buyCards()}>BUY CARDS</button>
                </div>
                }
                {buyCardPage && 
                <div className={styles.contentContainer}>
                    <h2>Buys Cards</h2>
                </div>
                }
                {buyPuckPage && 
                <div className={styles.contentContainer}>
                <div className={styles.rinkDiv}>
                    <form onSubmit={puckHandler}>
                        <h2>Buy Pucks:</h2>
                        <hr className={styles.smallRedLine} /><br />
                        <div className={styles.inputDiv}>
                        <label htmlFor="howMany">How Many?:</label><br />
                        <input name="howMany" id="howMany" type="number" placeholder="0" required/>
                        </div><br />
                        <hr className={styles.blueLine}/><br />
                        {/* <div className={styles.inputDiv}>
                        <label htmlFor="howMuch">Other Property: </label><br />
                        <input name="other" id="other" type="number" placeholder="0" required/>
                        </div> */}
                        <br />
                        <hr className={styles.centerLine}/>
                        <br /> 
                        <button className={styles.pfButton} type="submit">BUY PUCKS</button>
        
                        <br />
                        <hr className={styles.blueLine}/>
                        <br />
                        <button className={styles.pfButton} onClick={cancelOut} type="button">Cancel</button>
        
                        <br /><br />
                        <hr className={styles.smallRedLine} />
                        <br />
                    </form>
                </div>
                </div>
                }
              
            </div>
            </AuthRoute>
          )
    }
  
}
export default Store
