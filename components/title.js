import styles from '../styles/Title.module.css';
import useWindowSize from '../hooks/useWindowSize';

export default function Title() {
  const { width } = useWindowSize()

  return (
    <div className={styles.main}>
        <a href="/">
            <img className={styles.title} src="../images/logo_Migrants on the Move.svg" alt="Migrants on the Move: Risks of West African Migration logo" />
        </a>
    </div>
  );
}
