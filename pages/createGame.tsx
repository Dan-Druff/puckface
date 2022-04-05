import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import ToggleSwitch from '../components/ToggleSwitch'
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createRandomId } from '../utility/helpers';
import { useDashboard, GameType, GameStates } from '../context/DashboardContext';
import { useRouter } from 'next/router';
import { useGameState } from '../context/GameState';

const CreateGame: NextPage = () => {
    const {userData} = useAuth();
    const {editing} = useDashboard();
    const {gameStateDispatch} = useGameState();
    const [isPrivateGame, setIsPrivateGame] = useState<boolean>(false);
    const [buildingTeam, setBuildingTeam] = useState<boolean>(false);
    const [gameObject, setGameObject] = useState<GameType>({open:true,awayEmail:'',awayName:'',homeEmail:'',homeName:'',date:new Date(),id:createRandomId(),value:0,private:false,gameState:GameStates.init,homeTeam:{lw:0,c:0,rw:0,d1:0,d2:0,g:0},awayTeam:{lw:0,c:0,rw:0,d1:0,d2:0,g:0}});

    return (
  
        <div className={styles.mainContainer}>
            <h3>CREATING GAME SUCKA</h3>
            {/* {editing && 
            <BuildABench guys={availableGuys} dispatch={dashboardDispatch} prevPlayer={prevPlayer} setEditing={setEditing} game={gameObject}/>
            } */}
            {/* {buildingTeam ?
            <div className={styles.contentContainer}>
              <div className={styles.rinkDiv}>
                  <form onSubmit={createGameHandler}>
                  <h2>Build Team:</h2>
                  <hr className={styles.smallRedLine} />
                  <div className={styles.cardRow}>
                    <BenchCard card={team.lw} active={true} func={selectForEdit} posId='lw'/>
                    <BenchCard card={team.c} active={true} func={selectForEdit} posId='c'/>
                    <BenchCard card={team.rw} active={true} func={selectForEdit} posId='rw'/>

             
                  </div>
            
              <hr className={styles.blueLine}/>
              <div className={styles.cardRow}>
                <BenchCard card={team.d1} active={true} func={selectForEdit} posId='d1'/>
                <BenchCard card={team.d2} active={true} func={selectForEdit} posId='d2'/>

                 
             
                  </div>
              <hr className={styles.centerLine}/>
              <div className={styles.cardRow}>
                <BenchCard card={team.g} active={true} func={selectForEdit} posId='g'/>

             
             
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
                <ToggleSwitch toggle={isPrivateGame} setToggle={setIsPrivateGame} label="Public"/>
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
            } */}
         
       
       
        </div>
    )
}

export default CreateGame