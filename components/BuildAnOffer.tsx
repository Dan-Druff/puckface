import styles from '../styles/All.module.css';
import {BuildOfferType, CardType} from '../utility/constants';
// import BenchCard from './BenchCard';
import OfferCard from './OfferCard';
const BuildAnOffer = (props:BuildOfferType) => {

    const selectPlayer = (card:CardType) => {
        console.log("selecting: ", card.playerName);
        if(props.offeredTokens.indexOf(card.tokenId) > -1){
            props.remove(card.tokenId);
        }else{
            props.add(card.tokenId);
        }
    }
  return (
    <div className={styles.popupBench}>
        <div className={styles.leftDiv}>
        {props.guys.map((guy) => {
                return (
                    <OfferCard key={guy.tokenId} card={guy} func={selectPlayer} selected={props.offeredTokens.indexOf(guy.tokenId) > -1 ? true : false}/>

                    // <OfferCard key={guy.tokenId} card={guy} func={selectPlayer} selected={false}/>
                    // <BenchCard key={guy.tokenId} card={guy} active={true} func={selectPlayer} posId={'none'}/>
                )
            })}
            </div>
            <div className={styles.rightDiv}>
                <h2>SELECT CARDS TO OFFER:</h2>
                {props.offeredTokens.map((tok) => {
                    return (
                        <p key={tok}>Token: {tok}</p>
                    )
                })}
                <p>Will need a type here; There are {props.offeredTokens.length} guys</p>
                <button onClick={() => props.doAdd()} className={styles.pfButton}>ADD CARDS TO OFFER</button>
                <button onClick={() => props.dismiss()} className={styles.pfButton}>CANCEL?</button>

            </div>
        
     
    </div>
  )
}

export default BuildAnOffer