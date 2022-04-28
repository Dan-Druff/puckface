import styles from '../styles/All.module.css';
import { BenchCardType} from '../utility/constants';
import Image from 'next/image'


// const BenchCard = ({benchCardObj}:{benchCardObj:BenchCardType}) => {

//     if(benchCardObj.active){
//         return (
//             <div className={styles.benchCard} onClick={() => benchCardObj.func(benchCardObj.posId, benchCardObj.card.tokenId)}>
               
//                 <img alt='alt img' className={styles.cardImage} src={benchCardObj.card.image}/>
//                {benchCardObj.card.playingTonight && <p>Playing</p>}
                
//                 </div>
//           )
//     }else{
//         return (
//             <div className={styles.benchCard}>
               
//                 <img className={styles.cardImage} src={benchCardObj.card.image}/>
//                {benchCardObj.card.playingTonight && <p>Playing</p>}
                
//                 </div>
//           )
//     }

// }
const HomeCard = (props:BenchCardType) => {

    return (
        <div className={styles.benchCardHome}>
           
            <img alt={`alt${props.card.playerName} ${props.card.tokenId}`} className={styles.cardImage} src={props.card.image}/>
            {/* <div className={styles.imageContainer}>
           <Image width={665} height={665} src={props.card.image} className={styles.image} layout="fill" alt="altPic"/>
            </div> */}
        <p>{props.card.playerName}</p>
            </div>
      )

}

export default HomeCard