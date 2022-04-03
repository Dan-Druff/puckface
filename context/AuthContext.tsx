import React, {useEffect, useState, useContext, ReactNode} from "react";
import { auth } from "../firebase/clientApp";
// import { onAuthStateChanged } from "firebase/auth";
// import firebase from "firebase/app";
import { User } from "firebase/auth";
export interface UserData {
    userId:string,
    userName:string | null,
    userEmail:string | null,
    userPhotoLink:string | null,
    userProviderId:string
}
export const AuthContext = React.createContext<User | null>(null);

export function useAuth(){
    return useContext(AuthContext);
}

export const AuthProvider = ({children}:{children:ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading,setLoading] = useState<boolean>(true);
    // const [userData,setUserData] = useState<UserData | null>(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("IM BEING CALLED 🍟", user);
            if(user){
                console.log("User is: ",user);
                const requiredData:UserData = {
                    userProviderId: user.providerData[0].providerId,
                    userId: user.uid,
                    userName: user.displayName,
                    userEmail: user.email,
                    userPhotoLink: user.photoURL,

                  }
          
                 
                  setCurrentUser(user)
            }else{
                console.log("Else: ", user);
                setCurrentUser(null);
        
            }
            setLoading(false);
        });
        return unsubscribe;
    },[]);

 
    if(loading){
        return <>LOADING....</>
    }
    return (
        <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
    )
}