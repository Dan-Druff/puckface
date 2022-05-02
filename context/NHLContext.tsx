import {createContext, useReducer, useContext,useEffect,useState} from 'react';
import type { ReactNode } from 'react';
export type NHLActions = 'increment' | 'decrement'
import { dateReader } from '../utility/helpers';
import type {NHLGamesArray,PuckfaceDate} from '../utility/constants'
let games:NHLGamesArray = [];
const defaultState = games;

export type NHLState = typeof defaultState
export type NHLDispatch = (action:NHLActions) => void
const getSchedule = async(date:PuckfaceDate):Promise<NHLGamesArray | false> => {
    try {
        const raw = await fetch(`https://statsapi.web.nhl.com/api/v1/schedule?date=${date.yearNumber}-${date.monthNumber}-${date.dayNumber}`);
        const formatted = await raw.json()
     
        let puckfaceGamesArray:NHLGamesArray = [];
        if(formatted.totalGames < 1){
            console.log("NO GAMES TOFAY");
            return puckfaceGamesArray;

        }
        let gameArray = formatted.dates[0].games;
     
        gameArray.forEach((game:any) => {
          if(game.gameType === 'R'){
            let o = {
                awayId:game.teams.away.team.id,
                awayName:game.teams.away.team.name,
                awayRecord:game.teams.away.leagueRecord.wins.toString() + '-'+game.teams.away.leagueRecord.losses.toString() + '-' + game.teams.away.leagueRecord.ot.toString(),
                homeId:game.teams.home.team.id,
                homeName:game.teams.home.team.name,
                homeRecord:game.teams.home.leagueRecord.wins.toString() + '-'+game.teams.home.leagueRecord.losses.toString() + '-' + game.teams.home.leagueRecord.ot.toString(),
                description:game.teams.away.team.name + ' @ ' + game.teams.home.team.name
            }
            puckfaceGamesArray.push(o);
          }
          if(game.gameType === 'P'){
            let o = {
                awayId:game.teams.away.team.id,
                awayName:game.teams.away.team.name,
                awayRecord:game.teams.away.leagueRecord.wins.toString() + '-'+game.teams.away.leagueRecord.losses.toString(),
                homeId:game.teams.home.team.id,
                homeName:game.teams.home.team.name,
                homeRecord:game.teams.home.leagueRecord.wins.toString() + '-'+game.teams.home.leagueRecord.losses.toString(),
                description:game.teams.away.team.name + ' @ ' + game.teams.home.team.name
            }
            puckfaceGamesArray.push(o);
          }
          if(game.gameType === 'A'){
              console.log("AllsTar Game tonight");
              // HAVE SPECIAL CONDITIONS FOR ALL STAR GAMES
          }
    
        
        })
   
   
        return puckfaceGamesArray;
    } catch (e) {
        console.log("Getschederror: ", e);
        return false;
    }
}
const NHLContext = createContext<{tonightsGames:NHLState} | undefined>(undefined);


export function NHLProvider({children}:{children:ReactNode}){
    const [tonightsGames, setTonightsGames] = useState<NHLGamesArray>(defaultState)
   
    useEffect(() => {
        const initNhl = async() => {
            // do async function with 'today'        
            let today = dateReader(new Date())
            const sced = await getSchedule(today);
            if(sced && sced.length > 0){
                setTonightsGames(sced);
            }
      
    
        }
        initNhl();
    
      return () => {
     
      }
    }, [])
    let nhlVal = {
        tonightsGames:tonightsGames
    }
    return (
        <NHLContext.Provider value={nhlVal}>{children}</NHLContext.Provider>
    )
}

export function useNHL(){
    const context = useContext(NHLContext)
    if(!context) throw new Error('🚦Must Be used in NHL context🚦')
    return context; 
    

}