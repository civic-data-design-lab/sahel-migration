import styles from '../styles/Title.module.css';
import useWindowSize from '../hooks/useWindowSize';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Title({}) {
  const { width } = useWindowSize();
  const router = useRouter();
  const handleRouting = (href) => {
    return async (e) => {
      e.preventDefault();
      router.push(href);
    };
  };

  return (
    <div className={styles.main}>
      <Link onClick={handleRouting('/')} href="/">
        <object
          type="image/svg+xml"
          data="../images/logo_Migrants on the Move.svg"
          className={styles.title}
          alt="Migrants on the Move: Risks of West African Migration title logo"
        ></object>
      </Link>
    </div>
  );
}
