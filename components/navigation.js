import styles from '../styles/Navigation.module.css'
import Link from "next/link";

export default function Navigation({journeys, journey}) {
  return (
    <div className={styles.navigationBar}>
      {journey.id > 1 ? <Link className={styles.button} href={'/journeys/[id]'} as={'/journeys/'+(journey.id-1)}>
        <span className="material-symbols-outlined" style={{transform: 'scale(-1,-1)'}}>arrow_forward_ios</span>
        <h7>{journey.id > 1 ? journeys.find(item => item.id === journey.id-1).title: ' '}</h7>
      </Link>:<div></div>}
      <h7 className={styles.title}>{journey.title}</h7>
      {journey.id < 7? <Link className={styles.button} href={'/journeys/[id]'} as={'/journeys/'+(journey.id+1)}>
        <h7>{journey.id < 7 ? journeys.find(item => item.id === journey.id+1).title: ' '}</h7>
        <span className="material-symbols-outlined">
          arrow_forward_ios
        </span>
      </Link>:<div></div>}
    </div>)
}
