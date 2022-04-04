import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import GoogleSignIn from '../components/GoogleSignin'
import EmailPasswordAuthLogin from '../components/EmailPasswordAuthLogin';
import { useAuth } from '../context/AuthContext';
import { useRouter } from "next/router"

const Login: NextPage = () => {
    const {currentUser} = useAuth();
    const Router = useRouter()

    if (currentUser) {
        Router.push("/dashboard")
        return <></>
      }else{
        return (
        <div className={styles.mainContainer} >
            <div className={styles.formContainer}>
            <EmailPasswordAuthLogin />
            </div>
       
        </div>
        )
    }
}
export default Login