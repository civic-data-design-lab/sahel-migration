import styles from '../../../styles/DataTabToggle.module.css';

export default function DataTabToggle({ isOpen, toggleOpen }) {
  return (
    <>
      <button className={styles.toggleButton} onClick={toggleOpen}>
        <h3 className="header-2">Explore the Risks</h3>
        {isOpen ? (
          <span className="material-symbols-outlined" style={{ color: '#463c35', fontSize: '2rem' }}>expand_more</span>
        ) : (
          <span className="material-symbols-outlined" style={{ color: '#463c35', fontSize: '2rem' }}>expand_less</span>
        )}
      </button>
    </>
  );
}
