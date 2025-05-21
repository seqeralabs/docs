import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type Props = {
  toggleMenu: () => void;
  isOpen: boolean;
};

const Hamburger: React.FC<Props> = ({ toggleMenu, isOpen }) => {
  return (
    <div
      className={clsx(styles.hamburger, { [styles.open]: isOpen })}
      onClick={toggleMenu}
    >
      <span />
      <span />
      <span />
    </div>
  );
};

export default Hamburger;
