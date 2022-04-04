import { createContext, ReactNode, useContext, useReducer, useState } from "react";
export type DashboardActions = {type:'clear'} | {type:'create'} | {type:'login'} | {type:'signup'}
export interface CardType {
    playerName:string,
    playerId:string
}

export type DashboardType = CardType[];
export interface AllDashType {
    dashboard:DashboardType | null,
    pucks:number
}
const DashboardContext = createContext<AllDashType>({dashboard:null, pucks:0});


function dashboardReducer(state:DashboardType, action:DashboardActions){
    switch (action.type) {
        case 'clear':
            return state;
        case 'create':
            return state;
        case 'login':
            return state;
        case 'signup':
            return state;        
        default:
            return state;
    }
}
export const DashboardProvider = ({children}:{children:ReactNode}) => {
    const [dashboard, setDashboard] = useReducer(dashboardReducer, []);
    const [pucks, setPucks] = useState<number>(0);
    let allVal = {
        dashboard:dashboard,
        pucks:pucks
    }
    return (
        <DashboardContext.Provider value={allVal}>{children}</DashboardContext.Provider>
    )
}
export function useDashboard(){
    return useContext(DashboardContext);
}