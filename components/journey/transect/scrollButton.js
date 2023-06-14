import {useEffect, useState} from "react";
import styles from '../../../styles/ScrollButton.module.css';

export default function ScrollButton ({width}) {
  const [isForward, setIsForward] = useState(true);

  const handleScroll = () => {
      window.scrollTo(isForward ? width : 0, 0); // Change the scroll amount as per your requirement
      setIsForward(!isForward);
  };

  return (
    <div>
      {
        isForward ?
        <button onClick={handleScroll} className={styles.scrollButton} style={{ right: '.5rem'}}>
          <div className={` ${styles.scrollContainer} ${styles.blink}`}>
            <div className={ `${styles.scrollButtonText} body-5` }>
              Scroll to <br/>view more
            </div>
          <span className="material-symbols-outlined">
            keyboard_arrow_right
          </span>
          </div>
        </button>
          :
        <button onClick={handleScroll} className={styles.scrollButton} style={{ left:'.5rem'}}>
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
