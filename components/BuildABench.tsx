import styles from '../styles/All.module.css';
import BenchCard from './BenchCard';
import RightBenchCard from './RightBenchCard';
import PFButton from './PFButton';

const BuildABench = ({guys,dispatch,prevPlayer,setEditing, game}) => {
  
    const selectPlayer = (posId, tokenId) => {
        console.log("Selecting: ", posId);
        console.log("Token Id: ", tokenId);
        console.log("What is game: ", game);
        dispatch({type:DASHBOARD_ACTIONS.selectPlayer,payload:{tokenId:tokenId,game:game}})
    }
    const dismiss = () => {
        setEditing(false);
    }
  return (
    <div className={styles.popupBench}>
        {/* <div className={styles.contentContainer}><h3>I AM BENCH</h3></div> */}
        <div className={styles.leftDiv}>
            {guys.map((guy) => {
                return (
                    <BenchCard key={guy.tokenId} card={guy} active={true} func={selectPlayer} posId='na'/>
                )
            })}

  
      
        </div>
        <div className={styles.rightDiv}>
            <p>Replacing:</p>
        <RightBenchCard card={prevPlayer}/>
        <PFButton title="CANCEL" func={dismiss}/>
        </div>
    </div>
  )
}

export default BuildABench