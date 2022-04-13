import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
const Wtf: NextPage = () => {
    return (
        <div className={styles.mainContainer}>
            <h2>What is this?</h2>
            <br /><h3>PUCKFACE Hockey is an App (in Beta testing) which allows users to collect digital hockey trading cards, that can be used to play fantasy games against other puckface users.</h3>
            <br /><h3>It is currently being developed without the use of a crypto wallet. BUT, the game is being built with NFT&#39;s and Smart Contracts in mind, so when it&#39;s ready, we just have to change a few constants and functions, and switch it over.</h3>
            <br /><h3>  The reason for this is so we can focus on making the game fun, before we set it up so people can actually cash out their winnings.</h3>
            <br /><h3>All you need is a single pack of cards to get going. Each pack contains 8 cards. 2 Random Positions, 3 Forwards, 2 Defense and 1 Goalie.</h3>
            <br /><h3>A game of Puckface requires 6 cards to play. 3 Forwards, 2 Defense and 1 Goalie.</h3>
            <br /><h3>The points they accumulate depend on how well that player does in real life, plus the &#39;Rarity&#39; multplier property each card has.</h3>
            <br /><h3>Each NHL player has 10 cards. 1 Unique, 2 Super-Rare, (4) Rare and (6) Standard. </h3>
            <br /><h3>You can play as many games as you like, but each card can only play in one per day.</h3>
        </div>
    )
}
export default Wtf