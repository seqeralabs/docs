import React from "react";
import clsx from "clsx";

import styles from "./styles.module.css";

const EventPanel = ({ className, children, highlighted }) => {
  return (
    <div
      className={clsx(styles.panel, className, {
        [styles.highlighted]: highlighted,
      })}
    >
      {children}
    </div>
  );
};

export default EventPanel;
