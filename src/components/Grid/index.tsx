import React from "react";
import clsx from "clsx";

import styles from "./styles.module.css";

const Grid = ({ children, ...variants }) => {
  return (
    <div
      className={clsx(styles.grid, {
        [styles.vertical]: variants.vertical,
      })}
    >
      {children}
    </div>
  );
};

export default Grid;
