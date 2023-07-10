import {useEffect, useState} from "react";
import styles from '../../../styles/ScrollButton.module.css';

export default function ScrollButton ({width}) {
  const [isForward, setIsForward] = useState(true);
  const handleScrollClick = () => {
    window.scrollBy(isForward ? width : -width, 0);
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.scrollX;
    setScrollPosition(position);
    const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
    if (position >= maxScrollX) {
      setIsForward(false);
    } else if (position <= 0) {
      setIsForward(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {
        isForward ?
        <button onClick={handleScrollClick} className={styles.scrollButton} style={{ right: '.5rem'}}>
          <div className={` ${styles.scrollContainer} ${styles.blink}`}>
            <div className={`${styles.scrollButtonText}`}>
              Scroll to <br/>view more
            </div>

            </div>
          <span className="material-symbols-outlined">
            keyboard_arrow_right
          </span>
        </button>
          :
        <button onClick={handleScrollClick} className={styles.scrollButton} style={{ left:'.5rem'}}>
          <div className={`${styles.scrollContainer } ${styles.blink}`}>
            <span className="material-symbols-outlined">
            keyboard_arrow_left
            </span>
            <div className={`${styles.scrollButtonText}`}>
              Scroll back
            </div>
          </div>
        </button>
      }
    </div>

  );
}
