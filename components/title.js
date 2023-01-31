import styles from '../styles/Title.module.css';
import useWindowSize from '../hooks/useWindowSize';

export default function Title() {
  const { width } = useWindowSize()

  return (
    <div className={styles.main}>
      <h2>Crossing the Sahara</h2>
      {
        width > 700 && (
          <h6>Risks of West African Migration</h6>
        )
      }
    </div>
  );
}
