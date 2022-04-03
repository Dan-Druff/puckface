import React, {useEffect, useState, useContext, ReactNode} from "react";
import { auth } from "../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

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
export const AuthContext = React.createContext<User | null>(null);

export function useAuth(){
    return useContext(AuthContext);
}

export const AuthProvider = ({children}:{children:ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading,setLoading] = useState<boolean>(true);
    const [userData,setUserData] = useState<UserData>({userProviderId: "",userId: "",userName: "",userEmail: "",userPhotoLink: ""})
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
                setUserData({userProviderId: "",userId: "",userName: "",userEmail: "",userPhotoLink: ""});
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
        return <>LOADING....</>
    }
    return (
        <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
    )
}