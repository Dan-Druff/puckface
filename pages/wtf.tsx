import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
const Wtf: NextPage = () => {
    return (
        <div className={styles.contentContainer}>
            
            <div className={styles.rinkDiv}>
            <h2>WTF:</h2>
            <hr className={styles.smallRedLine}/>
            <br /><p>PUCKFACE Hockey is an App which allows users to collect digital hockey cards that are used to play fantasy lineups against other Puckface GMs.</p>
            <br /><p>It is currently in testing and being developed without the use of a crypto wallet. BUT, the game is being built with NFT&#39;s and Smart Contracts in mind, so when the game is ready, we just have to change some constants and functions to switch it over.</p>
            <br /><p>The reason for this is so we can focus on making the game fun, before we deal with real money and all the security issus that come with that.</p>
            <hr className={styles.blueLine}/>
            <br /><p>The idea is that everyone is the GM of their own rosters and you can trade / sell cards to all Puckface GMs to suit your style of play. Each GM has their own trading block, and you can browse through other cards that have been put on their respective trading blocks.</p>
            <br /><p>All you need is a single pack of cards to get started. Each pack contains 8 cards. 2 Random Positions, 3 Forwards, 2 Defense and 1 Goalie.</p>
            <br /><p>A game of Puckface requires 6 cards to play. 3 Forwards, 2 Defense and 1 Goalie.</p>
            <br /><p>The points each card produces is determined by how well that player does in real life that day, plus the &#39;Rarity&#39; multplier property each card has.</p>
            <br /><p>Each NHL player has 13 cards associated with them. 1 Unique, 2 Super-Rare, 4 Rare and 6 Standard. 10881 cards in total.</p>
            <hr className={styles.centerLine}/>
            <br /><p>You can have as many cards and play as many games as you like, but each card can only be in one lineup per day.</p>
            <br /><p>There was an idea to add some kind of bonus vintage cards to the collection, that do different things when played.</p>
            <br /><p>Want to access that nostalgic feeling of opening up a new pack of cards, and also the feeling of the sports stickerbooks somehow?</p>
            <hr className={styles.blueLine}/>
            <br /><p>There will be one main league (PHL) that competes every day of NHL hockey, and GMs can create their own private leagues with their friends or other random GMs.</p>
            <br /><p>You also have the option to just play one-off games that dont require being in a league.</p>
            <br /><p>The App just has some basic styling at this point, but by the launch of next season I want it to look as good as sorare.com, or better.</p>
            <br /><p>And the new card designs look dope...</p>
            <hr className={styles.smallRedLine}/>
            <br /><p>It hasnt been decided which crypto to use yet? I have been testing with Ethereum, Polygon, Harmony and Hedera so far. Each have their own drawbacks. </p>
            <br /><p>I might just use stripe to collect Visa and/or Paypal information for the inaugural seeason. Ideally it would have its own crypto token |PUCK| to use. One thing I learned while learning to program crypto, is that its mostly about trust. I could make this app in a conventional way, and have it work without crypto, but I was inspired initially to make this because of crypto. So there is a conversation to be had here.</p>
            <br /><p>I half feel that if I make this a crypto only app, I may not get the user base we need right away to make it exciting.</p>
            </div>
        </div>
    )
}
export default Wtf