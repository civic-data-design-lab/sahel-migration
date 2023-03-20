import styles from '../styles/DataTabToggle.module.css'

export default function DataTabToggle({ isOpen, toggleOpen }) {
  return (<>
    <button className={styles.toggleButton} onClick={toggleOpen}>
      <h2>Explore Risks</h2>
      {isOpen ?
        <span className="material-symbols-outlined">expand_more</span> :
        <span className="material-symbols-outlined">expand_less</span>
      }
    </button>
  </>)
}
