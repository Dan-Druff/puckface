import type { NextPage } from 'next'
import styles from '../styles/All.module.css';
import { sendMsgToUser, useDashboard } from '../context/DashboardContext';
import { useState } from 'react';
import AuthRoute from '../hoc/authRoute';
import { MessageType, NoteType } from '../utility/constants';
import { useAuth } from '../context/AuthContext';
import { createRandomId } from '../utility/helpers';
import { useRouter } from 'next/router';
const SendMessage: NextPage = () => {
    const Router = useRouter();
    const {friends, dashboardDispatch} = useDashboard();
    const {userData} = useAuth();
    const [toAddress, setToAddress] = useState<string>("user@email.com");
    const [message, setMessage] = useState<string>("");
    const [chooseFriends, setChooseFriends] = useState<boolean>(false);

    const selectFriend = (friend:string) => {
       try {
        setToAddress(friend);
        setChooseFriends(false);
        console.log(`Set friend to : ${friend}`);
         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    const submitMessage = (e:any) => {
       e.preventDefault();
        try {
            if(userData === null || userData.userEmail === null)throw new Error("Error ud");
            // create msg object
            const tid = createRandomId();
            const m : MessageType = {
                    by:userData.userEmail,
                    id:tid,
                    message:message,
                    regarding:tid,
                    state:'open',
                    tokens:[],
                    tx:false,
                    type:'message',
                    value:0,
                    when:new Date
                }
                sendMsgToUser(m,toAddress);

        // send msg object

        // DO I NEED a tx ?
        // Route player back to dashboard
            Router.push('/dashboard');
        // notify
        const n : NoteType = {
            cancelFunction:() => {},
            cancelTitle:"Cool",
            colorClass:"",
            mainFunction:() => {},
            mainTitle:"Cool",
            message:`Message to ${toAddress} sent.`,
            twoButtons:false
        }
        dashboardDispatch({type:'notify',payload:{notObj:n}});

        return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    const handleTextChange = (input:string) => (e:any) => {
        e.preventDefault();
       try {
           switch (input) {
               case "sendTo":
                   const sendto = e.target.value;
                   setToAddress(sendto);
                   break;
                case "message":
                    const msg = e.target.value;
                    setMessage(msg);
                    break;
               default:
                   break;
           }
    
         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    return (
        <AuthRoute>
            {chooseFriends ? 
            <div className={styles.contentContainer}>
                 <div className={styles.rinkDiv}>
                     <h2>FRIENDS LIST</h2>
                     {friends.map((f) => {
                         return (
                             <button key={f} type="button" className={styles.pfButton} onClick={() => selectFriend(f)}>{f}</button>
                         )
                     })}
                 </div>
            </div>
            :
            <div className={styles.contentContainer}>
               
            <div className={styles.rinkDiv}>
                <form onSubmit={submitMessage}>
                    <h2>Sending Message:</h2>
                    <br /><hr className={styles.smallRedLine}/><br />
                    <button type="submit" className={styles.pfButton} onClick={() => setChooseFriends(true)}>CHOOSE FROM FRIENDS</button>
                    <br /><hr className={styles.blueLine}/><br />
                    <br /><label htmlFor="toAddress"> Or Send To:</label><br />
                    <input name="toAddress" id="toAddress" type="text" placeholder={toAddress} value={toAddress} onChange={handleTextChange('sendTo')} required/>
                    <br /><hr className={styles.centerLine}/><br />
                    <label htmlFor="msg">Message:</label><br />
                    {/* <input name="msg" id="msg" type="textarea" placeholder={message} value={message} onChange={handleTextChange('message')} required/> */}
                    <textarea value={message} onChange={handleTextChange('message')} required/>
                    <br /><hr className={styles.blueLine}/><br />
                    <button type="submit" className={styles.pfButton}>SEND MESSAGE</button>
                    <br /><hr className={styles.smallRedLine}/><br />
                </form>
            
                </div>
            </div>
            }
         
        </AuthRoute>
    )
}
export default SendMessage