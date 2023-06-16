import styles from '../../styles/DescriptionTab.module.css';
import {useEffect, useState} from "react";
import * as d3 from "d3";

export default function DescriptionTab({body, scrollXProgress, entourages, width}) {
  const initialDescription = body;
  const [description, setDescription] = useState(body);
  const [hasChanged, setHasChanged] = useState(false);
  useEffect(() => {
    scrollXProgress.on('change', updateDescription);
  }, [scrollXProgress,window.innerWidth]);

  const updateDescription = (latest) => {
    if (window.innerWidth < 480) {
      let hasChanged = false;
      for (const entourage of entourages) {
        if (latest >= entourage.scrollStart && latest <= entourage.scrollEnd) {
          hasChanged = true;
          setDescription(entourage.body);
          break; // Exit the loop if a match is found
        }
      }
      setHasChanged(hasChanged)
    } else {
      setHasChanged(false)
    }

  };
  return (
    <div className={styles.main}>
      {hasChanged ?
      <div className={styles.mainCard}>
        <small className="body-3">{description}</small>
      </div>
      :
      <div className={styles.description}>
        <small className="body-3">{initialDescription}</small>
      </div>
      }
    </div>
  );
}
