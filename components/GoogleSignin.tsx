/* eslint-disable @next/next/no-img-element */
// import React from "react"
import { useRouter } from "next/router"
import styles from '../styles/All.module.css';
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth"
import { auth } from "../firebase/clientApp"

import { createRandomId } from "../utility/helpers";
import { useDashboard,postSignup, puckfaceLog } from "../context/DashboardContext";
import { TxType } from "../utility/constants";
import { useGameState } from "../context/GameState";
const GoogleSignIn = () => {
    const {gameStateDispatch} = useGameState()
    const {dashboardDispatch, postLogin} = useDashboard();
    const Router = useRouter()

  const googleHandler = async() => {
    const provider = new GoogleAuthProvider();

    try {
      const googleRes = await signInWithPopup(auth, provider)
    //   console.log("Whats is googleRes: ", googleRes);  
      if(googleRes){
            const newUser = getAdditionalUserInfo(googleRes);
            // console.log("ADDTNL User Info : ", newUser);
            if(newUser !== null && newUser.isNewUser){
                console.log("Signin IS a new user: ",newUser);
                if(googleRes.user.email !== null){
                    const postSign = await postSignup(googleRes.user.email,'googlesignin')
                    if(postSign === false){
                        throw new Error('🚦Google Res error🚦')
                    }else{
                      const tx :TxType = {
                        by:googleRes.user.email,
                        from:googleRes.user.email,
                        id:createRandomId(),
                        regarding:'signup',
                        state:'closed',
                        to:googleRes.user.email,
                        tokens:[],
                        tx:true,
                        type:'signup',
                        value:0,
                        when: new Date(),
                       
                      }
                        puckfaceLog(tx);
                        gameStateDispatch({type:'dashboard'})
                        const atInd = postSign.displayName.indexOf('@');
                        const edDis = postSign.displayName.substring(0,atInd);
                        dashboardDispatch({type:'signup',payload:{displayName:edDis,id:postSign.id}});
                        Router.push("/dashboard")
                        return;
                    }
                    
                }else{
                    throw new Error('🚦Google Res error 3🚦')

                }
            
              }else{
    
                console.log("Signin is NOT a new user: ",newUser);
                if(googleRes.user.email !== null){
                    const postLog = await postLogin(googleRes.user.email);
                    if(postLog === false){
                        throw new Error('🚦Google Res error 2🚦')
                    }else{
                        const atInd = googleRes.user.email.indexOf('@');
                        const edDis = googleRes.user.email.substring(0,atInd);
                        dashboardDispatch({type:'login',payload:{messages:postLog.messages,displayName:edDis,dash:postLog.dashboardPromises,dbData:postLog.dataFromDB,games:postLog.activeGames}})
                        gameStateDispatch({type:'dashboard'})

                        Router.push("/dashboard")
                        return;
                    }
              
                }else{
                    throw new Error('🚦Google Res error🚦')

                }
           
              }
        }
      
      
      } catch (error) {
        console.log("error",error)
        alert(error)
        return;
      }
  }

  return (
    <div className={styles.googleDiv}>
    <button type='button' className={styles.pfButton} onClick={googleHandler}>Google Login</button>
  

        
      
  
    </div>
  )
}

export default GoogleSignIn
