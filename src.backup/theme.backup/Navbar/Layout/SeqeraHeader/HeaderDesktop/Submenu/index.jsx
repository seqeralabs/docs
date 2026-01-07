import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Resources from "./Resources";
import { useHeaderContext } from "../../context";
import clsx from "clsx";
import styles from "./submenu.module.css";

const navVariants = {
  enter: { y: -20, opacity: 0 },
  idle: { y: 0, opacity: 1 },
  exit: { opacity: 0, y: -20 },
};

const transition = {
  ease: "easeOut",
  duration: 0.2,
};

const Submenu = ({ hideMenu }) => {
  const { activeMenu, isMenuOpen } = useHeaderContext();
  // const activeMenu = "resources";
  // const isMenuOpen = true;
  if (hideMenu) return null;
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial="enter"
          animate="idle"
          exit="exit"
          variants={navVariants}
          transition={transition}
          className={styles.submenu}
        >
        
            <div className={styles.submenuContent}>
              {activeMenu === "resources" && <Resources />}
            </div>
       
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Submenu;
