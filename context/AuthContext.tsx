import React, {useEffect, useState, useContext} from "react";
import { auth } from "../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/app";
export interface UserData {
    userId:string,
    userName:string | null,
    userEmail:string | null,
    userPhotoLink:string | null,
    userProviderId:string
}
export const AuthContext = React.createContext<firebase.User | null>(null);

export function useAuth(){
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
    const [loading,setLoading] = useState<boolean>(true);
    const [userData,setUserData] = useState<UserData>({userProviderId: "",userId: "",userName: "",userEmail: "",userPhotoLink: ""})
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("IM BEING CALLED 🍟")
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
        currentUser,
        userData
    }
    if(loading){
        return <>LOADING....</>
    }
    return (
        <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
    )
}