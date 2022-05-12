import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MessageType, NoteType } from '../../../utility/constants';
import { createRandomId } from '../../../utility/helpers';
import { sendMsgToUser, useDashboard } from '../../../context/DashboardContext';
const SendMessageTo: NextPage = () => {
    const Router = useRouter();
    const {userData} = useAuth();
    const {dashboardDispatch} = useDashboard();
    const {id} = Router.query;
    const toUser = typeof id === 'string' ? id : "error";
    const [msg,setMsg] = useState<string>("");

    const handleTextChange = (input:string) => (e:any) => {
        e.preventDefault();
       try {
        const msge = e.target.value;
        setMsg(msge);
    
         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    const submitMessage = () => {
       try {
        if(userData === null || userData.userEmail === null)throw new Error("Error ud");
        const tid = createRandomId();

        const mm : MessageType = {
            by:userData.userEmail,
            id:tid,
            message:msg,
            regarding:tid,
            state:'open',
            tokens:[],
            tx:false,
            type:'message',
            value:0,
            when:new Date
        }
        sendMsgToUser(mm,toUser);
        Router.push('/dashboard');
        const n : NoteType = {
            cancelFunction:() => {},
            cancelTitle:"Cool",
            colorClass:"",
            mainFunction:() => {},
            mainTitle:"Cool",
            message:`Message to ${toUser} sent.`,
            twoButtons:false
        }
        dashboardDispatch({type:'notify',payload:{notObj:n}});
         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    return (
        <div className={styles.contentContainer}>
            <div className={styles.rinkDiv}>
                <form onSubmit={submitMessage}>
                    <h2>Sending Message to {toUser}:</h2>
                    <br /><hr className={styles.smallRedLine}/><br />
                    <br /><hr className={styles.blueLine}/><br />
                    <br /><hr className={styles.centerLine}/><br />
                    <label htmlFor="msg">Message:</label><br />
                    {/* <input name="msg" id="msg" type="textarea" placeholder={message} value={message} onChange={handleTextChange('message')} required/> */}
                    <textarea value={msg} onChange={handleTextChange('message')} required/>
                    <br /><hr className={styles.blueLine}/><br />
                    <button type="submit" className={styles.pfButton}>SEND MESSAGE</button>
                    <br /><hr className={styles.smallRedLine}/><br />
                </form>
            
                </div>    

        </div>
    )
}
export default SendMessageTo