import React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

const Grid = ({ children, ...variants }) => {
  return (
    <div
      className={classNames(styles.grid, {
        [styles.vertical]: variants.vertical,
      })}
    >
      {children}
    </div>
  );
};

export default Grid;
