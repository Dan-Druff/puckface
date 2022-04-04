import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useAuth } from '../context/AuthContext'
import {useRouter} from 'next/router';
import { signOut} from 'firebase/auth';
import { auth } from '../firebase/clientApp';
import Image from 'next/image';
import AuthRoute from '../hoc/authRoute';
import { useGameState } from '../context/GameState';
import { useDashboard } from '../context/DashboardContext';
const Profile: NextPage = () => {
    const {gameStateDispatch} = useGameState();
    const {dashboardDispatch} = useDashboard();
    const {userData} = useAuth();
    const Router = useRouter();
    const signOutHandler = async() => {
        await signOut(auth);
        gameStateDispatch({type:'home'})
        dashboardDispatch({type:'clear'});
   
        Router.push('/');

    }
    return (
        <AuthRoute>
            <div className={styles.contentContainer}>
            <div className={styles.rinkDiv}>
        
                <h2>PROFILE</h2>
                <p>Game State: </p>
                <button className={styles.pfButton} onClick={signOutHandler}>LOGOUT</button>
                <h3>{userData !== null && userData.userEmail}</h3>
            <div>
                <h4>Signup method:</h4>
                <h6>{userData !== null && userData.userProviderId}</h6>
            </div>
            <div>
                <h4>UserId:</h4>
                <h6>{userData !== null && userData.userId}</h6>
            </div>
            <div>
                <h4>Display Name:</h4>
                <h6>{userData !== null && userData.userName ? userData.userName : "null"}</h6>
            </div>
            <div>
                <h4>Email:</h4>
                <h6>{userData !== null && userData.userEmail}</h6>
            </div>
            <div>
                <h4>Profile Pic:</h4>
                {userData !== null && userData.userPhotoLink ? (
                <Image src={userData.userPhotoLink} width={80} height={80} alt='userPhoto'/>
                
                ) : (
                "null"
                )}
            </div>
            

            </div>
            </div>
        </AuthRoute>
    )

}
export default Profile