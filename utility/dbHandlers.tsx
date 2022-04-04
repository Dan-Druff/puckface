import { db } from "../firebase/clientApp";
import {doc,getDoc,setDoc} from 'firebase/firestore';
import { createRandomId } from "./helpers";
export const postSignup = async(email:string, username:string):Promise<boolean> => {
    try {
        let dName = '';
            if(username === 'googlesignin'){
                const r = await setDoc(doc(db,'users',email), {
                    cards:[],
                    pucks:0,
                    activeLeagues:[],
                    username:email,
                    activeGames:[],
                    userId:createRandomId()
                })
                // setDisplayName(email);
                dName = email;
            }else{
                const r = await setDoc(doc(db,'users',email), {
                    cards:[],
                    pucks:0,
                    activeLeagues:[],
                    username:username,
                    activeGames:[],
                    userId:createRandomId()
                })
                dName = username;
                // setDisplayName(username);
            }
           return true;
    } catch (er) {
       console.log("Some Error: ", er); 
       return false;
    }
}
export const postLogin = async() => {
    try {
        
    } catch (er) {
       console.log("Some Error: ", er); 
    }
}
