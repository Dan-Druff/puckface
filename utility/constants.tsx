export const multipliers = {
    standard:1,
    rare:1.5,
    superRare:2,
    unique:3
}
export const baseURL = 'https://ipfs.io/ipfs/bafybeiedfdak44r7owq5ytvvgb6cywkpfcnhlauroqqlrr7ta3jt2yqhee/files/';

export const PRICE_PER_PACK = 18;

export interface ToggleType {
    label:string,
    setToggle:(toggle:boolean) => void,
    toggle:boolean
}
export interface BuildABenchType {
    guys:string,
    dispatch:string,
    prevPlayer:string,
    setEditing:string,
    game:string,
}