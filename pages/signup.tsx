import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import EmailPasswordAuthSignUp from '../components/EmailPasswordAuthSignUp'
const Signup: NextPage = () => {
    const {currentUser} = useAuth();
    const Router = useRouter();
    if (currentUser) {
        Router.push("/dashboard")
        return <></>
      } else {
        return (
            <div className={styles.mainContainer}>
                <div className={styles.formContainer}>
                    <EmailPasswordAuthSignUp />
                </div>
            </div>
        )
      }
}
export default Signup