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
    const {dashboardDispatch, displayName} = useDashboard();
    const {userData} = useAuth();
    const Router = useRouter();
    const signOutHandler = async() => {
        await signOut(auth);
        gameStateDispatch({type:'home'})
        dashboardDispatch({type:'clear'});
   
        Router.push('/');

    }
    const historyHandler = () => {
        console.log("HISTORY");
    }
    return (
        <AuthRoute>
            <div className={styles.contentContainer}>
            <div className={styles.rinkDiv}>
        
                <h2>{displayName}</h2>
                <hr className={styles.smallRedLine} /><br />
                <button className={styles.pfButton} onClick={signOutHandler}>LOGOUT</button>

                <hr className={styles.blueLine}/><br />
                <button className={styles.pfButton} onClick={historyHandler}>HISTORY</button>

          
                <hr className={styles.centerLine}/>

            <div>
            <h4>Email:</h4>
                <p>{userData !== null && userData.userEmail}</p>
   
            </div>
            <hr className={styles.blueLine}/><br />
            <div>
            <h4>UserId:</h4>
                <p>{userData !== null && userData.userId}</p>
            </div>
            <hr className={styles.smallRedLine} /><br />
            <div>
                <h4>Profile Pic:</h4>
                {userData !== null && userData.userPhotoLink ? (
                <Image src={userData.userPhotoLink} width={80} height={80} alt='userPhoto'/>
                
                ) : (
                "No pic on file"
                )}
            </div>
            

            </div>
            </div>
        </AuthRoute>
    )

}
export default Profile