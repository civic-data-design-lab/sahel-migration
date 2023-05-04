import styles from '../styles/Title.module.css';
import useWindowSize from '../hooks/useWindowSize';
import Link from 'next/link';

export default function Title() {
  const { width } = useWindowSize();

  return (
    <div className={styles.main}>
      <Link href="/">
        <object
          type="image/svg+xml"
          data="../images/logo_Migrants on the Move.svg"
          className={styles.title}
          alt="Migrants on the Move: Risks of West African Migration logo"
        ></object>
      </Link>
    </div>
  );
}
