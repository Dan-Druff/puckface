import type { NextPage } from 'next'
import styles from '../styles/All.module.css';
import LeagueForm from '../components/LeagueForm';
const CreateLeague: NextPage = () => {
    return (
        <div className={styles.contentContainer}>
            <LeagueForm />
    
        </div>
    )
}
export default CreateLeague