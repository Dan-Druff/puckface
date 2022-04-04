import styles from '../styles/All.module.css';
import Link from "next/link"
import { useRouter } from "next/router"
import { auth } from "../firebase/clientApp"
import { createUserWithEmailAndPassword } from "firebase/auth"
import GoogleSignIn from '../components/GoogleSignin';
import { postSignup } from '../utility/dbHandlers';
import type { DashboardActions } from '../context/DashboardContext';
import { useDashboard } from '../context/DashboardContext';
const EmailPasswordAuthSignUp = () => {
    const Router = useRouter()
    const {dashboardDispatch} = useDashboard();
    const signupHandler = async(e:any) => {
        
      e.preventDefault();
      
  
      try {
        const { email, password, username } = e.target.elements;
        console.log(email.value, password.value, username.value);
        const userResult = await createUserWithEmailAndPassword(auth, email.value, password.value)
        console.log("User resu;t is: ", userResult.user);
        const postResult = await postSignup(email.value,username.value);
        if(typeof postResult === 'boolean'){
            throw new Error('🚦Error Post Signup🚦')
        }else{
            dashboardDispatch({type:'signup',payload:{displayName:postResult.displayName,id:postResult.id}})
            Router.push("/dashboard")
            return;

        }
      
       

   
      } catch (error) {
        alert(error)
        return;
      }
  
    }
    return (
        <div className={styles.rinkDiv}>
            <form onSubmit={signupHandler}>
            <h2>Sign Up</h2>

                <hr className={styles.smallRedLine} /><br />
            <div className={styles.inputDiv}>
            <label htmlFor="email">Email  </label><br />
            <input name="email" id="email" type="email" placeholder="Email" autoComplete="on" required/>
            </div>
            <hr className={styles.blueLine}/><br />
            <div className={styles.inputDiv}>
            <label htmlFor="password">Password </label><br />
            <input name="password" id="password" type="password" placeholder="******************" autoComplete="on" required/>
            </div>
            <hr className={styles.centerLine}/><br />
            {/* <div className={styles.inputDiv}>
            <label htmlFor="password2">Conifirm Password </label>
            <input name="password2" id="password2" type="password" placeholder="******************" autoComplete="on" required/>
            </div> */}
            <div className={styles.inputDiv}>
            <label htmlFor="username">Display Name</label>
            <input name="username" id="username" type="text" placeholder="Display Name" autoComplete="on" required/>
            </div>
            <hr className={styles.blueLine}/><br />
            <button className={styles.pfButton} type="submit">Email Signup</button>
            <br />
            <hr className={styles.smallRedLine} /><br />
            <GoogleSignIn />
            </form>
            {/* <button className={styles.puckButtonGoogle} >Google Signup</button> */}
        
            <br /> 
            <Link href="/login">
            <a>Have Account?</a>
            </Link>
           
        </div>
       )
}

export default EmailPasswordAuthSignUp
