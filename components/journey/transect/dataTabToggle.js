import styles from '../../../styles/DataTabToggle.module.css'

export default function DataTabToggle({ isOpen, toggleOpen }) {
  return (<>
    <button className={styles.toggleButton} onClick={toggleOpen}>
      <h3 className="font-sans">Explore the Risks</h3>
      {isOpen ?
        <span className="material-symbols-outlined">expand_more</span> :
        <span className="material-symbols-outlined">expand_less</span>
      }
    </button>
  </>)
}

