
import styles from '../styles/All.module.css';

import { ToggleType } from '../utility/constants';
const ToggleSwitch = (tog:ToggleType) => {
    let msg = tog.label;
if(tog.label === 'Public'){
    if(tog.toggle){
      msg = 'Private';
    }
}
if(tog.label === 'Playoffs'){
  if(!tog.toggle){
    msg = 'Season Only';
  }
}
const onToggle = () => tog.setToggle(!tog.toggle);
    return (
        <div>
          <p>{msg}</p>
          <label className={styles.toggleswitch}>
            <input type="checkbox" checked={tog.toggle} onChange={onToggle} />
            <span className={styles.switch} />
          </label>
        </div>
      );
}
export default ToggleSwitch