import React, {useEffect, useState, useContext, ReactNode} from "react";
import styles from '../styles/All.module.css';
import { auth } from "../firebase/clientApp";
// import { onAuthStateChanged } from "firebase/auth";
import Loader from "../components/Loader";
import { User } from "firebase/auth";

export interface UserData {
    userId:string,
    userName:string | null,
    userEmail:string | null,
    userPhotoLink:string | null,
    userProviderId:string
}
interface DType {
    currentUser:User | null,
    userData:UserData | null
}
export const AuthContext = React.createContext<DType>({currentUser:null,userData:null});

export function useAuth(){
    return useContext(AuthContext);
}

export const AuthProvider = ({children}:{children:ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading,setLoading] = useState<boolean>(true);
    const [userData,setUserData] = useState<UserData | null>(null)
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("IM BEING CALLED 🍟",user)
            if(user){
                const requiredData:UserData = {
                    userProviderId: user.providerData[0].providerId,
                    userId: user.uid,
                    userName: user.displayName,
                    userEmail: user.email,
                    userPhotoLink: user.photoURL,
                  }
          
                  setUserData(requiredData)
                  setCurrentUser(user)
            }else{
                setCurrentUser(null);
                setUserData(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    },[]);

    let authValue = {
        currentUser:currentUser,
        userData:userData
    }
    if(loading){
        return (
            <div className={styles.contentContainer}>
                <Loader message='Loading...' />
            </div>
        )
    }
    return (
        <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    )
}