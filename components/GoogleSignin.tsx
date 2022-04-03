/* eslint-disable @next/next/no-img-element */
// import React from "react"
import { useRouter } from "next/router"
import styles from '../styles/All.module.css';
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth"
import { auth } from "../firebase/clientApp"

const GoogleSignIn = () => {

  const Router = useRouter()

  const googleHandler = async() => {
    const provider = new GoogleAuthProvider();
    console.log("What is provider ", provider);
    try {
      const googleRes = await signInWithPopup(auth, provider)
      console.log("Whats is googleRes: ", googleRes);  
      if(googleRes){
            const newUser = getAdditionalUserInfo(googleRes);
            console.log("ADDTNL User Info : ", newUser);
            if(newUser !== null && newUser.isNewUser){
                console.log("Signin IS a new user: ",newUser);

                Router.push("/dashboard")
              }else{
    
                console.log("Signin is NOT a new user: ",newUser);

                Router.push("/dashboard")
              }
          }
      
      
      } catch (error) {
        console.log("error")
        alert(error)
      }
  }

  return (
    <div className={styles.googleDiv}>
    <button type='button' className={styles.pfButtonSecondary} onClick={googleHandler}>Google Login</button>
  

        
      
  
    </div>
  )
}

export default GoogleSignIn
