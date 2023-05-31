import {useEffect, useState} from "react";
import styles from '../../../styles/ScrollButton.module.css';

export default function ScrollButton ({isForward, updateScrollPosition, isAtBeginning, isAtEnd}) {
  const [isAutoScrolling, setAutoScrolling] = useState(false);
  const [scrollInterval, setScrollInterval] = useState(null);

  const handleScroll = () => {
    if (!isAutoScrolling) {
      setAutoScrolling(true);
      const scrollInterval = setInterval(() => {

        // Scroll horizontally by a specific amount
        window.scrollBy(isForward ? 10 : -10, 0); // Change the scroll amount as per your requirement
        updateScrollPosition()
      }, 20); // Change the delay to adjust the scroll speed
      setScrollInterval(scrollInterval);
    } else {
      clearInterval(scrollInterval);
      setAutoScrolling(false);
      setScrollInterval(null);
    }
  };

  return (
    <button onClick={handleScroll} className={styles.scrollButton} style={{ right: isForward ? '1%' : '97%' }}>
      {isAutoScrolling ?
        <div className={styles.scrollContainer}>
        <span className="material-symbols-outlined">
          close
        </span>
        </div>
         :
        isForward ?
        <div className={` ${styles.scrollContainer} ${isAtEnd? '': styles.blink}`}>
          <span className="material-symbols-outlined">
          keyboard_double_arrow_right
        </span>
        </div>
         :
        <div className={`${styles.scrollContainer } ${isAtBeginning? '': styles.blink}`}>
          <span className="material-symbols-outlined">
          keyboard_double_arrow_left
        </span>
        </div>}
    </button>
  );
}
