import styles from '../styles/Title.module.css';
import useWindowSize from '../hooks/useWindowSize';

export default function Title() {
  const { width } = useWindowSize()

  return (
    <div className={styles.main}>
      <h2>Migrants on the Move</h2>
      <h6>Risks of West African Migration</h6>
    </div>
  );
}
