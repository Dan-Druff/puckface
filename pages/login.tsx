import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import GoogleSignIn from '../components/GoogleSignin'
const Login: NextPage = () => {
    return (
        <div className={styles.mainContainer}>
            <h2>Login</h2>
            <GoogleSignIn />
        </div>
    )
}
export default Login