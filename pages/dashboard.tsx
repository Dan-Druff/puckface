import type { NextPage } from 'next'
import styles from '../styles/All.module.css'


const Renderer = (Wrapped:any) => {
    return function New(props:any){
        return <Wrapped {...props}/>
    }
}
const Child = (props:any) => {
    return (
        <h1>Hello from child {props.name}</h1>
    )
}
const Dashboard: NextPage = () => {
    const C = Renderer(Child);

    return (
        <div className={styles.mainContainer}>
            <h2>Dashboard</h2>
            <C name="Cunt" />
        </div>
    )
}
export default Dashboard