import type { NextPage } from 'next'
import styles from '../../../styles/All.module.css';
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react';
import { LeagueTeam, LeagueType, MessageType, NoteType, TxType } from '../../../utility/constants';
import { useDashboard, addIdToUsersLeagueArrayDB, addTeamToLeagueDB, getLeagueFromDB, puckfaceLog, sendMsgToUser } from '../../../context/DashboardContext';
import { useAuth } from '../../../context/AuthContext';
import { createRandomId } from '../../../utility/helpers';
import { useGameState } from '../../../context/GameState';
const League: NextPage = () => {
    const {gameStateDispatch} = useGameState();
    const {dashboardDispatch} = useDashboard();
    const {userData} = useAuth();
    const Router = useRouter();
    const {id} = Router.query;
    const [currentLeague, setCurrentLeague] = useState<LeagueType>({name:'Name of League...',owner:'',id:'',created:new Date, startDate:new Date, endDate:new Date(2022,8,1), targetDate: new Date, numberOfTeams:32,open:true,playoffs:false,public:true,champValue:0,buyIn:0,perGame:0,coffer:0,teams:[],results:[],schedule:[]})
    const [iAmOwner, setIAmOwner] = useState<boolean>(false);
    const [iAmParticipant, setIAmParticipant] = useState<boolean>(false);
    const [inviting, setInviting] = useState<boolean>(false);
    const [playerToInvite, setPlayerToInvite] = useState<string>("player@email.com");
    const setInvitee = (input:string) => (e:any) => {
      e.preventDefault();

       try {
          const invitee = e.target.value;
          console.log(`Do Error chek here. Setting Player to invite: ${invitee}`);
          setPlayerToInvite(invitee);
         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    const inviteFriend = () => {
       try {
         console.log(`Thsi is where I send invitation to: ${playerToInvite}`);
         // OK, this is where I left off. What steps do I need to take?
       
         // get invitee's email address from user in a form text box
        let tms = currentLeague.teams;
        tms = tms.filter(t => t.owner === playerToInvite);
        if(tms.length > 0){
          const nn :NoteType = {
            cancelFunction:() => {},
            cancelTitle:"Cool",
            colorClass:"",
            mainFunction:() => {},
            mainTitle:"Cool",
            message:`That Player is already in the league!`,
            twoButtons:false
          }
          dashboardDispatch({type:'notify',payload:{notObj:nn}});
          return;
        }
         if(userData === null || userData.userEmail === null)throw new Error("Error UD");
        const tid = createRandomId();
         const m : MessageType = {
          by:userData.userEmail,
          id:tid,
          message:`You have been invited to league ${currentLeague.name} ${currentLeague.id}`,
          regarding:currentLeague.id,
          state:'open',
          tokens:[],
          tx:false,
          type:'leagueInvite',
          value:0,
          when:new Date
        }
        sendMsgToUser(m,playerToInvite);
        const tx:TxType = {
          by:playerToInvite,
          from:userData.userEmail,
          id:tid,
          regarding:currentLeague.id,
          state:'open',
          to:userData.userEmail,
          tokens:[],
          tx:true,
          type:'invitePlayer',
          value:0,
          when:new Date,
          freeAgentToken:0

        };
        puckfaceLog(tx);
         // create a MessageType Object

         // Send Message
     
         const n :NoteType = {
           cancelFunction:() => {},
           cancelTitle:"Cool",
           colorClass:"",
           mainFunction:() => {},
           mainTitle:"Cool",
           message:`You have sent an invit to player ${playerToInvite}`,
           twoButtons:false
         }
         dashboardDispatch({type:'notify',payload:{notObj:n}});
         // Alert user the message has been sent
         setInviting(false);

         // do all steps from receipt of invite...
    
         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    const joinLeague = async() => {
       try {
         if(userData === null || userData.userEmail === null)throw new Error("Error ud");
        const lTeam : LeagueTeam = {
          losses:0,
          owner:userData.userEmail,
          schedule:[],
          teamName:"Default Team Name",
          ties:0,
          wins:0
        }
        // add teamObj to league.Teams DB
        const addTeam = await addTeamToLeagueDB(currentLeague.id,lTeam);
        if(addTeam === false)throw new Error("Error addingTeam to DB");
        // add leage to active League DB
        const addTeam2 = await addIdToUsersLeagueArrayDB(userData.userEmail,currentLeague.id);
        if(addTeam2 === false)throw new Error("Error addingTeam to DB2");
        // add teamObj to currentLeague.state
        let x = currentLeague;
        x.teams.push(lTeam);
        setCurrentLeague(x);
        // add league id to active leagues state
        dashboardDispatch({type:'joinLeague',payload:{id:currentLeague.id}});
        // do tx
        const tId = createRandomId();
        const tdate = new Date;
        const tt : TxType = {
          by:userData.userEmail,
          from:userData.userEmail,
          id:tId,
          regarding:currentLeague.id,
          state:'closed',
          to:userData.userEmail,
          tokens:[],
          tx:true,
          type:'joinLeague',
          value:0,
          when:tdate,
          freeAgentToken:0
        }
        puckfaceLog(tt);
        // do msg
        const mm : MessageType = {
          by:userData.userEmail,
          id:tId,
          message:`I Joined your league! ${lTeam.owner}`,
          regarding:currentLeague.id,
          state:'open',
          tokens:[],
          tx:false,
          type:'leagueJoined',
          value:0,
          when:tdate
        }
        sendMsgToUser(mm,currentLeague.owner);
        // set Iam Participant
        setIAmParticipant(true);
        gameStateDispatch({type:'leagueId'});


         return;
       }catch(er){
         console.log(`🚦Error: ${er}🚦`)
         return;
       }
    }
    useEffect(() => {
        
        const initLeague = async() => {
           try {
               if(typeof id === 'string'){
                 if(userData === null || userData.userEmail === null)throw new Error("Error userdata");
                const leeg = await getLeagueFromDB(id);
                if(leeg === false)throw new Error("Error gettin league from db");
                if(userData.userEmail === leeg.owner){
                  setCurrentLeague(leeg);
                  setIAmOwner(true);
                 }else{
                  setCurrentLeague(leeg);
                  setIAmParticipant(leeg.teams.filter(t => t.owner === userData.userEmail).length > 0);
                }
                
                
               }else{
                   throw new Error("ID is not string:");
               }
         
             return;
           }catch(er){
             console.log(`🚦Error: ${er}🚦`)
             return;
           }
        }
        initLeague();
      return () => {
        
      }
    }, [])
    
    return (
        <div className={styles.contentContainerColumn}>
           <h1>League Name: {currentLeague.name}</h1>
            <h2>League ID: {id}</h2>
            {inviting && 
            <div className={styles.rinkDiv}>
                <label htmlFor="invitee">Enter Invitees Email:  </label><br />
                <input name="invitee" id="invitee" type="text" placeholder={playerToInvite} onChange={setInvitee('invitee')} required/>
                <button className={styles.pfButton} onClick={() => inviteFriend()}>INVITE</button>
                <button className={styles.pfButton} onClick={() => setInviting(false)}>CANCEL</button>

           </div>
            }
            {iAmOwner ? 
            <>
            <h2>League ADMIN</h2>
            <button className={styles.pfButton} onClick={() => setInviting(true)}>Invite Friend to League</button>

            {currentLeague.teams.map((tm) => {
              return (
                <p key={tm.owner}>Team: {tm.owner} - {tm.teamName}</p>
              )
            })}
            <button className={styles.pfButton}>Do SOmething 1</button>
            <button className={styles.pfButton}>Do SOmething 2</button>

            </> 
            : 
            <>
            {iAmParticipant ? 
            <>
            <h2>🥅 Im in the League! 🏒 </h2>
            <button className={styles.pfButton} onClick={() => inviteFriend()}>Invite Friend to League</button>

            {currentLeague.teams.map((tm) => {
              return (
                <p key={tm.owner}>Team: {tm.owner} - {tm.teamName}</p>
              )
            })}
            </> 
            : 
            <>
            <h2>I am not in the league :(</h2>
            <button className={styles.pfButton} onClick={() => joinLeague()}>JOIN LEAGUE</button>
            </>
            }
            
            </>
            }
           
            
        </div>
    )
}
export default League