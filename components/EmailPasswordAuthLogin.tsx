import styles from '../styles/All.module.css';
import Link from "next/link"
import GoogleSignIn from '../components/GoogleSignin';
import { useRouter } from "next/router"
import { auth } from "../firebase/clientApp"
import { signInWithEmailAndPassword } from "firebase/auth"
import React from 'react';
import { useNHL } from '../context/NHLContext';
import { useDashboard } from '../context/DashboardContext';
import { postLogin } from '../utility/dbHandlers';
import { useGameState } from '../context/GameState';
const EmailPasswordAuthLogin = () => {
    const Router = useRouter()
    const {gameStateDispatch} = useGameState();
    const {tonightsGames} = useNHL();
    const {dashboardDispatch} = useDashboard();
    const loginHandler = async(e:any) => {
      e.preventDefault();
    //   const butt: HTMLButtonElement = e.currentTarget;
      const { email, password } = e.target.elements;

      try {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        const postLog = await postLogin(email.value, tonightsGames);
        if(typeof postLog === 'boolean'){
            throw new Error('🚦Google Res error 2🚦')
        }else{
            
            dashboardDispatch({type:'login',payload:{displayName:postLog.dataFromDB.username,dash:postLog.dashboardPromises,dbData:postLog.dataFromDB,games:postLog.activeGames}})
            gameStateDispatch({type:'dashboard'})
            Router.push("/dashboard")
            return;
        }
      } catch (error) {
        console.log("error")
        alert(error)
      }
    }
    return (
        <div className={styles.rinkDiv}>
            <form onSubmit={loginHandler}>
            <h2>Login</h2>

            <hr className={styles.smallRedLine} /><br />
            <div className={styles.inputDiv}>
            <label htmlFor="email">Email  </label><br />
            <input name="email" id="email" type="email" placeholder="email" autoComplete="on"/>
            </div><br />
            <hr className={styles.blueLine}/><br />
            <div className={styles.inputDiv}>
            <label htmlFor="password">Password </label><br />
            <input name="password" id="password" type="password" placeholder="******************" autoComplete="on"/>
            </div><br />
            <hr className={styles.centerLine}/><br />
            <button className={styles.pfButton} type="submit">  Email Login  </button><br /><br />

            <hr className={styles.blueLine}/><br />
            <GoogleSignIn />
            <br />
            
            <hr className={styles.smallRedLine} />
            </form>
  
           
           
            <Link href="/signup">
            <a>Need Account?</a>
            </Link><br /><br />
        
          
         
         
        </div>
    )
}

export default EmailPasswordAuthLogin
