import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import ToggleSwitch from '../components/ToggleSwitch'
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createRandomId } from '../utility/helpers';
import { useDashboard } from '../context/DashboardContext';
import { useRouter } from 'next/router';
import { useGameState } from '../context/GameState';
import BuildABench from '../components/BuildABench';
import { GameType, GameStates, GamePosition, CardType, nobody } from '../utility/constants';
import BenchCard from '../components/BenchCard';
const CreateGame: NextPage = () => {
    const Router = useRouter();
    const {userData} = useAuth();
    const {pucks,editing,availableGuys,dashboardDispatch,prevPlayer,team, createGameInDB} = useDashboard();
    const {gameStateDispatch} = useGameState();
    const [isPrivateGame, setIsPrivateGame] = useState<boolean>(false);
    const [buildingTeam, setBuildingTeam] = useState<boolean>(false);
    const [gameObject, setGameObject] = useState<GameType>({open:true,awayEmail:'',awayName:'',homeEmail:'',homeName:'',date:new Date(),id:createRandomId(),value:0,private:false,gameState:GameStates.init,homeTeam:{lw:0,c:0,rw:0,d1:0,d2:0,g:0},awayTeam:{lw:0,c:0,rw:0,d1:0,d2:0,g:0}});
    const gameValue = useRef(1);
    let bo = {
        guys:availableGuys,
        dispatch:dashboardDispatch,
        prevPlayer:prevPlayer,
        game:gameObject
    
    }
    const selectForEdit = (posId:GamePosition, tokenId:number) => {

        try {
           console.log("DID I GET TOKEN ID HERE? ", tokenId);
           console.log("Also, did i get game id: ", gameObject.id);
            // let thePlayer = team[posId];
            let player:CardType = nobody;
            switch (posId) {
                case GamePosition.C:
                    player = team.c;
                    break;
                case GamePosition.D1:
                    player = team.d1;
                    break;
                case GamePosition.D2:
                    player = team.d2;
                    break;
                case GamePosition.G:
                    player = team.g;
                    break;
                case GamePosition.LW:
                    player = team.lw;
                    break;                
                case GamePosition.RW:
                    player = team.rw;
                    break;
                case GamePosition.NONE:

                    break;    
                default:
                    break;
            }
            dashboardDispatch({type:'editPlayer',payload:{player:player,posId:posId}})

            console.log("Selecting pos: ",posId);
        } catch (e) {
            console.log("SelectError: ", e);
        }
    }
    const createGameHandler = async(e:any) => {
        e.preventDefault();

        try {
            console.log("create game Handler: ",Number(gameValue.current));
            let dbObject = gameObject;
            dbObject.value = Number(gameValue.current);
            if (userData === null || userData.userEmail === null) throw new Error('🚦user data error🚦')
            dbObject.homeEmail = userData.userEmail;
            // TO DO... retreive users display name here..
            dbObject.homeName = userData.userEmail;
            dbObject.private = isPrivateGame;
            dbObject.gameState = GameStates.waitForOpp;
            dbObject.homeTeam.lw = team.lw.tokenId;
            dbObject.homeTeam.c = team.c.tokenId;
            dbObject.homeTeam.rw = team.rw.tokenId;
            dbObject.homeTeam.d1 = team.d1.tokenId;
            dbObject.homeTeam.d2 = team.d2.tokenId;
            dbObject.homeTeam.g = team.g.tokenId;

            const dbResult = await createGameInDB(dbObject);
            if(dbResult === false) throw new Error('🚦create game error🚦');
            let newPucks = pucks - dbObject.value;
            dashboardDispatch({type:'createLobbyGame',payload:{game:dbResult, newPucks:newPucks}})
            
            Router.push(`/game/${gameObject.id}`)
            return;
  
            
        } catch (er) {
            console.log("Error", er);
            return;
        }


    }
    const buildTeamHandler = async(e:any) => {
        e.preventDefault();
        try {
            // Check stuff here
          
            const {howMuch} = e.target.elements;
           
            gameValue.current = howMuch.value;

            setBuildingTeam(true);
            return;
        } catch (er) {
            console.log("Error: ", er);
            return;
        }
    }
    let togg = {
        label:'Public',
        setToggle:setIsPrivateGame,
        toggle:isPrivateGame
    }
    return (
  
        <div className={styles.mainContainer}>
            <h3>CREATING GAME SUCKA</h3>
            {editing && <BuildABench benchObj={bo}/>}
            {/* {editing && 
            <BuildABench guys={availableGuys} dispatch={dashboardDispatch} prevPlayer={prevPlayer} setEditing={setEditing} game={gameObject}/>
            } */}
            {buildingTeam ?
            <div className={styles.contentContainer}>
              <div className={styles.rinkDiv}>
                  <form onSubmit={createGameHandler}>
                  <h2>Build Team:</h2>
                  <hr className={styles.smallRedLine} />
                  <div className={styles.cardRow}>
                    <BenchCard card={team.lw} active={true} func={selectForEdit} posId={GamePosition.LW}/>
                    <BenchCard card={team.c} active={true} func={selectForEdit} posId={GamePosition.C}/>
                    <BenchCard card={team.rw} active={true} func={selectForEdit} posId={GamePosition.RW}/>

             
                  </div>
            
              <hr className={styles.blueLine}/>
              <div className={styles.cardRow}>
                <BenchCard card={team.d1} active={true} func={selectForEdit} posId={GamePosition.D1}/>
                <BenchCard card={team.d2} active={true} func={selectForEdit} posId={GamePosition.D2}/>

                 
             
                  </div>
              <hr className={styles.centerLine}/>
              <div className={styles.cardRow}>
                <BenchCard card={team.g} active={true} func={selectForEdit} posId={GamePosition.G}/>

             
             
                  </div>
      
              <hr className={styles.blueLine}/>
              <br />
              <button className={styles.pfButton} type="submit">CREATE GAME</button>
              <br /><br />
              <hr className={styles.smallRedLine} />
              <br />
                  </form>
              </div>
            </div>
            :
            <div className={styles.contentContainer}>
                <div className={styles.rinkDiv}>
                    <form onSubmit={buildTeamHandler}>
                    <h2>Create Game:</h2>
                    <hr className={styles.smallRedLine} /><br />
                <div className={styles.inputDiv}>
                <label htmlFor="howMuch">Puck Wager:  </label><br />
                <input name="howMuch" id="howMuch" type="number" placeholder="1" required/>
                </div><br />
                <hr className={styles.blueLine}/><br />
                <ToggleSwitch tog={togg}/>

                {/* <ToggleSwitch toggle={isPrivateGame} setToggle={setIsPrivateGame} label="Public"/> */}
                <br />
                <hr className={styles.centerLine}/>
                <br /> 
                <div className={styles.inputDiv}>
                <label htmlFor="howMuch">Other Property: </label><br />
                <input name="other" id="other" type="number" placeholder="1" required/>
                </div>
                <br />
                <hr className={styles.blueLine}/>
                <br />
                <button className={styles.pfButton} type="submit">BUILD TEAM</button>
                <br /><br />
                <hr className={styles.smallRedLine} />
                <br />
                    </form>
                </div>
            </div>
            }
         
       
       
        </div>
    )
}

export default CreateGame