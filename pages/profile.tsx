import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { useAuth } from '../context/AuthContext'
import {useRouter} from 'next/router';
import { signOut} from 'firebase/auth';
import { auth } from '../firebase/clientApp';
import Image from 'next/image';
const Profile: NextPage = () => {
    const {userData} = useAuth();
    console.log("PROFILE COMP: ", userData);
    const Router = useRouter();
    const signOutHandler = async() => {
        await signOut(auth);

        
   
        Router.push('/');

    }
    if(userData === null){

        Router.push('/');
        return <></>
    }else{
        return (
            <div className={styles.contentContainer}>
            <div className={styles.rinkDiv}>
        
                <h2>PROFILE</h2>
                <p>Game State: </p>
                <button className={styles.pfButton} onClick={signOutHandler}>LOGOUT</button>
                <h3>{userData.userEmail}</h3>
            <div>
                <h4>Signup method:</h4>
                <h6>{userData.userProviderId}</h6>
              </div>
              <div>
                <h4>UserId:</h4>
                <h6>{userData.userId}</h6>
              </div>
              <div>
                <h4>Display Name:</h4>
                <h6>{userData.userName ? userData.userName : "null"}</h6>
              </div>
              <div>
                <h4>Email:</h4>
                <h6>{userData.userEmail}</h6>
              </div>
              <div>
                <h4>Profile Pic:</h4>
                {userData.userPhotoLink ? (
                   <Image src={userData.userPhotoLink} width={80} height={80} alt={userData.userName}/>
                 
                ) : (
                  "null"
                )}
              </div>
            
    
            </div>
            </div>
        )
    }
 
}
export default Profile