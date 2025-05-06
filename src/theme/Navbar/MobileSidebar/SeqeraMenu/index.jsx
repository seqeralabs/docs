import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Help from "./Category/Help";
import Company from "./Category/Company";
import NavbarMobilePrimaryMenu from "../PrimaryMenu";
import styles from "./styles.module.css";

const Menu = () => {
  const navVariants = {
    enter: { y: -20, opacity: 0 },
    enter2: { y: 60, opacity: 0 },
    idle: { y: 0, opacity: 1 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, delay: 0 } },
    exit2: { opacity: 0, y: 20, transition: { duration: 0.2, delay: 0 } },
  };

  const transition = {
    ease: "easeOut",
    duration: 0.2,
    delay: 0.2,
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial="enter"
          animate="idle"
          exit="exit"
          variants={navVariants}
          transition={transition}
          className={`${styles.mobileMenu}`}
        >
          <div className="flex flex-row space-x-2 px-4 mb-4 mt-2">
            <a
              className={clsx(styles.button, {}, "w-full text-center")}
              href="https://cloud.seqera.io/login"
            >
              Log In
            </a>
            <a
              className={clsx(
                styles.button,
                styles.secondary,
                {},
                "w-full text-center",
              )}
              href="https://cloud.seqera.io/login"
            >
              Sign Up
            </a>
          </div>

          <div className="px-1 pb-2 border-b border-b-gray-600">
            <NavbarMobilePrimaryMenu />
          </div>

          <div className="px-4 flex flex-row">
            <Help />
            <Company />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Menu;
