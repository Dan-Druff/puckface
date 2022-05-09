import { useState } from "react"
import { LeagueGame, LeagueTeam, LeagueFormData, LeagueType } from "../utility/constants";
import { useAuth } from "../context/AuthContext";
import { createRandomId, dateReader, dealWithDate } from "../utility/helpers";
import styles from '../styles/All.module.css';
const LeagueForm = () => {
    const today = dateReader(new Date);
    const todForm = `${today.yearNumber.toString()}-${today.monthNumber.toString()}-${today.dayNumber.toString()}`;
    const {userData} = useAuth();
    const [step,setStep] = useState<number>(1);
    const [workingLeague,setWorkingLeague] = useState<LeagueType>({name:'Name of League...',owner:userData === null || userData.userEmail === null ? '' : userData.userEmail,id:createRandomId(),created:new Date, startDate:new Date, endDate:new Date, targetDate: new Date, numberOfTeams:32,open:true,playoffs:false,public:true,champValue:0,buyIn:0,perGame:0,coffer:0,teams:[],results:[],schedule:[]});

    const nextStep = (e:any) => {
        e.preventDefault();
        setStep(step + 1);
    }
    const prevStep = () => {
    

        setStep(step - 1);
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
                    console.log(`Getting Start Date: ${startD}`);
                // const r = dealWithDate(startD);

                    // w.startDate = new Date(yNum,mNum,dNum);
                  

                    // console.log(`What is etargetvalue: ${w.startDate}`);
                    // setWorkingLeague(w);
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
                        <br />
                        <label htmlFor="leagueName">League Name:</label><br />

                    
                        <hr className={styles.blueLine}/><br />
                        <input name="leagueName" id="leagueName" type="text" placeholder={workingLeague.name} onChange={handleChange('leagueName')} required/>
                        <br /><hr className={styles.centerLine}/><br />
                        
                        <label htmlFor="numberOfTeams">Number of Teams: 2 - 32</label><br />
                       
                        <br /><hr className={styles.blueLine}/><br />
                        <input name="numberOfTeams" id="numberOfTeams" type="number" placeholder="32" onChange={handleChange('numberOfTeams')} min="2" max="32"/>


                        <br /><hr className={styles.smallRedLine}/><br />
                        {/* <button className={styles.pfButton} type='button'>BACK</button> */}
                        <button className={styles.pfButton} type='submit'>NEXT</button>
                    </form>
                </div>
              )
        case 2:

            const sd = dateReader(workingLeague.startDate);
            const sdForm = `${sd.yearNumber.toString()}-${sd.monthNumber.toString()}-${sd.dayNumber.toString()}`;

            return (
                <div className={styles.rinkDiv}>
                    <form onSubmit={nextStep}>
                    <h2>Creating League: 2/6</h2>

                    <label htmlFor="startDate">Starting Date:</label><br />
                    <input type="date" id="startDate" name="startDate" value={sdForm} min={sdForm} max='2022-06-02' onChange={handleChange('startDate')}/>
                        <button className={styles.pfButton} type='button' onClick={() => prevStep()}>BACK</button>
                        <button className={styles.pfButton} type='submit'>NEXT</button>
                    </form>
                </div>
            )
        case 3:
            return (
                <div>CASE 3</div>
            )
        case 4:
            return (
                <div>CASE 4</div>
            )
        case 5:
            return (
                <div>CASE 5</div>
            )
        case 6:
            return (
                <div>CASE 6</div>
            )
        case 7:
            return (
                <div>CASE 7</div>
            )                          
        default:
            return (
                <div>CASE Default</div>
            )
    }

}

export default LeagueForm