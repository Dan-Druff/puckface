import styles from '../styles/All.module.css';
import BenchCard from './BenchCard';
import RightBenchCard from './RightBenchCard';

import { BuildABenchType } from '../utility/constants';
import type { GamePosition } from '../utility/constants';
import { useDashboard } from '../context/DashboardContext';
// const BuildABench = ({benchObj}:{benchObj:BuildABenchType}) => {
const BuildABench = (props:BuildABenchType) => {
    const {prevPlayer,dashboardDispatch} = useDashboard();
    const selectPlayer = (posId:GamePosition, tokenId:number) => {
        console.log("Selecting: ", posId);
        console.log("Token Id: ", tokenId);
        console.log("What is game: ", props.game);
        dashboardDispatch({type:'selectPlayer',payload:{game:props.game, tokenId:tokenId}})
    }
    const dismiss = () => {
        dashboardDispatch({type:'cancelEdit'});
    }
    
  return (
    <div className={styles.popupBench}>
        {/* <div className={styles.contentContainer}><h3>I AM BENCH</h3></div> */}
        <div className={styles.leftDiv}>
            {props.guys.map((guy) => {
                return (
                    <BenchCard key={guy.tokenId} card={guy} active={true} func={selectPlayer} posId={'none'} avail={true}/>
                )
            })}

  
      
        </div>
        <div className={styles.rightDiv}>
            <p>Replacing:</p>
        <RightBenchCard card={prevPlayer}/>
        <button className={styles.pfButton} onClick={() => dismiss()}>CANCEL</button>
  
        </div>
    </div>
  )
}

export default BuildABench