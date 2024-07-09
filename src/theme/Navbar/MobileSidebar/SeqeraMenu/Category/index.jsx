import React from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import AngleDown from "../../../Layout/SeqeraHeader/_shared/angle-down.inline.svg";

import styles from "./styles.module.css";

const Category = ({
  label,
  children,
  selectedCategory,
  setSelectedCategory,
}) => {
  const isOpen = selectedCategory === label;
  const toggle = () => {
    if (isOpen) setSelectedCategory(null);
    else setSelectedCategory(label);
  };

  const navVariants = {
    enter: { height: 0, opacity: 0 },
    idle: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  const transition = {
    ease: "easeOut",
    duration: 0.3,
  };

  return (
    <div className={clsx(styles.category, { [styles.active]: isOpen })}>
      <button type="button" onClick={toggle}>
        <span>{label}</span>
        <AngleDown />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.categoryBody}
            initial="enter"
            animate="idle"
            exit="exit"
            variants={navVariants}
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Category;
