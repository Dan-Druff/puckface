import { useState } from "react"
import { LeagueGame, LeagueTeam, LeagueFormData, LeagueType } from "../utility/constants";
import { useAuth } from "../context/AuthContext";
import { createRandomId, dateReader, dealWithDate,convertDate } from "../utility/helpers";
import styles from '../styles/All.module.css';
import "react-datepicker/dist/react-datepicker.css"; 
import DatePicker from "react-datepicker";
import ToggleSwitch from "./ToggleSwitch";
import { useRouter } from "next/router";
import { useGameState } from "../context/GameState";
const LeagueForm = () => {
    const today = dateReader(new Date);
    const todForm = `${today.yearNumber.toString()}-${today.monthNumber.toString()}-${today.dayNumber.toString()}`;
    const {userData} = useAuth();
    const [step,setStep] = useState<number>(1);
    const [workingLeague,setWorkingLeague] = useState<LeagueType>({name:'Name of League...',owner:userData === null || userData.userEmail === null ? '' : userData.userEmail,id:createRandomId(),created:new Date, startDate:new Date, endDate:new Date(2022,8,1), targetDate: new Date, numberOfTeams:32,open:true,playoffs:false,public:true,champValue:0,buyIn:0,perGame:0,coffer:0,teams:[],results:[],schedule:[]});
    const [startDate, setStartDate] = useState<Date>(new Date);
    const [endDate, setEndDate] = useState<Date>(new Date(2022,8,1));
    const [playoffs,setPlayoffs] = useState<boolean>(false);
    const [privateLeague,setPrivateLeague] = useState<boolean>(false);
    const [daily,setDaily] = useState<boolean>(true);
    const Router = useRouter();
    const {gameStateDispatch} = useGameState();

    const nextStep = (e:any) => {
        e.preventDefault();
        setStep(step + 1);
    }
    const prevStep = () => {
    

        setStep(step - 1);
    }
    const finishCreate = () => {
        gameStateDispatch({type:'dashboard'});
        Router.push('/dashboard');
    }
    const submitLeague = (e:any) => {
        e.preventDefault();
        try {
            console.log(`Submit League Data, and set state here`);
            setStep(7);
        } catch (er) {
            console.log("Error Submitting League: ",er);

        }
    }
    const handleChange = (input:string) => (e:any) => {
       e.preventDefault();
        try {

            console.log(`Handling change ${input}`);
            let w = workingLeague;
            switch (input) {
                case 'leagueName':
                 
                    const leagueName = e.target.value;
                    w.name = leagueName;
                    setWorkingLeague(w);
                    break;
                case 'numberOfTeams':
                    const howManyTeams = Number(e.target.value);
                    w.numberOfTeams = howManyTeams;
                    setWorkingLeague(w);
                    break;
                case 'startDate':
                    const startD = e.target.value;
                   
                    console.log(`What is R: ${startD}`);
                    // w.startDate = new Date(yNum,mNum,dNum);
                  

                    // console.log(`What is etargetvalue: ${w.startDate}`);
                    // setWorkingLeague(w);
                    break;   
                case 'endDate':
                    const endD = e.target.value;
                    const h = dealWithDate(endD);
                    console.log(`What is H: ${h}`);
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

    switch (step) {
        case 1:
            return (
                <div className={styles.rinkDiv}>
                    <form onSubmit={nextStep}>
                        <h2>Creating League: 1/6</h2>
                        <hr className={styles.smallRedLine}/>
                        <br /><label htmlFor="leagueName">League Name:</label><br />
                        <hr className={styles.blueLine}/><br />
                        <input name="leagueName" id="leagueName" type="text" placeholder={workingLeague.name} onChange={handleChange('leagueName')} required/>
                        <br /><hr className={styles.centerLine}/><br />
                        <label htmlFor="numberOfTeams">Number of Teams: 2 - 32</label><br />
                        <br /><hr className={styles.blueLine}/><br />
                        <input name="numberOfTeams" id="numberOfTeams" type="number" placeholder="32" onChange={handleChange('numberOfTeams')} min="2" max="32"/>
                        <br /><hr className={styles.smallRedLine}/><br />
                        <button className={styles.pfButton} type='submit'>NEXT</button>
                    </form>
                </div>
              )
        case 2:


            return (
                <div className={styles.rinkDiv}>
                    <form onSubmit={nextStep}>
                    <h2>Creating League 2/6</h2>
                    <p>Start and End Date: </p>
                    <br /><hr className={styles.smallRedLine}/><br />
                    <label htmlFor="startDate">Starting Date:</label><br />
                    <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)}/>
                    <br /><hr className={styles.blueLine}/><br />
                    <label htmlFor="startDate">Ending Date:</label><br />
                    <DatePicker selected={endDate} onChange={(date:Date) => setEndDate(date)}/>
                    <br /><hr className={styles.centerLine}/><br />
                    <button className={styles.pfButton} type='button' onClick={() => prevStep()}>BACK</button>
                    <button className={styles.pfButton} type='submit'>NEXT</button>
                    <br /><hr className={styles.blueLine}/><br />
                      
                    </form>
                </div>
            )
        case 3:
            return (
                <div className={styles.rinkDiv}>
                    <form onSubmit={nextStep}>
                        <h2>Creating League 3/6</h2>
                        <br /><hr className={styles.smallRedLine}/><br />
                        <p>SEASON ONLY or WITH PLAYOFFS:</p>
                        <ToggleSwitch label="Playoffs" setToggle={setPlayoffs} toggle={playoffs} />
                        <br /><hr className={styles.blueLine}/><br />
                        <p>PUBLIC or PRIVATE LEAGUE:</p>
                        <ToggleSwitch label="Public" setToggle={setPrivateLeague} toggle={privateLeague} />
                        <br /><hr className={styles.centerLine}/><br />
                        <button className={styles.pfButton} type='button' onClick={() => prevStep()}>BACK</button>
                        <button className={styles.pfButton} type='submit'>NEXT</button>
                        <br /><hr className={styles.blueLine}/><br />
                        <br /><hr className={styles.smallRedLine}/><br />

                    </form>
                </div>
            )
        case 4:
            return (
                <div className={styles.rinkDiv}>
                    <form onSubmit={nextStep}>
                        <h2>Creating League 4/6</h2>
                        <br /><hr className={styles.smallRedLine}/><br />
                        <p>DAILY GAMES or EVERY OTHER DAY:</p>
                        <br /><hr className={styles.blueLine}/><br />
                        <ToggleSwitch label="Daily" setToggle={setDaily} toggle={daily}/>
                        <br /><hr className={styles.centerLine}/><br />
                        <button className={styles.pfButton} type='button' onClick={() => prevStep()}>BACK</button>
                        <button className={styles.pfButton} type='submit'>NEXT</button>
                        <br /><hr className={styles.blueLine}/><br />
                        <br /><hr className={styles.smallRedLine}/><br />

                    </form>
                </div>
            )
        case 5:
            return (
                <div className={styles.rinkDiv}>
                    <form onSubmit={nextStep}>
                        <h2>Creating League 5/6</h2>
                        <br /><hr className={styles.smallRedLine}/><br />
                        <p>$$$ Settings:</p>
                        <br /><hr className={styles.blueLine}/><br />
                       <p>Gotta figure out how league settings work.</p>
                        <br /><hr className={styles.centerLine}/><br />
                        <p>Winner Take All? Or 1st, 2nd 3rd?</p>
                        <br /><hr className={styles.blueLine}/><br />
                        <button className={styles.pfButton} type='button' onClick={() => prevStep()}>BACK</button>
                        <button className={styles.pfButton} type='submit'>NEXT</button>
                        <br /><hr className={styles.smallRedLine}/><br />
                    </form>
                </div>
            )
        case 6:
            return (
                <div className={styles.rinkDiv}>
                    <form onSubmit={submitLeague}>
                        <h2>Creating League 6/6</h2>
                        <br /><hr className={styles.smallRedLine}/><br />
                        <p>Confirm Data:</p>
                        <br /><hr className={styles.blueLine}/><br />
                        <p>Display Data for confirmation.</p>
                        <br /><hr className={styles.centerLine}/><br />
                        <p>Display Data for confirmation.</p>
                        <br /><hr className={styles.blueLine}/><br />
                        <button className={styles.pfButton} type='button' onClick={() => prevStep()}>BACK</button>
                        <button className={styles.pfButton} type='submit'>CONFIRM</button>
                        <br /><hr className={styles.smallRedLine}/><br />
                    </form>
                </div>
            )
        case 7:
            return (
                <div className={styles.rinkDiv}>
                    <h2>SUCCESS</h2>
                    <p>Creating League</p>
                    <br /><hr className={styles.smallRedLine}/><br />
                    <button className={styles.pfButton} type='button' onClick={() => finishCreate()}>COOL!</button>

                </div>
            )                          
        default:
            return (
                <div>CASE Default</div>
            )
    }

}

export default LeagueForm