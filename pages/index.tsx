import type { NextPage } from 'next'
import styles from '../styles/All.module.css'
import { dateReader, getTodaysSchedule } from '../utility/helpers'
const Home: NextPage = () => {
  let r = new Date()
  r.setDate(r.getDate() -1);
  const y = dateReader(r);
  getTodaysSchedule(y.yearNumber.toString(), y.monthNumber.toString(),y.dayNumber.toString()).then((m) => {
    console.log("Date is: ", m);
  });

  return (
    <div className={styles.contentContainer}>
      <h2>TEST APP</h2>
    </div>
  )
}

export default Home
