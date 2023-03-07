import React, { useState } from "react";

const TransectToggle = ({items, toggleItem}) => {

  return (
    <div>
      {
        items.map((item) => (
          <div key={item.id}>
          <button onClick={() => toggleItem(item)}>
            {item.type}-{item.show.toString()}
          </button>
          </div>
        ))
        }
    </div>
  );
};

export default TransectToggle;
