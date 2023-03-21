import React, { useState } from "react";
import styles from "../styles/TransectToggle.module.css";

const TransectToggle = ({items, toggleItem}) => {

  return (
    <div className={styles.selectors}>
      {
        items.map((item) => (
          <span key={item.id}>

          <button className={styles.button} onClick={() => toggleItem(item)}>
            <div className={`${styles.selector} ${item.show? styles.show: ''}`}/>
            <span className={styles.descriptor}>
              {item.type}
            </span>
          </button>
          </span>
        ))
        }
    </div>
  );
};

export default TransectToggle;
